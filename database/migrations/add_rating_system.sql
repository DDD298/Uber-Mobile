-- Migration: Add Rating System
-- Created: 2025-12-27
-- Description: Thêm bảng ratings và cập nhật bảng drivers để hỗ trợ hệ thống đánh giá

-- Tạo bảng ratings
CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    ride_id INTEGER NOT NULL UNIQUE,
    user_id VARCHAR(255) NOT NULL,
    driver_id INTEGER NOT NULL,
    stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys
    CONSTRAINT fk_ride FOREIGN KEY (ride_id) REFERENCES rides(ride_id) ON DELETE CASCADE,
    CONSTRAINT fk_driver FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE
);

-- Thêm index để tăng tốc query
CREATE INDEX IF NOT EXISTS idx_ratings_driver_id ON ratings(driver_id);
CREATE INDEX IF NOT EXISTS idx_ratings_ride_id ON ratings(ride_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);

-- Thêm cột rating cho bảng drivers (nếu chưa có)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='drivers' AND column_name='rating_count') THEN
        ALTER TABLE drivers ADD COLUMN rating_count INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='drivers' AND column_name='average_rating') THEN
        ALTER TABLE drivers ADD COLUMN average_rating DECIMAL(3, 2) DEFAULT 5.0;
    END IF;
END $$;

-- Function để tự động cập nhật rating của driver khi có rating mới
CREATE OR REPLACE FUNCTION update_driver_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE drivers
    SET 
        rating_count = (SELECT COUNT(*) FROM ratings WHERE driver_id = NEW.driver_id),
        average_rating = (SELECT ROUND(AVG(stars)::numeric, 2) FROM ratings WHERE driver_id = NEW.driver_id)
    WHERE id = NEW.driver_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger để tự động cập nhật rating
DROP TRIGGER IF EXISTS trigger_update_driver_rating ON ratings;
CREATE TRIGGER trigger_update_driver_rating
    AFTER INSERT OR UPDATE ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_driver_rating();

-- Comments
COMMENT ON TABLE ratings IS 'Lưu trữ đánh giá của khách hàng cho tài xế sau mỗi chuyến đi';
COMMENT ON COLUMN ratings.stars IS 'Số sao đánh giá từ 1-5';
COMMENT ON COLUMN ratings.comment IS 'Nhận xét chi tiết (tùy chọn)';
