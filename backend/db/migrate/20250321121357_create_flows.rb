class CreateFlows < ActiveRecord::Migration[7.2]
  def change
    create_table :flows do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title
      t.jsonb :content
      t.boolean :published
      t.jsonb :metadata

      t.timestamps
    end
  end
end
