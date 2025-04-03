# app/services/subscription_plan/analytics_policy.rb
module SubscriptionPlan
  class AnalyticsPolicy < BasePolicy
    def analytics_enabled?
      # For example, only standard and premium users get analytics.
      %i[standard premium].include?(plan)
    end
  end
end
