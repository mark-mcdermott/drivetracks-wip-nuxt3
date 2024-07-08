class Api::Auth::AuthController < ActionController::API

  def login
    @no_auth_errors = true
    creds = creds_from_params
    if @no_auth_errors then user = user_from_creds(creds) end
    if @no_auth_errors then token = token_from_user(user) end
    if @no_auth_errors
      token.active = true
      render json: { token: token.token }
    end
  end

  def logout
  end

  def session
    @no_auth_errors = true
    token = token_from_headers
    if @no_auth_errors then user = user_from_token(token) end
    if @no_auth_errors 
      render json: { user: user }
    end
  end

  private

  def creds_from_params
    unless params.has_key?(:email) && params.has_key?(:password)
      handle_auth_error "Missing email and/or password", 401
    end
    creds = {}
    creds['email'] = params[:email]
    creds['password'] = params[:password]
    creds
  end

  def user_from_creds creds
    user = User.find_by(email: creds['email'], password: creds['password'])
    if !user.present?
      handle_auth_error "Wrong email and/or password", 401
    end
    user
  end

  def token_from_user user
    token = Token.find_by(user: user)
    if !token.present?
      handle_auth_error "User token not found", 404
    end
    token
  end

  def token_from_headers
    if 
      request.headers['Authorization'].present? && 
      request.headers['Authorization'].split(' ').present? && 
      request.headers['Authorization'].split(' ').last.present?
      token = request.headers['Authorization'].split(' ').last
    else
      handle_auth_error "User token not found", 404
    end
    token
  end

  def token_obj_from_token_str token_str
    tokenObj = Token.find_by(token: token_str)
    if !tokenObj.present?
      handle_auth_error "User token not found", 404
    end
    tokenObj
  end

  def user_from_token token_str
    token_obj = token_obj_from_token_str token_str
    if token_obj.present?
      user = User.find_by(token: token_obj)
    end
    user
  end

  def handle_auth_error message, status
    @no_auth_errors = false
    render json: { error: message }, status: status
  end

end