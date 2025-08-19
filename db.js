const { Pool } = require("pg");

const pool = new Pool({
  user: "firat",       
  host: "localhost",
  database: "blogdb",  
  password: "",       
  port: 5432
});

pool.on("connect", () => {
  console.log("PostgreSQL bağlantısı başarılı ");
});

pool.on("error", (err) => {
  console.error("PostgreSQL bağlantı hatası:", err);
});

module.exports = pool;
