module Api
  module V1
    class OmniauthCallbacksController < DeviseTokenAuth::OmniauthCallbacksController
      def omniauth_success
        auth_hash = request.env["omniauth.auth"]
        Rails.logger.debug "Omniauth callback auth_hash: #{auth_hash.inspect}"

        # Use your custom find_for_oauth to get the user (defaulting to User)
        @resource = User.find_for_oauth(auth_hash)
        Rails.logger.debug "Resource from OAuth: #{@resource.inspect}"

        if @resource.nil?
          Rails.logger.error "Resource is nil. Cannot create token."
          render_error_not_allowed_auth_origin_url and return
        end

        # Ensure the resource responds to create_token (should be available via DeviseTokenAuth::Concerns::User)
        unless @resource.respond_to?(:create_token)
          Rails.logger.error "Resource does not respond to create_token: #{@resource.inspect}"
          render_error_not_allowed_auth_origin_url and return
        end

        # Create the token on the resource and save it
        @resource.create_token
        @resource.save!

        # Proceed with the default redirect or JSON response
        render_data_or_redirect("deliverCredentials", @resource.as_json)
      rescue => e
        Rails.logger.error "Omniauth error: #{e.message}"
        render_error_not_allowed_auth_origin_url
      end
    end
  end
end
