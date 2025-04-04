# app/services/subscription_manager.rb
class SubscriptionManager
  attr_reader :user, :subscription

  def initialize(user)
    @user = user
    @subscription = user.subscription
  end

  # Returns the effective plan, considering pending downgrades.
  def plan
    return :free unless subscription&.status == 'active'
    if subscription.pending_plan_type.present? && Time.current < billing_period_end
      # Still in the current period: effective plan remains the higher one.
      subscription.plan_type.to_sym
    elsif subscription.pending_plan_type.present? && Time.current >= billing_period_end
      # Billing period ended: apply the pending downgrade.
      subscription.update!(
        plan_type: subscription.pending_plan_type,
        pending_plan_type: nil,
        current_period_start: Time.current
      )
      subscription.plan_type.to_sym
    else
      subscription.plan_type.to_sym
    end
  end

  def billing_period_start
    subscription&.current_period_start || Time.current.beginning_of_month
  end

  def billing_period_end
    billing_period_start + 1.month
  end

  def info
    # If no subscription exists, return free defaults.
    unless subscription
      default_start = Time.current
      return {
        plan: 'free',
        currentPlan: 'free',
        pendingPlan: nil,
        status: 'inactive',
        billing_start: default_start,
        billing_end: default_start + 1.month,
        translatedPlan: translate_plan(:free),
        pendingTranslatedPlan: nil
      }
    end

    {
      plan: plan.to_s,
      currentPlan: subscription.plan_type.to_s,
      pendingPlan: subscription.pending_plan_type,
      status: subscription.status,
      billing_start: billing_period_start,
      billing_end: billing_period_end,
      translatedPlan: translate_plan(plan),
      pendingTranslatedPlan: subscription.pending_plan_type.present? ? translate_plan(subscription.pending_plan_type.to_sym) : nil
    }
  end

  def cancel_subscription
    return { success: false, message: "Nenhuma assinatura ativa encontrada" } unless subscription&.status == 'active'

    begin
      # Se o usuário tem uma assinatura do Stripe, cancele no Stripe primeiro
      if subscription.stripe_subscription_id.present?
        stripe_sub = Stripe::Subscription.retrieve(subscription.stripe_subscription_id)

        # Cancela no final do período atual (não imediatamente)
        # Isso respeita o período que o usuário já pagou
        Stripe::Subscription.update(
          stripe_sub.id,
          { cancel_at_period_end: true }
        )

        # Defina o plano pendente como "free"
        subscription.pending_plan_type = "free"
        subscription.save

        return {
          success: true,
          message: "Seu plano será alterado para o plano gratuito em #{billing_period_end.strftime('%d/%m/%Y')}"
        }
      else
        # Para assinaturas que não estão no Stripe (ex: planos de teste ou gratuitos)
        subscription.update(
          plan_type: "free",
          pending_plan_type: nil,
          status: "active"
        )

        return {
          success: true,
          message: "Sua assinatura foi alterada para o plano gratuito"
        }
      end
    rescue Stripe::StripeError => e
      Rails.logger.error "Erro ao cancelar assinatura do Stripe: #{e.message}"
      return { success: false, message: "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente." }
    rescue => e
      Rails.logger.error "Erro inesperado ao cancelar assinatura: #{e.message}"
      return { success: false, message: "Ocorreu um erro inesperado. Por favor, tente novamente." }
    end
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

  private

  def translate_plan(plan)
    mapping = {
      free: 'Grátis',
      standard: 'Básico',
      premium: 'Premium'
    }
    mapping[plan] || 'Desconhecido'
  end
end
