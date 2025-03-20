Rails.application.config.middleware.use ActionDispatch::Cookies
Rails.application.config.session_store :cookie_store,
  key: "_chat_desk_session",
  secure: Rails.env.production?,  # Use secure cookies in production
  httponly: true,                 # Prevent client-side JavaScript from accessing the cookies
  same_site: :lax                 # Helps protect against CSRF attacks
