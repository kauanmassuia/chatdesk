class CreateSubscriptions < ActiveRecord::Migration[7.2]
  def change
    create_table :subscriptions do |t|
      t.references :user, null: false, foreign_key: true
      t.string :stripe_subscription_id, null: false
      t.string :plan_type, null: false
      t.string :status, null: false, default: "pending"
      t.timestamps
    end
    add_index :subscriptions, :stripe_subscription_id, unique: true
  end
end
