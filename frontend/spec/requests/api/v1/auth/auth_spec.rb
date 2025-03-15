# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Login/logout requests' do
  before(:each) do
    User.delete_all
    @user1 = create(:user, :confirmed)
    @user2 = create(:user, :confirmed)
    @user3 = create(:user)
  end

  let(:valid_creds) { { user: { email: @user1.email, password: @user1.password } } }
  let(:valid_creds2) { { user: { email: @user2.email, password: @user2.password } } }
  let(:invalid_email) { { user: { email: @user1.email, password: 'wrong' } } }
  let(:invalid_pass) { { user: { email: 'wrong@mail.com', password: @user1.password } } }
  let(:unconfirmed) { { user: { email: @user3.email, password: @user3.password } } }

  context 'POST /api/v1/auth/login with valid credentials' do
    it 'responds with 200 status' do
      post '/api/v1/auth/login', params: valid_creds
      expect(response.status).to eq 200
    end
  end

  context 'POST /api/v1/auth/login with invalid email' do
    it 'responds with 401 status' do
      post '/api/v1/auth/login', params: invalid_email
      expect(response.status).to eq 401
    end
  end

  context 'POST /api/v1/auth/login with invalid password' do
    it 'responds with 401 status' do
      post '/api/v1/auth/login', params: invalid_pass
      expect(response.status).to eq 401
    end
  end

  context 'POST /api/v1/auth/login unconfirmed user' do
    it 'responds with 401 status' do
      post '/api/v1/auth/login', params: invalid_pass
      expect(response.status).to eq 401
    end
  end

  context 'DELETE /api/v1/auth/logout with valid credentials' do
    it 'responds with 200 status' do
      post '/api/v1/auth/login', params: valid_creds
      expect(response.status).to eq 200
      token = JSON.parse(response.body)['token']
      delete '/api/v1/auth/logout', headers: { 'Authorization' => "Bearer #{token}" }
      expect(response.status).to eq 200
    end
  end

  context 'DELETE /api/v1/auth/logout without valid credentials' do
    it 'responds with 200 status' do
      post '/api/v1/auth/login', params: valid_creds
      expect(response.status).to eq 200
      delete '/api/v1/auth/logout'
      expect(response.status).to eq 401
    end
  end

  context 'GET /api/v1/auth/current_user with valid credentials' do
    it 'responds with 200 status and returns the current user' do
      post '/api/v1/auth/login', params: valid_creds
      expect(response.status).to eq 200
      token = JSON.parse(response.body)['token']
      get '/api/v1/auth/current_user', headers: { 'Authorization' => "Bearer #{token}" }
      expect(response.status).to eq 200
    end
  end

  context 'GET /api/v1/auth/current_user without credentials' do
    it 'responds with 401 status' do
      get '/api/v1/auth/current_user'
      expect(response.status).to eq 401
    end
  end
end