OmniAuth.config.allowed_request_methods = [ :post, :get ]
OmniAuth.config.logger = Rails.logger
OmniAuth.config.silence_get_warning = true

# Set the full host so that OmniAuth can correctly build callback URLs.
OmniAuth.config.full_host = Rails.env.development? ? "http://localhost:3000" : "https://your-production-domain.com"
