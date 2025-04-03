# app/services/subscription_plan/workspace_policy.rb
module SubscriptionPlan
  class WorkspacePolicy < BasePolicy
    MEMBER_LIMITS = {
      free: 1,
      standard: 5,
      premium: 20
    }.freeze

    def member_limit
      MEMBER_LIMITS.fetch(plan, MEMBER_LIMITS[:free])
    end

    def can_add_member?(current_member_count)
      current_member_count < member_limit
    end
  end
end
