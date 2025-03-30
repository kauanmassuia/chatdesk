class CreateAnswers < ActiveRecord::Migration[7.2]
  def change
    create_table :answers do |t|
      t.references :flow, null: false, foreign_key: true
      t.json :answer_data
      t.datetime :submitted_at
      t.json :additional_metadata

      t.timestamps
    end
  end
end
