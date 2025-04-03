module Api
  module V1
    class AnswersController < BaseController
      before_action :authenticate_user!, except: [:save_answer]

      def index
        # This action is for authenticated users only.
        @answers = current_user.answers.includes(:flow).order(created_at: :desc)
        render json: @answers, include: :flow
      rescue ActiveRecord::RecordNotFound => e
        render json: { error: e.message }, status: :not_found
      end

      def save_answer
        @flow = Flow.find_by!(custom_url: params[:custom_url])
        new_answer_data = answer_params[:answer_data] || {}

        # Use session to track answer per flow for guest users.
        session[:answers] ||= {}
        answer_id = session[:answers][@flow.id.to_s]

        if answer_id.present?
          @answer = Answer.find(answer_id)
          # Merge the new data into the existing answer_data.
          @answer.answer_data = @answer.answer_data.deep_merge(new_answer_data)
          @answer.submitted_at = Time.current
          @answer.save!
        else
          @answer = Answer.create!(
            flow: @flow,
            user: @flow.user,  # Set owner as the flow's owner
            answer_data: new_answer_data,
            submitted_at: Time.current
          )
          # Save the answer id in the session for subsequent updates.
          session[:answers][@flow.id.to_s] = @answer.id

          # Check if this new answer pushes the user to their plan capacity.
          subscription_manager = ::SubscriptionManager.new(@flow.user)

          current_count = @flow.user.answers.count
          answer_limit = subscription_manager.answer_policy.answer_limit

          # If the answer count now equals the monthly capacity, trigger the mailer.
          if current_count == answer_limit
            case subscription_manager.plan
            when :free
              Rails.logger.info "Mailer triggered: User #{@flow.user.email} has reached their free plan capacity (#{answer_limit} chats/month). Extra chats cost R$40 per 500."
            when :premium
              Rails.logger.info "Mailer triggered: User #{@flow.user.email} has reached their premium plan capacity (#{answer_limit} chats/month). Extra chats pricing: See tiers (e.g., 10,000 included, then $50 for 15,000, etc.)."
            else
              Rails.logger.info "Mailer triggered: User #{@flow.user.email} reached their plan capacity (#{answer_limit} chats/month)."
            end
          end
        end

        render json: { answer_id: @answer.id, answer_data: @answer.answer_data }
      rescue ActiveRecord::RecordNotFound => e
        render json: { error: e.message }, status: :not_found
      rescue ActiveRecord::RecordInvalid => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # In your controller action that returns subscription info:
      def answers_count
        subscription_manager = ::SubscriptionManager.new(current_user)
        answer_limit = subscription_manager.answer_policy.answer_limit
        current_answers = current_user.answers.count
        progress_percentage = subscription_manager.answer_policy.progress_percentage(current_answers)

        render json: {
          current_answers: current_answers,
          answer_limit: answer_limit,
          progress_percentage: progress_percentage
        }
      end

      private

      def answer_params
        # Expecting params like: { answer: { answer_data: { input_node_1: "response", ... } } }
        params.require(:answer).permit(answer_data: {})
      end
    end
  end
end
