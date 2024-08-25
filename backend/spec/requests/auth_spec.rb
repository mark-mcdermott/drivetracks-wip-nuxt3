require "rails_helper"

RSpec.describe "Auth requests" do

  let(:user) { create(:user, email: "MyString", password: "MyString") }
  let(:valid_creds) {{ :email => user.email, :password => user.password }}
  let(:invalid_creds) {{ :email => user.email, :password => "wrong" }}
  let!(:token) { create(:token, user: user, token_str: Digest::MD5.hexdigest(SecureRandom.hex), active: true) }

  context "POST /api/auth/login with valid credentials" do
    it "responds with 200 status" do
      post "/api/auth/login", params: valid_creds
      expect(response.status).to eq 200
    end
    it "responds with token " do
      post "/api/auth/login", params: valid_creds
      json_response = JSON.parse(response.body)
      expect(json_response).to have_key("token")
      user.reload
      latest_token = user.token.token_str
      expect(json_response["token"]).to eq latest_token
    end
  end
  context "POST /api/auth/login invalid credentials" do
    it "responds with 401 status" do
      post "/api/auth/login", params: invalid_creds
      expect(response.status).to eq 401
    end
  end

  context "GET /api/auth/session without a token header" do
    it "responds with error" do
      get "/api/auth/session"
      expect(response).to have_http_status(:not_found)
      json_response = JSON.parse(response.body)
      expect(json_response).to have_key("error")
      expect(json_response["error"]).to eq "User token not found"
    end
  end

  context "GET /api/auth/session with correct token header" do
    it "responds with the user" do
      get "/api/auth/session", headers: { 'Authorization' => "Bearer #{token.token_str}" }
      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response).to have_key("user")
      expect(json_response["user"]["email"]).to eq user.email
    end
  end

end