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

app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);

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
});
