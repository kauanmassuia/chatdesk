class Flow < ApplicationRecord
  # Each flow is created by a user.
  belongs_to :user
  has_many :answers, dependent: :destroy

  # Validations to ensure necessary data is present.
  validates :title, presence: true
  validates :uid, presence: true, uniqueness: true

  # Optional: You might want to set a default value for published if needed.
  attribute :published, :boolean, default: false

  before_validation :set_uid, on: :create
  after_initialize :set_defaults

  validates :custom_url, uniqueness: true, allow_blank: true
  before_save :set_default_custom_url

  private

  def set_default_custom_url
    # Generate a unique custom_url if none is provided.
    if custom_url.blank?
      sanitized_title = title.gsub(/\s+/, '_')
      base = "chat_#{sanitized_title}"
      candidate = base
      counter = 1
      while self.class.exists?(custom_url: candidate)
        candidate = "#{base}_#{counter}"
        counter += 1
      end
      self.custom_url = candidate
    end
  end

  def set_uid
    self.uid ||= SecureRandom.uuid
  end

  def set_defaults
    self.content ||= {}
    self.metadata ||= {}
  end
end
