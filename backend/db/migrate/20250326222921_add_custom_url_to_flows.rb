class AddCustomUrlToFlows < ActiveRecord::Migration[7.2]
  def change
    add_column :flows, :custom_url, :string
    add_index :flows, :custom_url, unique: true
  end
end
