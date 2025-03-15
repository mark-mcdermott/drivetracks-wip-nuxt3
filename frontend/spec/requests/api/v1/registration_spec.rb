# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Registration requests' do
  let(:user_params) { { user: { email: 'test@mail.com', password: 'password' } } }
  let(:just_email) { { user: { email: 'test@mail.com' } } }
  let(:just_password) { { user: { password: 'password' } } }
  let(:malformed) { { email: 'test@mail.com', password: 'password' } }

  context 'POST /api/v1/auth/signup with email and password params' do
    it 'responds with 200 status' do
      post '/api/v1/auth/signup', params: user_params
      expect(response.status).to eq 200
    end
  end

  context 'POST /api/v1/auth/signup with just email param' do
    it 'responds with 422 status' do
      post '/api/v1/auth/signup', params: just_email
      expect(response.status).to eq 422
    end
  end

  context 'POST /api/v1/auth/signup with just password param' do
    it 'responds with 422 status' do
      post '/api/v1/auth/signup', params: just_password
      expect(response.status).to eq 422
    end
  end

  context 'POST /api/v1/auth/signup with malformed params' do
    it 'responds with 422 status' do
      post '/api/v1/auth/signup', params: malformed
      expect(response.status).to eq 422
    end
  end
end