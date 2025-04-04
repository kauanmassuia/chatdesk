class AddBillingPeriodFieldsToSubscriptions < ActiveRecord::Migration[7.2]
  def change
    add_column :subscriptions, :current_period_start, :datetime
    add_column :subscriptions, :pending_plan_type, :string
  end
end
