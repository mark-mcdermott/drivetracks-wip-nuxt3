# config/initializers/default_url_options.rb

Rails.application.routes.default_url_options = {
  host: ENV['DEFAULT_URL_HOST'] || 'localhost',
  port: ENV['DEFAULT_URL_PORT'] || 3000
}

# Optionally, you can set different options for different environments
Rails.application.configure do
  config.action_mailer.default_url_options = { host: ENV['DEFAULT_URL_HOST'] || 'localhost', port: ENV['DEFAULT_URL_PORT'] || 3000 }
end