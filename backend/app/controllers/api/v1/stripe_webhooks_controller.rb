module Api
  module V1
    class StripeWebhooksController < ActionController::API
      # In API-only controllers, CSRF protection isn’t enabled so no need to skip it

      def receive
        payload = request.body.read
        sig_header = request.env['HTTP_STRIPE_SIGNATURE']
        endpoint_secret = ENV.fetch("STRIPE_WEBHOOK_SECRET")

        begin
          event = Stripe::Webhook.construct_event(payload, sig_header, endpoint_secret)
        rescue JSON::ParserError => e
          Rails.logger.error "Webhook error - Invalid payload: #{e.message}"
          return render json: { error: 'Invalid payload' }, status: 400
        rescue Stripe::SignatureVerificationError => e
          Rails.logger.error "Webhook error - Invalid signature: #{e.message}"
          return render json: { error: 'Invalid signature' }, status: 400
        end

        case event['type']
        when 'checkout.session.completed'
          process_checkout_session(event['data']['object'])
        when 'customer.subscription.created'
          process_subscription_created(event['data']['object'])
        when 'customer.subscription.updated'
          process_subscription_updated(event['data']['object'])
        when 'customer.subscription.deleted'
          process_subscription_deleted(event['data']['object'])
        else
          Rails.logger.info "Unhandled event type: #{event['type']}"
        end

        render json: { message: 'Success' }
      end

      private

      # For checkout.session.completed, the event data is a Stripe::Checkout::Session object.
      def process_checkout_session(session)
        # Use accessor methods provided by the Stripe object.
        customer_id = session.customer
        stripe_subscription_id = session.subscription
        plan_type = session.metadata["plan_type"]  # Instead of session.dig("metadata", "plan_type")

        user = User.find_by(stripe_customer_id: customer_id)
        unless user
          Rails.logger.error "User not found for customer id: #{customer_id}"
          return
        end

        subscription = user.subscription || user.build_subscription
        subscription.assign_attributes(
          stripe_subscription_id: stripe_subscription_id,
          plan_type: plan_type,
          status: 'active'
        )
        if subscription.save
          Rails.logger.info "Checkout session processed and subscription updated for user #{user.id}"
        else
          Rails.logger.error "Failed to save subscription for user #{user.id}: #{subscription.errors.full_messages.join(', ')}"
        end
      end

      # For customer.subscription.created, the event data is a Stripe::Subscription object.
      def process_subscription_created(subscription_data)
        customer_id = subscription_data.customer
        stripe_subscription_id = subscription_data.id
        status = subscription_data.status
        # Access metadata from the subscription object
        plan_type = subscription_data.metadata["plan_type"] || (subscription_data.plan && subscription_data.plan.nickname)

        user = User.find_by(stripe_customer_id: customer_id)
        unless user
          Rails.logger.error "User not found for customer id: #{customer_id} in subscription.created"
          return
        end

        subscription = user.subscription || user.build_subscription
        subscription.assign_attributes(
          stripe_subscription_id: stripe_subscription_id,
          plan_type: plan_type,
          status: status
        )
        if subscription.save
          Rails.logger.info "Subscription created for user #{user.id}"
        else
          Rails.logger.error "Failed to save subscription (created) for user #{user.id}: #{subscription.errors.full_messages.join(', ')}"
        end
      end

      # For customer.subscription.updated, update the subscription status.
      def process_subscription_updated(subscription_data)
        customer_id = subscription_data.customer
        user = User.find_by(stripe_customer_id: customer_id)
        unless user && user.subscription && user.subscription.stripe_subscription_id == subscription_data.id
          Rails.logger.error "Subscription not found or mismatch for customer id: #{customer_id} in subscription.updated"
          return
        end

        sub = user.subscription

        if subscription_data.cancel_at_period_end
          # Downgrade/cancellation: mark the new plan as pending.
          # Here we assume that when canceling, the new plan becomes "free".
          sub.pending_plan_type = 'free'
          # Note: sub.plan_type remains unchanged until the billing period ends.
        else
          # Upgrade: update immediately.
          new_plan_type = subscription_data.metadata["plan_type"] # Ensure Stripe sends this in metadata.
          sub.plan_type = new_plan_type
          sub.current_period_start = Time.at(subscription_data.current_period_start)
          sub.pending_plan_type = nil
        end

        sub.status = subscription_data.status

        if sub.save
          Rails.logger.info "Subscription updated for user #{user.id}"
        else
          Rails.logger.error "Failed to update subscription for user #{user.id}: #{sub.errors.full_messages.join(', ')}"
        end
      end

      # For customer.subscription.deleted, mark the subscription as canceled.
      def process_subscription_deleted(subscription_data)
        customer_id = subscription_data.customer
        stripe_subscription_id = subscription_data.id

        user = User.find_by(stripe_customer_id: customer_id)
        unless user && user.subscription && user.subscription.stripe_subscription_id == stripe_subscription_id
          Rails.logger.error "Subscription not found or mismatch for customer id: #{customer_id} in subscription.deleted"
          return
        end

        if user.subscription.update(status: 'canceled')
          Rails.logger.info "Subscription canceled for user #{user.id}"
        else
          Rails.logger.error "Failed to cancel subscription for user #{user.id}: #{user.subscription.errors.full_messages.join(', ')}"
        end
      end
    end
  end
end
