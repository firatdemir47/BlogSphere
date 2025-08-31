-- Kategoriler tablosu güncelleme
ALTER TABLE categories ADD COLUMN icon VARCHAR(10) DEFAULT '📚';
ALTER TABLE categories ADD COLUMN color VARCHAR(7) DEFAULT '#007bff';

-- Mevcut kategorilere icon ve color ekle
UPDATE categories SET 
    icon = '💻', 
    color = '#007bff' 
WHERE name = 'Teknoloji';

UPDATE categories SET 
    icon = '🔬', 
    color = '#28a745' 
WHERE name = 'Bilim';

UPDATE categories SET 
    icon = '🎨', 
    color = '#dc3545' 
WHERE name = 'Sanat';

UPDATE categories SET 
    icon = '⚽', 
    color = '#ffc107' 
WHERE name = 'Spor';

UPDATE categories SET 
    icon = '🏥', 
    color = '#17a2b8' 
WHERE name = 'Sağlık';

UPDATE categories SET 
    icon = '📚', 
    color = '#6f42c1' 
WHERE name = 'Eğitim';

UPDATE categories SET 
    icon = '✈️', 
    color = '#fd7e14' 
WHERE name = 'Seyahat';

UPDATE categories SET 
    icon = '🍕', 
    color = '#e83e8c' 
WHERE name = 'Yemek';

