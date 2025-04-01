module Api
  module V1
    class StripeWebhooksController < ApplicationController
      # Disable CSRF protection for webhooks
      skip_before_action :verify_authenticity_token

      def receive
        payload = request.body.read
        sig_header = request.env['HTTP_STRIPE_SIGNATURE']
        endpoint_secret = ENV["STRIPE_WEBHOOK_SECRET"]

        begin
          event = Stripe::Webhook.construct_event(
            payload, sig_header, endpoint_secret
          )
        rescue JSON::ParserError
          render json: { error: 'Invalid payload' }, status: 400 and return
        rescue Stripe::SignatureVerificationError
          render json: { error: 'Invalid signature' }, status: 400 and return
        end

        # When a checkout session is completed, update the user plan
        if event['type'] == 'checkout.session.completed'
          session = event['data']['object']
          customer_id = session['customer']

          # Find the user by stripe_customer_id
          user = User.find_by(stripe_customer_id: customer_id)
          if user
            # Update the plan – assuming 0 = free, 1 = upgraded plan
            user.update(plan: 1)
          end
        end

        render json: { message: 'Success' }
      end
    end
  end
end
