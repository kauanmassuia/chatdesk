class AddFieldsToUsers < ActiveRecord::Migration[7.2]
  def change
    # Subscription Plan: Using an integer for enum (free: 0, standard: 1)
    add_column :users, :plan, :integer, default: 0, null: false

    # Usage Counters: Defaults set to 0
    add_column :users, :flows_count, :integer, default: 0, null: false
    add_column :users, :answers_count, :integer, default: 0, null: false

    # Stripe Integration: Stores the Stripe customer id
    add_column :users, :stripe_customer_id, :string
  end
end
