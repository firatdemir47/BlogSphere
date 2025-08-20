const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

const blogRoutes = require("./routes/blogRoutes");
app.use("/api/blogs", blogRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true, message: "API çalışıyor", timestamp: new Date().toISOString() });
});

app.use("/api", (req, res) => {
  res.status(404).json({ ok: false, error: "Bulunamadı" });
});

app.use((err, req, res, next) => {
  console.error("Hata:", err);
  res.status(err.status || 500).json({ ok: false, error: err.message || "Sunucu hatası" });
});

app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} üzerinde ayakta`);
});
