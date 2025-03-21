module Api
  module V1
    class BaseController < ActionController::API
      include DeviseTokenAuth::Concerns::SetUserByToken
      alias_method :current_user, :current_api_v1_user

      # Define our own authenticate_user! helper for API controllers.
      def authenticate_user!
        unless current_user
          render json: { error: 'Unauthorized' }, status: :unauthorized and return
        end
      end
    end
  end
end
