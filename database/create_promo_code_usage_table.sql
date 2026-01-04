-- Tạo bảng promo_code_usage để theo dõi việc sử dụng mã giảm giá của user
-- Chạy script này trong Neon Database Console hoặc psql

CREATE TABLE IF NOT EXISTS promo_code_usage (
  id SERIAL PRIMARY KEY,
  promo_code_id INTEGER NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  ride_id INTEGER,
  original_amount DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) NOT NULL,
  final_amount DECIMAL(10, 2) NOT NULL,
  used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign keys
  CONSTRAINT fk_promo_code
    FOREIGN KEY (promo_code_id) 
    REFERENCES promo_codes(id)
    ON DELETE CASCADE,
  
  CONSTRAINT fk_ride
    FOREIGN KEY (ride_id) 
    REFERENCES rides(id)
    ON DELETE SET NULL
);

-- Tạo indexes
CREATE INDEX IF NOT EXISTS idx_promo_code_usage_user ON promo_code_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_promo_code_usage_promo ON promo_code_usage(promo_code_id);
CREATE INDEX IF NOT EXISTS idx_promo_code_usage_used_at ON promo_code_usage(used_at);

-- Comment
COMMENT ON TABLE promo_code_usage IS 'Lưu lịch sử sử dụng mã giảm giá của user';
COMMENT ON COLUMN promo_code_usage.promo_code_id IS 'ID của mã giảm giá được sử dụng';
COMMENT ON COLUMN promo_code_usage.user_id IS 'Clerk user ID của người dùng';
COMMENT ON COLUMN promo_code_usage.ride_id IS 'ID của chuyến đi áp dụng mã';
COMMENT ON COLUMN promo_code_usage.original_amount IS 'Giá gốc trước khi giảm';
COMMENT ON COLUMN promo_code_usage.discount_amount IS 'Số tiền đã giảm giá';
COMMENT ON COLUMN promo_code_usage.final_amount IS 'Giá cuối cùng sau khi giảm';
