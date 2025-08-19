const { Pool } = require("pg");

const pool = new Pool({
  user: "firat",       // PostgreSQL kullanıcı adın
  host: "localhost",
  database: "blogdb",  // oluşturduğumuz database
  password: "",        // şifren varsa ekle
  port: 5432
});

pool.on("connect", () => {
  console.log("PostgreSQL bağlantısı başarılı ✅");
});

pool.on("error", (err) => {
  console.error("PostgreSQL bağlantı hatası:", err);
});

module.exports = pool;
