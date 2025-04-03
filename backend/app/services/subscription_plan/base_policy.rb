# app/services/subscription_plan/base_policy.rb
module SubscriptionPlan
  class BasePolicy
    attr_reader :plan

    def initialize(plan)
      @plan = plan.to_sym
    end
  end
end
