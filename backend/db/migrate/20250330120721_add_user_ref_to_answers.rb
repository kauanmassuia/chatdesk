class AddUserRefToAnswers < ActiveRecord::Migration[7.2]
  def change
    add_reference :answers, :user, foreign_key: true
  end
end
