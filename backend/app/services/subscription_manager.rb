# app/services/subscription_manager.rb
class SubscriptionManager
  attr_reader :user, :plan

  def initialize(user)
    @user = user
    # If the user has an active subscription, use that plan; otherwise, default to free.
    @plan = (user.subscription&.status == 'active' ? user.subscription.plan_type.to_sym : :free)
  end

  def answer_policy
    @answer_policy ||= SubscriptionPlan::AnswerPolicy.new(plan)
  end

  def workspace_policy
    @workspace_policy ||= SubscriptionPlan::WorkspacePolicy.new(plan)
  end

  def analytics_policy
    @analytics_policy ||= SubscriptionPlan::AnalyticsPolicy.new(plan)
  end
end
