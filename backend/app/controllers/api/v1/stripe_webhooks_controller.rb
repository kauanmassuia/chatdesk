module Api
  module V1
    class StripeWebhooksController < ActionController::API
      # Disable CSRF protection for webhooks
      skip_before_action :verify_authenticity_token

      # Main webhook endpoint
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

        # Handle various event types
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

      # Process the initial checkout session completion
      def process_checkout_session(session)
        customer_id = session['customer']
        stripe_subscription_id = session['subscription']
        plan_type = session['metadata'] && session['metadata']['plan_type']

        user = User.find_by(stripe_customer_id: customer_id)
        unless user
          Rails.logger.error "User not found for customer id: #{customer_id}"
          return
        end

        # Create or update the user's subscription
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

      # Process a subscription.created event from Stripe
      def process_subscription_created(subscription_data)
        customer_id = subscription_data['customer']
        stripe_subscription_id = subscription_data['id']
        status = subscription_data['status']
        # You might extract plan details differently; using metadata from checkout is preferred.
        plan_type = subscription_data.dig('metadata', 'plan_type') || subscription_data.dig('plan', 'nickname')

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

      # Process a subscription.updated event from Stripe
      def process_subscription_updated(subscription_data)
        customer_id = subscription_data['customer']
        stripe_subscription_id = subscription_data['id']
        status = subscription_data['status']

        user = User.find_by(stripe_customer_id: customer_id)
        unless user && user.subscription && user.subscription.stripe_subscription_id == stripe_subscription_id
          Rails.logger.error "Subscription not found or mismatch for user with customer id: #{customer_id} in subscription.updated"
          return
        end

        if user.subscription.update(status: status)
          Rails.logger.info "Subscription updated for user #{user.id}"
        else
          Rails.logger.error "Failed to update subscription for user #{user.id}: #{user.subscription.errors.full_messages.join(', ')}"
        end
      end

      # Process a subscription.deleted event from Stripe (e.g., cancellation)
      def process_subscription_deleted(subscription_data)
        customer_id = subscription_data['customer']
        stripe_subscription_id = subscription_data['id']

        user = User.find_by(stripe_customer_id: customer_id)
        unless user && user.subscription && user.subscription.stripe_subscription_id == stripe_subscription_id
          Rails.logger.error "Subscription not found or mismatch for user with customer id: #{customer_id} in subscription.deleted"
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
