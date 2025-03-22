class Flow < ApplicationRecord
  # Each flow is created by a user.
  belongs_to :user

  # Validations to ensure necessary data is present.
  validates :title, presence: true
  validates :uid, presence: true, uniqueness: true

  # Optional: You might want to set a default value for published if needed.
  attribute :published, :boolean, default: false

  before_validation :set_uid, on: :create
  after_initialize :set_defaults

  def set_uid
    self.uid ||= SecureRandom.uuid
  end

  def set_defaults
    self.content ||= {}
    self.metadata ||= {}
  end
end
