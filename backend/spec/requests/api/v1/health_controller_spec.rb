require 'rails_helper'

RSpec.describe "Api::V1::HealthControllers", type: :request do
  describe "GET /api/v1/up" do
    it "returns http success" do
      get "/api/v1/up"
      expect(response).to have_http_status(:success)
    end
  end
end