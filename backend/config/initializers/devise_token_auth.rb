DeviseTokenAuth.setup do |config|
  config.omniauth_prefix = "/api/v1/auth"
  # If you're having issues with token rotation, set this to false
  config.change_headers_on_each_request = false

  # Default token lifespan
  config.token_lifespan = 2.weeks
end
