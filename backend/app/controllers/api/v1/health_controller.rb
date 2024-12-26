class Api::V1::HealthController < ApplicationController
  def show
    render json: { status: 'OK' }, status: :ok
  end
end