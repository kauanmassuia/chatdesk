module Api
  module V1
    class SubscriptionsController < BaseController
      before_action :authenticate_user!  # ensure the user is logged in

      def create_checkout_session
        plan = params[:plan]
        price_id = case plan
                   when 'standard'
                     ENV.fetch("STRIPE_PRICE_ID_STANDARD", "prod_S2SOcs5YGRsC6L")
                   when 'premium'
                     ENV.fetch("STRIPE_PRICE_ID_PREMIUM", "prod_S2zCMST2CZHo8P")
                   else
                     return render json: { error: 'Invalid plan' }, status: :unprocessable_entity
                   end

        # Create or retrieve a Stripe customer for the current user
        if current_user.stripe_customer_id.blank?
          customer = Stripe::Customer.create({ email: current_user.email })
          # Using update! to ensure errors are raised if saving fails
          current_user.update!(stripe_customer_id: customer.id)
        else
          customer = Stripe::Customer.retrieve(current_user.stripe_customer_id)
        end

        # Use a frontend URL defined in your environment variables
        frontend_url = ENV.fetch('FRONTEND_URL', 'http://localhost:5173/')
        success_url = "#{frontend_url}subscription/success?session_id={CHECKOUT_SESSION_ID}"
        cancel_url  = "#{frontend_url}subscription/cancel"

        begin
          session = Stripe::Checkout::Session.create({
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
            success_url: success_url,
            cancel_url: cancel_url
          })

          render json: { sessionId: session.id }
        rescue => e
          Rails.logger.error "Stripe Checkout error: #{e.message}"
          return render json: { error: 'Unable to create checkout session' }, status: :internal_server_error
        end
      end

      def success
        render plain: "Subscription successful! Your plan has been updated."
      end

      def cancel
        render plain: "Subscription process canceled."
      end
    end
  end
end
