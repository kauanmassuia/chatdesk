module Api
  module V1
    class RegistrationsController < Devise::RegistrationsController
      respond_to :json

      private

      def sign_up_params
        params.permit(:name, :email, :password, :password_confirmation)
      end

      def respond_with(resource, _opts = {})
        if resource.persisted?
          token_hash = resource.create_new_auth_token
          response.headers.merge!(token_hash)
          render json: { status: "success", user: resource }, status: :ok
        else
          render json: { status: "error", errors: resource.errors.full_messages }, status: :unprocessable_entity
        end
      end
    end
  end
end
