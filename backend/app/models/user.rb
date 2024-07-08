class User < ApplicationRecord
  has_one :token, dependent: :destroy
  after_create :add_user_token

  private

  def add_user_token
    self.token = Token.create({user_id: self.id, active: true})
  end
end
