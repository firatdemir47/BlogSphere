-- BlogSphere Veritabanı Şeması

-- Kullanıcılar tablosu
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kategoriler tablosu
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog tablosu (güncellenmiş)
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Yorumlar tablosu (güncellenmiş)
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Varsayılan kategoriler ekleme
INSERT INTO categories (name, description) VALUES
('Teknoloji', 'Teknoloji ile ilgili blog yazıları'),
('Bilim', 'Bilimsel konular ve araştırmalar'),
('Sanat', 'Sanat, müzik, edebiyat ve kültür'),
('Spor', 'Spor haberleri ve analizleri'),
('Sağlık', 'Sağlık ve yaşam tarzı'),
('Eğitim', 'Eğitim ve öğrenme konuları'),
('Seyahat', 'Seyahat ve turizm'),
('Yemek', 'Yemek tarifleri ve gastronomi');

-- Index'ler
CREATE INDEX idx_blogs_author_id ON blogs(author_id);
CREATE INDEX idx_blogs_category_id ON blogs(category_id);
CREATE INDEX idx_comments_blog_id ON comments(blog_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
