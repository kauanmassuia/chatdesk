class AddPublishingFieldsToFlows < ActiveRecord::Migration[7.2]
  def change
    add_column :flows, :published_content, :jsonb, default: {}
    add_column :flows, :publish_at, :datetime
  end
end
