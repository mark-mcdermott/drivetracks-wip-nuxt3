# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
# email                   :string     default(""), not null, index
# encrypted_password      :string     default(""), not null
# admin                   :boolean    not null
# uuid                    :uuid       unique, index
# reset_password_token    :string     unique, index
# reset_password_sent_at  :datetime
# remember_created_at     :datetime
# sign_in_count           :integer    default(0), not null
# current_sign_in_at      :datetime
# last_sign_in_at         :datetime
# current_sign_in_ip      :string
# last_sign_in_ip         :string
# confirmation_token      :string     index
# confirmed_at            :datetime
# confirmation_sent_at    :datetime
# unconfirmed_email       :string
# failed_attempts         :integer    default(0),not null
# unlock_token            :string     unique, index
# locked_at               :datetime
# created_at              :datetime   not null
# updated_at              :datetime   not null
# jti                     :string     not null, unique, index

require 'rails_helper'

# Devise handles most validations internally, so I believe this is all we can test here
RSpec.describe User, type: :model do
  it { should validate_presence_of(:email) }
  it { should validate_presence_of(:password) }
end