# app/controllers/api/v1/subscriptions_controller.rb
module Api
  module V1
    class SubscriptionsController < BaseController
      before_action :authenticate_user!

      def create_checkout_session
        plan = params[:plan]
        allowed_plans = %w[standard premium] # adjust as needed
        unless allowed_plans.include?(plan)
          return render json: { error: 'Invalid plan' }, status: :unprocessable_entity
        end

        # Check if the user already has an active subscription
        if current_user.subscription&.status == "active" && current_user.subscription.plan_type == plan
          return render json: { message: "Plano #{plan} já está ativo." }, status: :ok
        end

        # Retrieve the Price ID from environment variables (ensure these are set in test/live mode appropriately)
        price_id = case plan
                   when 'standard'
                     ENV.fetch("STRIPE_PRICE_ID_STANDARD")
                   when 'premium'
                     ENV.fetch("STRIPE_PRICE_ID_PREMIUM")
                   end

        # Create or retrieve a Stripe customer for the current user
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
            quantity: 1,
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

      # Optionally, add success/cancel actions if needed.
      def success
        render plain: "Subscription successful! Your plan has been updated."
      end

      def cancel
        render plain: "Subscription process canceled."
      end
    end
  end
end
