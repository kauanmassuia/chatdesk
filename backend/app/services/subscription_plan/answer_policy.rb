# app/services/subscription_plan/answer_policy.rb
module SubscriptionPlan
  class AnswerPolicy < BasePolicy
    LIMITS = {
      free: 10,
      standard: 2000,
      premium: 10000
    }.freeze

    def answer_limit
      LIMITS.fetch(plan, LIMITS[:free])
    end

    def can_create?(current_count)
      current_count < answer_limit
    end

    def progress_percentage(current_count)
      (current_count.to_f / answer_limit) * 100.0
    end
  end
end
