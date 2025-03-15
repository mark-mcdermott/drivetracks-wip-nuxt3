class UserSerializer
  include JSONAPI::Serializer
  attributes :id, :email, :uuid
end
