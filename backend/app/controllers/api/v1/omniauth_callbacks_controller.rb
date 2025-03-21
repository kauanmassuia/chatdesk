# app/controllers/api/v1/omniauth_callbacks_controller.rb

module Api
  module V1
    class OmniauthCallbacksController < DeviseTokenAuth::OmniauthCallbacksController
      def omniauth_success
          auth_hash = request.env["omniauth.auth"]
          @resource = User.find_for_oauth(auth_hash) # your custom method to find/create a Google user
          unless @resource
            render_error_not_allowed_auth_origin_url and return
          end

          # Generate a new auth token hash
          token_hash = @resource.create_new_auth_token
          @resource.save!

          # Build a query that includes tokens + minimal user data
          data = {
            tokens: token_hash,         # e.g. { "access-token" => "xxx", "client" => "yyy", ... }
            user: {
              id: @resource.id,
              email: @resource.email,
              name: @resource.name
            }
          }

          # We recommend redirecting to a route like /googleOauthSuccess instead of /?
          frontend_url = ENV['FRONTEND_URL'] || 'http://localhost:5173'
          redirect_to "#{frontend_url}/googleOauthSuccess?#{data.to_query}"

        rescue => e
          Rails.logger.error "Omniauth error: #{e.message}"
          render_error_not_allowed_auth_origin_url
        end

      protected

      def resource_class_from_params
        (params[:resource_class].presence || "User").constantize
      end

      # Not strictly needed if you rely on the default get_resource_from_auth_hash
      def get_resource_from_auth_hash
        auth_hash = request.env["omniauth.auth"]
        raise "No auth hash found" unless auth_hash

        resource_class = resource_class_from_params
        resource_class.find_for_oauth(auth_hash)
      end
    end
  end
end
