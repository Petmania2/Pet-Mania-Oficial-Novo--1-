const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  
  // Configurações de timeout específicas para resolver o handshake
  acquireTimeout: 120000,     // 2 minutos para obter conexão
  timeout: 120000,            // 2 minutos timeout geral
  connectTimeout: 120000,     // 2 minutos para estabelecer conexão
  handshakeTimeout: 120000,   // CRÍTICO: timeout específico do handshake
  
  // Configurações de pool conservadoras
  connectionLimit: 5,         // Reduzido para evitar sobrecarga
  queueLimit: 0,
  
  // Configurações de reconexão
  reconnect: true,
  idleTimeout: 600000,        // 10 minutos
  maxIdle: 5,
  
  // SSL otimizado para Clever Cloud
  ssl: {
    rejectUnauthorized: false,
    ca: undefined,
    key: undefined,
    cert: undefined
  },
  
  // Configurações de autenticação mais robustas
  authSwitchHandler: function (data, cb) {
    console.log('Plugin de autenticação:', data.pluginName);
    if (data.pluginName === 'mysql_native_password') {
      cb(null, Buffer.from(process.env.DB_PASSWORD + '\0'));
    } else if (data.pluginName === 'caching_sha2_password') {
      cb(null, Buffer.from(process.env.DB_PASSWORD + '\0'));
    } else {
      cb(new Error('Plugin de autenticação não suportado: ' + data.pluginName));
    }
  },
  
  // Configurações básicas
  charset: 'utf8mb4',
  multipleStatements: false,
  
  // Configurações de rede TCP otimizadas
  keepAliveInitialDelay: 300000,  // 5 minutos
  enableKeepAlive: true,
  
  // Configurações específicas do mysql2 para stability
  dateStrings: false,
  debug: process.env.NODE_ENV === 'development',
  trace: false,
  
  // Configurações de protocolo
  supportBigNumbers: true,
  bigNumberStrings: true,
  
  // Configurações para evitar timeouts de leitura
  flags: [
    'LONG_PASSWORD',
    'FOUND_ROWS', 
    'LONG_FLAG',
    'CONNECT_WITH_DB',
    'ODBC',
    'LOCAL_FILES',
    'IGNORE_SPACE',
    'PROTOCOL_41',
    'INTERACTIVE',
    'SSL',
    'TRANSACTIONS',
    'RESERVED',
    'SECURE_CONNECTION',
    'MULTI_STATEMENTS',
    'MULTI_RESULTS'
  ]
});

// Função para testar a conexão com diagnóstico avançado
async function testarConexao() {
  console.log('🔄 Iniciando teste de conexão...');
  console.log('📊 Configurações:');
  console.log(`   Host: ${process.env.DB_HOST}`);
  console.log(`   Port: ${process.env.DB_PORT}`);
  console.log(`   User: ${process.env.DB_USER}`);
  console.log(`   Database: ${process.env.DB_NAME}`);
  
  let connection;
  try {
    // Teste de conexão com timeout manual
    console.log('🔄 Obtendo conexão do pool...');
    const connectionPromise = pool.getConnection();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout manual após 2 minutos')), 120000);
    });
    
    connection = await Promise.race([connectionPromise, timeoutPromise]);
    console.log('✅ Conexão estabelecida com sucesso!');
    console.log(`   Thread ID: ${connection.threadId}`);
    
    // Teste de query básica
    console.log('🔄 Executando query de teste...');
    const [rows] = await connection.execute('SELECT 1 as test, NOW() as current_time, @@version as mysql_version');
    console.log('✅ Query executada com sucesso:', rows[0]);
    
    // Testar configurações do servidor
    console.log('🔄 Verificando configurações do servidor...');
    const [serverInfo] = await connection.execute(`
      SELECT 
        @@wait_timeout as wait_timeout,
        @@interactive_timeout as interactive_timeout,
        @@net_read_timeout as net_read_timeout,
        @@net_write_timeout as net_write_timeout,
        @@max_allowed_packet as max_allowed_packet
    `);
    console.log('📊 Configurações do servidor:', serverInfo[0]);
    
    return true;
  } catch (error) {
    console.error('❌ Erro detalhado:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    
    // Diagnóstico específico para diferentes tipos de erro
    if (error.message.includes('timeout reading communication packets')) {
      console.log('🔍 DIAGNÓSTICO: Problema de timeout durante handshake');
      console.log('💡 SUGESTÕES:');
      console.log('   1. Verificar se o servidor MySQL está acessível');
      console.log('   2. Verificar configurações de firewall');
      console.log('   3. Verificar se as credenciais estão corretas');
      console.log('   4. Tentar conexão com timeout maior');
    }
    
    return false;
  } finally {
    if (connection) {
      console.log('🔄 Liberando conexão...');
      connection.release();
    }
  }
}

