// Environment variables yükle
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

// JWT Secret key - sadece environment variable kullan
if (!process.env.JWT_SECRET) {
  console.error("UYARI: JWT_SECRET environment variable tanımlanmamış!");
  console.error("Lütfen .env dosyasında JWT_SECRET tanımlayın.");
  process.exit(1);
}

// Middleware'ler
app.use(cors());
app.use(express.json());

// Routes
const blogRoutes = require("./routes/blogRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const reactionRoutes = require("./routes/reactionRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const tagRoutes = require("./routes/tagRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const passwordResetRoutes = require("./routes/passwordResetRoutes");

app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reactions", reactionRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/password-reset", passwordResetRoutes);

// Static dosya servisi
app.use('/uploads', express.static('uploads'));

// Auth routes için alias (frontend uyumluluğu için)
app.use("/api/auth", userRoutes);

// Sağlık kontrol endpoint'i
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    ok: true, 
    message: "BlogSphere API çalışıyor", 
    timestamp: new Date().toISOString() 
  });
});

// 404 handler
app.use("/api", (req, res) => {
  res.status(404).json({ 
    ok: false, 
    error: "Endpoint bulunamadı" 
  });
});

// Hata handler
app.use((err, req, res, next) => {
  console.error("Hata:", err);
  res.status(err.status || 500).json({ 
    ok: false, 
    error: err.message || "Sunucu hatası" 
  });
});

// Server başlat
app.listen(PORT, () => {
  console.log(`BlogSphere Server http://localhost:${PORT} üzerinde çalışıyor`);
  console.log(`API Endpoints:`);
  console.log(`- Blogs: http://localhost:${PORT}/api/blogs`);
  console.log(`- Users: http://localhost:${PORT}/api/users`);
  console.log(`- Categories: http://localhost:${PORT}/api/categories`);
  console.log(`- Comments: http://localhost:${PORT}/api/comments`);
  console.log(`- Reactions: http://localhost:${PORT}/api/reactions`);
  console.log(`- Bookmarks: http://localhost:${PORT}/api/bookmarks`);
  console.log(`- Tags: http://localhost:${PORT}/api/tags`);
  console.log(`- Notifications: http://localhost:${PORT}/api/notifications`);
});
