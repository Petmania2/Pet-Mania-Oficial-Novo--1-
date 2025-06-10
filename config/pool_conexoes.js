const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  
  // Configurações de timeout e reconexão
  acquireTimeout: 60000,
  timeout: 60000,
  connectTimeout: 60000,
  
  // Configurações de pool
  connectionLimit: 5,
  queueLimit: 0,
  
  // Configurações de reconexão
  reconnect: true,
  idleTimeout: 300000, // 5 minutos
  
  // Configurações SSL (importante para Clever Cloud)
  ssl: {
    rejectUnauthorized: false
  },
  
  // Configurações de autenticação
  authSwitchHandler: function (data, cb) {
    if (data.pluginName === 'mysql_native_password') {
      console.log('Usando mysql_native_password');
      cb(null, Buffer.from(process.env.DB_PASSWORD + '\0'));
    }
  },
  
  // Configurações adicionais para estabilidade
  charset: 'utf8mb4',
  multipleStatements: false,
  
  // Configurações de keep-alive
  keepAliveInitialDelay: 0,
  enableKeepAlive: true,
  
  // Configurações de retry
  maxReconnects: 3,
  reconnectDelay: 2000
});

// Função para testar a conexão
async function testarConexao() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado ao banco Clever Cloud com sucesso!');
    
    // Teste simples de query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Teste de query executado com sucesso:', rows[0]);
    
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco:', error.message);
    return false;
  }
}

// Testar conexão na inicialização
testarConexao();

// Configurar handlers de eventos do pool
pool.on('connection', function (connection) {
  console.log('🔗 Nova conexão estabelecida como id ' + connection.threadId);
});

pool.on('error', function(err) {
  console.error('❌ Erro no pool de conexões:', err);
  if(err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('🔄 Tentando reconectar...');
  }
});

// Função para executar queries com retry
async function executeQuery(query, params = []) {
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const [results] = await pool.execute(query, params);
      return results;
    } catch (error) {
      attempt++;
      console.error(`❌ Tentativa ${attempt} falhou:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Aguardar antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// Exportar pool e função de query
module.exports = {
  pool,
  executeQuery,
  testarConexao
};