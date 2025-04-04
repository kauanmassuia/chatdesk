# app/controllers/api/v1/stripe_webhooks_controller.rb
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
        customer_id = session.customer
        stripe_subscription_id = session.subscription
        plan_type = session.metadata["plan_type"]

        user = User.find_by(stripe_customer_id: customer_id)
        unless user
          Rails.logger.error "User not found for customer id: #{customer_id}"
          return
        end

        subscription = user.subscription || user.build_subscription
        subscription.assign_attributes(
          stripe_subscription_id: stripe_subscription_id,
          plan_type: plan_type,
          status: 'active',
          current_period_start: Time.current,
          pending_plan_type: nil
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
          status: status,
          current_period_start: Time.current  # Initialize billing start
        )
        if subscription.save
          Rails.logger.info "Subscription created for user #{user.id}"
        else
          Rails.logger.error "Failed to save subscription (created) for user #{user.id}: #{subscription.errors.full_messages.join(', ')}"
        end
      end

      # Revisão da função process_subscription_updated
      def process_subscription_updated(subscription_data)
        customer_id = subscription_data.customer
        user = User.find_by(stripe_customer_id: customer_id)

        unless user && user.subscription && user.subscription.stripe_subscription_id == subscription_data.id
          Rails.logger.error "Subscription not found or mismatch for customer id: #{customer_id}"
          return
        end

        sub = user.subscription

        # Obter o plano atual do Stripe (usando item.price.product.name ou item.price.nickname)
        stripe_items = subscription_data.items.data
        new_plan = if subscription_data.metadata["plan_type"].present?
                     subscription_data.metadata["plan_type"].downcase
                   elsif stripe_items.any?
                     # Tenta obter o nome do plano do primeiro item de assinatura
                     item = stripe_items.first
                     product_name = ""

                     # Safely access nested properties
                     if item.price.respond_to?(:product)
                       if item.price.product.is_a?(String)
                         # If product is a string (product ID), use it as fallback
                         product_name = item.price.product
                       elsif item.price.product.respond_to?(:name)
                         # If product is an object with name
                         product_name = item.price.product.name
                       end
                     end

                     # Fallback chain
                     (product_name ||
                      (item.price.respond_to?(:nickname) ? item.price.nickname : nil) ||
                      "").downcase
                   end

        current_plan = sub.plan_type.downcase
        allowed_order = ["free", "standard", "premium"]

        # Se não conseguirmos determinar o novo plano, apenas atualizamos o status
        if new_plan.blank? || !allowed_order.include?(new_plan)
          Rails.logger.info "No valid plan change detected, updating status only for subscription #{sub.id}"
          sub.status = subscription_data.status
          sub.save
          return
        end

        # Obter datas do período correto do Stripe
        current_period_start = Time.at(subscription_data.current_period_start)
        current_period_end = Time.at(subscription_data.current_period_end)

        # Atualizar as datas do período no registro da assinatura
        sub.current_period_start = current_period_start

        # Verificar o tipo de mudança de plano (upgrade ou downgrade)
        if allowed_order.index(new_plan) < allowed_order.index(current_plan)
          # Downgrade: configura como pendente para o próximo ciclo de cobrança
          sub.pending_plan_type = new_plan
          Rails.logger.info "Pending downgrade set for user #{user.id}: #{current_plan} -> #{new_plan} effective on #{current_period_end}"
        else
          # Upgrade ou renovação do mesmo plano: aplicar imediatamente
          sub.plan_type = new_plan
          sub.pending_plan_type = nil
          Rails.logger.info "Upgrade or renewal applied for user #{user.id}: #{current_plan} -> #{new_plan}"
        end

        # Atualizar status
        sub.status = subscription_data.status

        if sub.save
          Rails.logger.info "Subscription updated for user #{user.id}, status: #{sub.status}, plan: #{sub.plan_type}, pending: #{sub.pending_plan_type}"
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
