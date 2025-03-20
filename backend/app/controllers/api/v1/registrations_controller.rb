module Api
  module V1
    class RegistrationsController < Devise::RegistrationsController
      skip_before_action :verify_authenticity_token
      respond_to :json

      private

      def respond_with(resource, _opts = {})
        if resource.persisted?
          render json: { status: "success", user: resource }, status: :ok
        else
          render json: { status: "error", errors: resource.errors.full_messages }, status: :unprocessable_entity
        end
      end
    end
  end
end
