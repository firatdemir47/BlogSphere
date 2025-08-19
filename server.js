const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Body parser (JSON) önce gelmeli
app.use(express.json());

// Blog route
const blogRoutes = require("./routes/blogRoutes");
app.use("/api/blogs", blogRoutes);

// Sağlık kontrolü (Health Check)
app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true, message: "API çalışıyor", timestamp: new Date().toISOString() });
});

// 404 - /api altında tanımlı olmayan yollar
app.use("/api", (req, res) => {
  res.status(404).json({ ok: false, error: "Bulunamadı" });
});

// Global hata yakalayıcı
app.use((err, req, res, next) => {
  console.error("Hata:", err);
  res.status(err.status || 500).json({ ok: false, error: err.message || "Sunucu hatası" });
});

app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} üzerinde ayakta`);
});
