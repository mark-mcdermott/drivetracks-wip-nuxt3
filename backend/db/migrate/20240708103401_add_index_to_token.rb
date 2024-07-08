class AddIndexToToken < ActiveRecord::Migration[7.1]
  def change
    add_index :tokens, :token_str
  end
end
