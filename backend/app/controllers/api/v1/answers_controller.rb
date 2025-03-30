module Api
  module V1
    class AnswersController < BaseController
      before_action :authenticate_user!, except: [:save_answer]

      def save_answer
        @flow = Flow.find(params[:flow_id])
        new_answer_data = answer_params[:answer_data] || {}

        # Use session to track answer per flow for guest users.
        session[:answers] ||= {}
        answer_id = session[:answers][@flow.id.to_s]

        if answer_id.present?
          @answer = Answer.find(answer_id)
          # Merge the new data into existing answer_data.
          # Depending on your requirements, you could merge or overwrite specific keys.
          @answer.answer_data = @answer.answer_data.deep_merge(new_answer_data)
          @answer.submitted_at = Time.current
          @answer.save!
        else
          @answer = Answer.create!(
            flow: @flow,
            answer_data: new_answer_data,
            submitted_at: Time.current
          )
          # Save the answer id in the session for subsequent updates.
          session[:answers][@flow.id.to_s] = @answer.id
        end

        render json: { answer_id: @answer.id, answer_data: @answer.answer_data }
      rescue ActiveRecord::RecordInvalid => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      private

      def answer_params
        # Expecting params like: { answer: { answer_data: { input_node_1: "response", ... } } }
        params.require(:answer).permit(answer_data: {})
      end
    end
  end
end
