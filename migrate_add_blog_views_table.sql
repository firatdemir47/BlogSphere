-- Blog views tracking table
CREATE TABLE IF NOT EXISTS blog_views (
    id SERIAL PRIMARY KEY,
    blog_id INTEGER NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(blog_id, user_id)
);

-- Index for better performance
CREATE INDEX IF NOT EXISTS idx_blog_views_blog_id ON blog_views(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_views_user_id ON blog_views(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_views_ip_address ON blog_views(ip_address);



