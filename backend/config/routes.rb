Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  root "home#index"

  namespace :api do
    namespace :v1, defaults: { format: :json } do
      mount_devise_token_auth_for "User", at: "auth", controllers: {
        omniauth_callbacks: "api/v1/omniauth_callbacks",
        registrations: "api/v1/registrations"
        # sessions: "api/v1/sessions"
      }

      post 'create_checkout_session', to: 'subscriptions#create_checkout_session'
      get  'subscription/success',   to: 'subscriptions#success'
      get  'subscription/cancel',    to: 'subscriptions#cancel'
      post 'webhooks/stripe',        to: 'stripe_webhooks#receive'

      resources :flows, only: [ :index, :show, :create, :update, :destroy ] do
        member do
          post :publish
        end
        collection do
          get 'published/:custom_url', to: 'flows#show_by_custom_url', as: :published
        end
      end
      resources :answers, only: [ :index ] do
        collection do
          post :save_answer
        end
      end
    end
  end
end
