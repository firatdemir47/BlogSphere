-- Önce user_roles tablosunu oluştur ve verileri ekle
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Varsayılan roller ekle
INSERT INTO user_roles (name, description, permissions) VALUES
('user', 'Normal kullanıcı', '{"read": true, "write": true, "comment": true}'),
('moderator', 'Moderatör', '{"read": true, "write": true, "comment": true, "moderate": true}'),
('admin', 'Yönetici', '{"read": true, "write": true, "comment": true, "moderate": true, "admin": true}');

-- Şimdi users tablosuna role_id ekle
ALTER TABLE users ADD COLUMN role_id INTEGER REFERENCES user_roles(id) DEFAULT 1;

-- Likes/Dislikes tablosu
CREATE TABLE blog_reactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
    reaction_type VARCHAR(10) CHECK (reaction_type IN ('like', 'dislike')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, blog_id)
);

-- Bookmarks tablosu
CREATE TABLE bookmarks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, blog_id)
);

-- Tags tablosu
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#007bff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog-Tags ilişki tablosu
CREATE TABLE blog_tags (
    blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_id, tag_id)
);

-- Notifications tablosu
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users tablosuna avatar ve diğer alanlar ekle
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(255);
ALTER TABLE users ADD COLUMN bio TEXT;
ALTER TABLE users ADD COLUMN website VARCHAR(255);
ALTER TABLE users ADD COLUMN location VARCHAR(100);
ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

-- Blog Images tablosu
CREATE TABLE blog_images (
    id SERIAL PRIMARY KEY,
    blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Varsayılan etiketler ekle
INSERT INTO tags (name, description, color) VALUES
('JavaScript', 'JavaScript ile ilgili içerikler', '#f7df1e'),
('React', 'React framework ile ilgili içerikler', '#61dafb'),
('Node.js', 'Node.js ile ilgili içerikler', '#339933'),
('Python', 'Python ile ilgili içerikler', '#3776ab'),
('Machine Learning', 'Makine öğrenmesi ile ilgili içerikler', '#ff6b6b'),
('Web Development', 'Web geliştirme ile ilgili içerikler', '#4ecdc4'),
('Mobile Development', 'Mobil geliştirme ile ilgili içerikler', '#45b7d1'),
('DevOps', 'DevOps ile ilgili içerikler', '#ff9ff3'),
('Database', 'Veritabanı ile ilgili içerikler', '#54a0ff'),
('Security', 'Güvenlik ile ilgili içerikler', '#ff6348');

-- Index'ler ekle
CREATE INDEX idx_blog_reactions_user_id ON blog_reactions(user_id);
CREATE INDEX idx_blog_reactions_blog_id ON blog_reactions(blog_id);
CREATE INDEX idx_blog_reactions_type ON blog_reactions(reaction_type);
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_blog_id ON bookmarks(blog_id);
CREATE INDEX idx_blog_tags_blog_id ON blog_tags(blog_id);
CREATE INDEX idx_blog_tags_tag_id ON blog_tags(tag_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_blog_images_blog_id ON blog_images(blog_id);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Blog tablosuna like_count ve dislike_count ekle
ALTER TABLE blogs ADD COLUMN like_count INTEGER DEFAULT 0;
ALTER TABLE blogs ADD COLUMN dislike_count INTEGER DEFAULT 0;
ALTER TABLE blogs ADD COLUMN bookmark_count INTEGER DEFAULT 0;

-- Trigger fonksiyonu - reaction count'ları güncelle
CREATE OR REPLACE FUNCTION update_blog_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.reaction_type = 'like' THEN
            UPDATE blogs SET like_count = like_count + 1 WHERE id = NEW.blog_id;
        ELSIF NEW.reaction_type = 'dislike' THEN
            UPDATE blogs SET dislike_count = dislike_count + 1 WHERE id = NEW.blog_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.reaction_type = 'like' THEN
            UPDATE blogs SET like_count = like_count - 1 WHERE id = OLD.blog_id;
        ELSIF OLD.reaction_type = 'dislike' THEN
            UPDATE blogs SET dislike_count = dislike_count - 1 WHERE id = OLD.blog_id;
        END IF;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Eski reaction'ı çıkar
        IF OLD.reaction_type = 'like' THEN
            UPDATE blogs SET like_count = like_count - 1 WHERE id = OLD.blog_id;
        ELSIF OLD.reaction_type = 'dislike' THEN
            UPDATE blogs SET dislike_count = dislike_count - 1 WHERE id = OLD.blog_id;
        END IF;
        -- Yeni reaction'ı ekle
        IF NEW.reaction_type = 'like' THEN
            UPDATE blogs SET like_count = like_count + 1 WHERE id = NEW.blog_id;
        ELSIF NEW.reaction_type = 'dislike' THEN
            UPDATE blogs SET dislike_count = dislike_count + 1 WHERE id = NEW.blog_id;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger'ları oluştur
CREATE TRIGGER trigger_update_blog_reaction_counts
    AFTER INSERT OR UPDATE OR DELETE ON blog_reactions
    FOR EACH ROW EXECUTE FUNCTION update_blog_reaction_counts();

-- Bookmark count trigger fonksiyonu
CREATE OR REPLACE FUNCTION update_blog_bookmark_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE blogs SET bookmark_count = bookmark_count + 1 WHERE id = NEW.blog_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE blogs SET bookmark_count = bookmark_count - 1 WHERE id = OLD.blog_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Bookmark count trigger'ı oluştur
CREATE TRIGGER trigger_update_blog_bookmark_count
    AFTER INSERT OR DELETE ON bookmarks
    FOR EACH ROW EXECUTE FUNCTION update_blog_bookmark_count();
