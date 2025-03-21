class Flow < ApplicationRecord
  # Each flow is created by a user.
  belongs_to :user

  # Validations to ensure necessary data is present.
  validates :title, presence: true
  validates :content, presence: true

  # Optional: You might want to set a default value for published if needed.
  attribute :published, :boolean, default: false
end
