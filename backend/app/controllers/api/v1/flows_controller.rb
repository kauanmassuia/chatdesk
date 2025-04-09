module Api
  module V1
    class FlowsController < BaseController
      before_action :authenticate_user!
      before_action :set_flow, only: [:show, :update, :destroy, :publish]
      skip_before_action :authenticate_user!, only: [:show_by_custom_url]

      # GET /api/v1/flows
      def index
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
        # If update_published is true and content is being updated,
        # also update published_content
        if params[:update_published] && params[:content].present? && @flow.published
          @flow.published_content = params[:content]
          @flow.content = params[:content]
        end

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

      # POST /flows/:id/publish
      def publish
        @flow.published_content = @flow.content
        @flow.publish_at = Time.current
        @flow.published = true

        if @flow.save
          render json: { message: "Flow published successfully", flow: @flow }, status: :ok
        else
          render json: { error: "Failed to publish flow", details: @flow.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/flows/published/:custom_url
      def show_by_custom_url
        @flow = Flow.find_by!(custom_url: params[:custom_url], published: true)
        render json: { published_content: @flow.published_content, metadata: @flow.metadata }, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Flow not found" }, status: :not_found
      end

      private

      def set_flow
        @flow = current_user.flows.find_by!(uid: params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Flow not found" }, status: :not_found
      end

      def flow_params
        permitted = [:title, :published, :publish_at, :published_content, :custom_url, metadata: {}, content: {}]
        if params[:flow]
          params.require(:flow).permit(*permitted)
        else
          params.permit(*permitted)
        end
      end
    end
  end
end
