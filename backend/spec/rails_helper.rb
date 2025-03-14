# frozen_string_literal: true

require 'spec_helper'
ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
abort("The Rails environment is running in production mode!") if Rails.env.production?
require 'rspec/rails'
require 'shoulda-matchers'

begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  abort e.to_s.strip
end

RSpec.configure do |config|
  config.before(:suite) do
    puts "Loading FactoryBot factories..."
    FactoryBot.factories.clear
    FactoryBot.reload
    puts "Factories loaded: #{FactoryBot.factories.map(&:name)}"
  end

  config.include FactoryBot::Syntax::Methods
  
  config.use_transactional_fixtures = true

  config.before(:each) do
    Rails.application.routes.default_url_options[:host] = 'http://localhost:3000'
  end
  
  config.infer_spec_type_from_file_location!
  config.filter_rails_from_backtrace!
end

Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :rspec
    with.library :rails
  end
end
