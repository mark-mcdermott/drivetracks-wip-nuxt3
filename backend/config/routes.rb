# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      namespace :auth do
        get 'current_user', to: 'current_user#index'
        post 'login', to: 'sessions#create'
        delete 'logout', to: 'sessions#destroy'
      end
      resources :users, param: :uuid
      get 'up' => 'health#show'
    end
  end
  devise_for :users, path: '', path_names: {
    sign_in: 'api/v1/auth/login',
    sign_out: 'api/v1/auth/logout',
    registration: 'api/v1/auth/signup'
  }, controllers: {
    sessions: 'api/v1/auth/sessions',
    registrations: 'api/v1/auth/registrations'
  }
end