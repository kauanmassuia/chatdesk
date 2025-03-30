class AddUidToFlows < ActiveRecord::Migration[7.2]
  def change
    add_column :flows, :uid, :string
  end
end
