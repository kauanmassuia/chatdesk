class Subscription < ApplicationRecord
  belongs_to :user

  validates :stripe_subscription_id, presence: true, uniqueness: true
  validates :plan_type, presence: true
  validates :status, presence: true, inclusion: { in: %w[pending active canceled past_due unpaid] }
end
