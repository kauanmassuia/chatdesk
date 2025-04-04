class SubscriptionManager
  attr_reader :user, :subscription

  def initialize(user)
    @user = user
    @subscription = user.subscription
  end

  # Determines the effective plan for quota purposes.
  # If a pending plan change exists but the current billing period hasn’t ended,
  # continue using the current (higher) plan.
  # If the period ended, apply the pending plan change.
  def plan
    if subscription && subscription.status == 'active'
      if subscription.pending_plan_type.present? && Time.current >= billing_period_end
        # Billing period is over: update the subscription.
        subscription.update!(
          plan_type: subscription.pending_plan_type,
          pending_plan_type: nil,
          current_period_start: Time.current
        )
        subscription.plan_type.to_sym
      else
        subscription.plan_type.to_sym
      end
    else
      :free
    end
  end

  def billing_period_start
    if subscription && subscription.current_period_start.present?
      subscription.current_period_start
    else
      # Fallback to the beginning of the month.
      Time.current.beginning_of_month
    end
  end

  def billing_period_end
    billing_period_start.end_of_month
  end

  def answer_policy
    @answer_policy ||= SubscriptionPlan::AnswerPolicy.new(plan)
  end

  # You can add other policies here as needed.
  def workspace_policy
    @workspace_policy ||= SubscriptionPlan::WorkspacePolicy.new(plan)
  end

  def analytics_policy
    @analytics_policy ||= SubscriptionPlan::AnalyticsPolicy.new(plan)
  end
end
