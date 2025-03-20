DeviseTokenAuth.setup do |config|
  config.omniauth_prefix = "/api/v1/auth"
  # If you want tokens to be changed on each request, set this to true.
  # For now, leave it at false so tokens remain constant across requests.
  config.change_headers_on_each_request = false

  # Set token lifespan if needed (defaults to 2 weeks)
  config.token_lifespan = 2.weeks
  config.batch_request_buffer_throttle = 5.seconds
end
