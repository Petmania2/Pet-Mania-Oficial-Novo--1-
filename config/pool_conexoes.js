const mysql = require('mysql');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  connectionLimit: 4,
  // Tenta usar autenticação legada
  insecureAuth: true,
  // Ou especifica o método de autenticação
  authSwitchHandler: function (data, cb) {
    if (data.pluginName === 'mysql_native_password') {
      console.log('Usando mysql_native_password');
      cb(null, Buffer.from(process.env.DB_PASSWORD + '\0'));
    }
  }
});

pool.getConnection((err, conn) => {
  if(err) 
    console.log("Erro ao conectar ao banco:", err);
  else {
    console.log("Conectado ao banco Clever Cloud!");
    conn.release();
  }
});

module.exports = pool;