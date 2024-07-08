class Token < ApplicationRecord
  belongs_to :user
  validates :token_str, presence: true, uniqueness: true
  encrypts :token, deterministic: true
  before_validation :generate_token, on: :create
  
  private

  def generate_token
    self.token_str = Digest::MD5.hexdigest(SecureRandom.hex)
  end

end