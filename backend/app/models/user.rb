class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable, :omniauthable, etc.
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  # Include Devise Token Auth support
  include DeviseTokenAuth::Concerns::User

  # Enum for subscription plans
  enum plan: { free: 0, standard: 1, premium: 2 }

  has_many :flows, dependent: :destroy
  has_many :answers

  # Validations
  validates :email, presence: true,
                    uniqueness: { case_sensitive: false },
                    length: { maximum: 255 },
                    format: { with: URI::MailTo::EMAIL_REGEXP }

  validates :name, presence: true,
                   length: { maximum: 100 }

  validates :flows_count, :answers_count, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  def self.find_for_oauth(auth)
    Rails.logger.debug "find_for_oauth received auth: #{auth.inspect}"

    uid = auth.uid
    provider = auth.provider
    return nil unless uid.present? && provider.present?

    user = where(provider: provider, uid: uid).first_or_initialize

    if user.new_record?
      user.email = auth.info.email
      user.name  = auth.info.name || auth.info.first_name || "User"
      user.uid   = uid
      user.password = Devise.friendly_token[0, 20]
      user.save!
    end

    user
  end
end
