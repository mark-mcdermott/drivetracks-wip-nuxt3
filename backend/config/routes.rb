Rails.application.routes.draw do
  resources :users
  namespace :api do
    namespace :auth do
      post "login", to: "auth#login"
      post "logout", to: "auth#logout"
      get "session", to: "auth#session"
    end
  end
end
