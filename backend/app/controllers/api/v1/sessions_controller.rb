# module Api
#   module V1
#     class SessionsController < Devise::SessionsController
#       include DeviseTokenAuth::Concerns::SetUserByToken
#       respond_to :json

#       private

#       def respond_with(resource, _opts = {})
#         render json: { status: "success", user: resource }, status: :ok
#       end

#       def respond_to_on_destroy
#         head :no_content
#       end
#     end
#   end
# end
