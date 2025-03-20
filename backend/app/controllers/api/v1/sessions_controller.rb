module Api
  module V1
    class SessionsController < Devise::SessionsController
      respond_to :json

      def create
        super do |resource|
          # Force creation of a new token hash
          token_hash = resource.create_new_auth_token
          # Merge the tokens into the response headers so the client can access them
          response.headers.merge!(token_hash)
        end
      end

      private

      def respond_with(resource, _opts = {})
        render json: { status: "success", user: resource }, status: :ok
      end

      def respond_to_on_destroy
        head :no_content
      end
    end
  end
end
