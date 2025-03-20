Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Update the origins below to include your React/Vite dev server URLs.
    origins "http://localhost:3000", "http://localhost:5173"

    resource "*",
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ],
      credentials: true
  end
end
