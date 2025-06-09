const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 4,
  queueLimit: 0
});

pool.getConnection((err, conn) => {
  if(err) 
    console.log("Erro ao conectar ao banco:", err);
  else {
    console.log("Conectado ao banco Clever Cloud!");
    conn.release();
  }
});

module.exports = pool.promise();
