class Api::V1::Auth::SessionsController < ApplicationController
  before_action :authenticate_user!, only: [:destroy]
  respond_to :json

  def create
    user_params = params.dig(:user) || params.dig(:session, :user)

    if user_params.present?
      user = User.find_by(email: user_params[:email])

      if user&.valid_password?(user_params[:password])
        token = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first
        render json: {
          token: token,
          status: { code: 200, message: 'Logged in successfully.' }
        }, status: :ok
      else
        render json: {
          status: 401,
          message: 'Invalid email or password.'
        }, status: :unauthorized
      end
    else
      render json: {
        status: 400,
        message: 'Invalid parameters.'
      }, status: :bad_request
    end
  end

  def destroy
    if current_user
      # Assuming you have a method to handle logout logic
      render json: {
        status: 200,
        message: 'Logged out successfully.'
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session."
      }, status: :unauthorized
    end
  end
end