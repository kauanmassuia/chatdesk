# app/controllers/api/v1/answers_controller.rb
module Api
  module V1
    class AnswersController < BaseController
      before_action :authenticate_user!, except: [:save_answer]

      def index
        subscription_manager = ::SubscriptionManager.new(current_user)
        answer_limit = subscription_manager.answer_policy.answer_limit

        # Only count answers created during the current billing period.
        billing_start = subscription_manager.billing_period_start
        current_period_answers = current_user.answers.where("created_at >= ?", billing_start)

        total_answers = current_period_answers.count
        # Compute how many answers exceed the monthly allowance.
        over_limit_count = [total_answers - answer_limit, 0].max

        # Only show up to the monthly allowance.
        visible_answers = current_period_answers.order(created_at: :desc).limit(answer_limit)

        render json: {
          answers: visible_answers.as_json(include: :flow),
          total_answers: total_answers,
          answer_limit: answer_limit,
          over_limit_count: over_limit_count
        }
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
          @answer.answer_data = @answer.answer_data.deep_merge(new_answer_data)
          @answer.submitted_at = Time.current
          @answer.save!
        else
          @answer = Answer.create!(
            flow: @flow,
            user: @flow.user,  # The flow owner is treated as the answer owner
            answer_data: new_answer_data,
            submitted_at: Time.current
          )
          session[:answers][@flow.id.to_s] = @answer.id

          # Trigger extra-chat mailer logic here based on the current billing period.
          subscription_manager = ::SubscriptionManager.new(@flow.user)
          billing_start = subscription_manager.billing_period_start
          current_period_count = @flow.user.answers.where("created_at >= ?", billing_start).count

          if current_period_count == subscription_manager.answer_policy.answer_limit
            case subscription_manager.plan
            when :free
              Rails.logger.info "Mailer triggered: User #{@flow.user.email} reached free plan capacity (#{subscription_manager.answer_policy.answer_limit} chats/month). Extra chats cost R$40 per 500."
            when :premium
              Rails.logger.info "Mailer triggered: User #{@flow.user.email} reached premium plan capacity (#{subscription_manager.answer_policy.answer_limit} chats/month). Extra chats pricing: See tiers."
            else
              Rails.logger.info "Mailer triggered: User #{@flow.user.email} reached their plan capacity (#{subscription_manager.answer_policy.answer_limit} chats/month)."
            end
          end
        end

        render json: { answer_id: @answer.id, answer_data: @answer.answer_data }
      rescue ActiveRecord::RecordNotFound => e
        render json: { error: e.message }, status: :not_found
      rescue ActiveRecord::RecordInvalid => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      private

      def answer_params
        params.require(:answer).permit(answer_data: {})
      end
    end
  end
end