// Função para executar queries com retry e logs detalhados
async function executeQuery(query, params = []) {
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    let connection;
    try {
      // Log da tentativa
      if (attempt > 0) {
        console.log(`🔄 Tentativa ${attempt + 1} de ${maxRetries} para query`);
      }
      
      // Obter conexão com timeout
      connection = await pool.getConnection();
      
      // Executar query
      const [results] = await connection.execute(query, params);
      
      // Liberar conexão
      connection.release();
      
      return results;
    } catch (error) {
      // Liberar conexão em caso de erro
      if (connection) {
        connection.release();
      }
      
      attempt++;
      console.error(`❌ Tentativa ${attempt} falhou:`, error.message);
      
      // Verificar se é erro de timeout ou conexão
      if (error.code === 'PROTOCOL_CONNECTION_LOST' || 
          error.code === 'ECONNRESET' || 
          error.code === 'ETIMEDOUT' ||
          error.message.includes('timeout')) {
        console.log('🔄 Erro de timeout/conexão detectado, tentando novamente...');
      }
      
      if (attempt === maxRetries) {
        console.error('❌ Todas as tentativas falharam. Erro final:', error);
        throw error;
      }
      
      // Aguardar antes de tentar novamente (backoff exponencial)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      console.log(`⏳ Aguardando ${delay}ms antes da próxima tentativa...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Função para executar transações com retry
async function executeTransaction(queries) {
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();
      
      const results = [];
      for (const { query, params } of queries) {
        const [result] = await connection.execute(query, params);
        results.push(result);
      }
      
      await connection.commit();
      connection.release();
      
      return results;
    } catch (error) {
      if (connection) {
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error('❌ Erro no rollback:', rollbackError.message);
        }
        connection.release();
      }
      
      attempt++;
      console.error(`❌ Transação falhou na tentativa ${attempt}:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Testar conexão na inicialização
testarConexao();

// Configurar handlers de eventos do pool
pool.on('connection', function (connection) {
  console.log('🔗 Nova conexão estabelecida como id ' + connection.threadId);
  
  // Configurar timeouts específicos da conexão
  connection.query(`SET SESSION wait_timeout = 300`);
  connection.query(`SET SESSION interactive_timeout = 300`);
});

pool.on('error', function(err) {
  console.error('❌ Erro no pool de conexões:', err);
  if(err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('🔄 Conexão perdida, pool irá reconectar automaticamente...');
  } else if (err.code === 'ECONNRESET') {
    console.log('🔄 Conexão resetada pelo servidor...');
  } else if (err.code === 'ETIMEDOUT') {
    console.log('🔄 Timeout de conexão...');
  }
});

// Função para verificar status do pool
function getPoolStatus() {
  return {
    totalConnections: pool._allConnections.length,
    freeConnections: pool._freeConnections.length,
    usedConnections: pool._allConnections.length - pool._freeConnections.length,
    queuedRequests: pool._connectionQueue.length
  };
}

// Função para fechar o pool graciosamente
async function closePool() {
  try {
    console.log('🔄 Fechando pool de conexões...');
    await pool.end();
    console.log('✅ Pool fechado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao fechar pool:', error.message);
  }
}

// Processo de shutdown gracioso
process.on('SIGINT', async () => {
  console.log('🛑 Recebido SIGINT, fechando conexões...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Recebido SIGTERM, fechando conexões...');
  await closePool();
  process.exit(0);
});

// Exportar pool e funções
module.exports = {
  pool,
  executeQuery,
  executeTransaction,
  testarConexao,
  getPoolStatus,
  closePool
};