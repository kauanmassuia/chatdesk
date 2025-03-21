Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "http://localhost:5173", "localhost:3000"
    resource "*",
      headers: :any,
      expose: [ "access-token", "client", "uid", "expiry", "token-type" ],  # Expose all token-related headers
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ],
      credentials: true
  end
end
