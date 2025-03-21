module Api
  module V1
    class FlowsController < BaseController
      before_action :authenticate_user!
      before_action :set_flow, only: [:show, :update, :destroy]

      # GET /api/v1/flows
      def index
        # Only return flows that belong to the current_user
        @flows = current_user.flows.order(created_at: :desc)
        render json: @flows
      end

      # GET /api/v1/flows/:id
      def show
        render json: @flow
      end

      # POST /api/v1/flows
      def create
        @flow = current_user.flows.build(flow_params)
        if @flow.save
          render json: @flow, status: :created
        else
          render json: { errors: @flow.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/flows/:id
      def update
        if @flow.update(flow_params)
          render json: @flow
        else
          render json: { errors: @flow.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/flows/:id
      def destroy
        @flow.destroy
        head :no_content
      end

      private

      def set_flow
        @flow = current_user.flows.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Flow not found' }, status: :not_found
      end

      def flow_params
        params.require(:flow).permit(:title, :content, :published, metadata: {})
      end
    end
  end
end
