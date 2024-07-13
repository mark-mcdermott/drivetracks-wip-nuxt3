require "rails_helper"

RSpec.describe "Login requests" do

  let(:user) { build :user, email: "email", password: "password" }
  let(:valid_creds) {{ :email => user.email, :password => user.password }}
  let(:invalid_creds) {{ :email => user.email, :password => "wrong" }}
  let(:headers) {{ authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJtaWNoYWVsdyIsImVtYWlsIjoibWljaGFlbC53aWxsaWFtc0B4LmR1bW15anNvbi5jb20iLCJmaXJzdE5hbWUiOiJNaWNoYWVsIiwibGFzdE5hbWUiOiJXaWxsaWFtcyIsImdlbmRlciI6Im1hbGUiLCJpbWFnZSI6Imh0dHBzOi8vZHVtbXlqc29uLmNvbS9pY29uL21pY2hhZWx3LzEyOCIsImlhdCI6MTcxNzYxMTc0MCwiZXhwIjoxNzE3NjE1MzQwfQ.eQnhQSnS4o0sXZWARh2HsWrEr6XfDT4ngh0ejiykfH8" }}

  it "responds with error" do
    post "/api/auth/login", params: { user: { :email => user.email, :password => user.password }}
    expect(response).to have_http_status(:success)
  end
end

# RSpec.describe "Login requests", type: :request do
#   context "with invalid credentials" do
#     it "responds with error" do
#       post "/api/auth/login", :params => { :email => user.email, :password => "wrong" }
#       expect(response).to be_error
#     end
#   end

  # context "with valid credentials" do
  #   it "responds with success" do
  #     post "/api/auth/login" :params => { :email => user.email, :password => user.password }
  #     expect(response).to be_success
  #   end

  #   it "responds with token " do
  #     post "/api/auth/login" :params => { :email => user.email, :password => user.password }
  #     expect(response.body).to tokenregex
  #   end
  # end

# end

# RSpec.describe "Session requests", type: :request do
#   context "without auth header" do
#     it "responds with error" do
#       post "/api/auth/login" :params => { :email => "email", :password => "wrong" }
#       expect(response).to be_error
#     end
#   end

#   context "with auth header" do
#     it "responds with user" do
#       post "/api/auth/login", :headers => headers, :params => { :email => "email", :password => "wrong" }
#       expect(response).to user
#     end
#   end
# end