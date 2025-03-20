# app/controllers/api/v1/omniauth_callbacks_controller.rb
module Api
  module V1
    class OmniauthCallbacksController < DeviseTokenAuth::OmniauthCallbacksController
      def omniauth_success
        auth_hash = request.env["omniauth.auth"]
        Rails.logger.debug "Omniauth callback auth_hash: #{auth_hash.inspect}"

        @resource = User.find_for_oauth(auth_hash)
        unless @resource
          render_error_not_allowed_auth_origin_url and return
        end

        @resource.create_token
        @resource.save!

        # Option 1: Redirect using a hardcoded frontend URL
        redirect_to "#{ENV['FRONTEND_URL'] || 'http://localhost:5173'}/dashboard?#{@resource.to_query}"

        # Option 2: Alternatively, you can render a JSON response and let the frontend handle redirection.
        # render json: { redirect_url: "#{ENV['FRONTEND_URL'] || 'http://localhost:5173'}/dashboard" }
      rescue => e
        Rails.logger.error "Omniauth error: #{e.message}"
        render_error_not_allowed_auth_origin_url
      end

      protected

      def resource_class_from_params
        (params[:resource_class].presence || "User").constantize
      end

      def get_resource_from_auth_hash
        auth_hash = request.env["omniauth.auth"]
        if auth_hash.blank?
          Rails.logger.error "OmniAuth auth hash is missing: #{request.env.inspect}"
          raise "No auth hash found in request.env['omniauth.auth']"
        end

        resource_class = resource_class_from_params
        Rails.logger.debug "Using resource_class: #{resource_class} with auth_hash: #{auth_hash.inspect}"
        resource_class.find_for_oauth(auth_hash)
      end
    end
  end
end
