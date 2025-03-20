class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable, :omniauthable, etc.
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  # Enum for subscription plans
  enum plan: { free: 0, standard: 1 }
end
