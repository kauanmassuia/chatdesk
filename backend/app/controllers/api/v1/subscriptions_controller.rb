# app/controllers/api/v1/subscriptions_controller.rb
module Api
  module V1
    class SubscriptionsController < BaseController
      before_action :authenticate_user!

      def create_checkout_session
        plan = params[:plan]
        allowed_plans = %w[standard premium]
        unless allowed_plans.include?(plan)
          return render json: { error: 'Invalid plan' }, status: :unprocessable_entity
        end

        # Use SubscriptionManager to check if the effective plan is already active.
        subscription_manager = ::SubscriptionManager.new(current_user)
        if subscription_manager.plan == plan.to_sym
          return render json: { message: "Plano #{plan} já está ativo." }, status: :ok
        end

        # Retrieve the Price ID from environment variables.
        price_id = case plan
                   when 'standard'
                     ENV.fetch("STRIPE_PRICE_ID_STANDARD")
                   when 'premium'
                     ENV.fetch("STRIPE_PRICE_ID_PREMIUM")
                   end

        # Create or retrieve a Stripe customer for the current user.
        if current_user.stripe_customer_id.blank?
          customer = Stripe::Customer.create(email: current_user.email)
          current_user.update!(stripe_customer_id: customer.id)
        else
          customer = Stripe::Customer.retrieve(current_user.stripe_customer_id)
        end

        frontend_url = ENV.fetch('FRONTEND_URL', 'http://localhost:5173/')
        session = Stripe::Checkout::Session.create(
          payment_method_types: ['card'],
          mode: 'subscription',
          customer: customer.id,
          line_items: [{
            price: price_id,
            quantity: 1
          }],
          metadata: {
            plan_type: plan,
            user_id: current_user.id
          },
          success_url: "#{frontend_url}subscription/success?session_id={CHECKOUT_SESSION_ID}",
          cancel_url: "#{frontend_url}subscription/cancel"
        )

        render json: { sessionId: session.id }
      rescue Stripe::StripeError => e
        Rails.logger.error "Stripe error: #{e.message}"
        render json: { error: e.message }, status: :internal_server_error
      end

      def success
        render plain: "Subscription successful! Your plan has been updated."
      end

      def cancel
        render plain: "Subscription process canceled."
      end

      def cancel_plan
        subscription_manager = ::SubscriptionManager.new(current_user)
        result = subscription_manager.cancel_subscription

        if result[:success]
          render json: { message: result[:message] }, status: :ok
        else
          render json: { error: result[:message] }, status: :unprocessable_entity
        end
      end

      def show
        subscription_manager = ::SubscriptionManager.new(current_user)
        render json: subscription_manager.info
      end
    end
  end
end
