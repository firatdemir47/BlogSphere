-- BlogSphere View Count Migration Script
-- Bu script mevcut blogs tablosuna view_count kolonu ekler

-- 1. View count kolonu ekleme
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- 2. Mevcut blog'lara varsayılan view count değeri atama
UPDATE blogs SET view_count = 0 WHERE view_count IS NULL;

-- 3. View count kolonunu NOT NULL yapma
ALTER TABLE blogs ALTER COLUMN view_count SET NOT NULL;

-- 4. View count için index oluşturma (performans için)
CREATE INDEX IF NOT EXISTS idx_blogs_view_count ON blogs(view_count DESC);

-- 5. Migration tamamlandı mesajı
SELECT 'View count migration completed successfully!' as status;
