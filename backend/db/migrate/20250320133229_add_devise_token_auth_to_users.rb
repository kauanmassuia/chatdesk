class AddDeviseTokenAuthToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :provider, :string, null: false, default: 'email'
    add_column :users, :uid, :string, null: false, default: ''

    # Add a tokens column to store authentication tokens as JSON
    add_column :users, :tokens, :json
  end
end
