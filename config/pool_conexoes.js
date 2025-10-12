const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('🚀 Conectando ao Railway MySQL...');
console.log('Host:', process.env.DB_HOST);
console.log('Database:', process.env.DB_NAME);

// Configuração otimizada para Railway
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 20,
    enableKeepAlive: true,
    keepAliveInitialDelayMs: 0,
    maxPacketSize: 16 * 1024 * 1024,
    charset: 'utf8mb4',
    timezone: '+00:00',
    // ✅ Configurações adicionais para Railway
    autocommit: false,
    multipleStatements: false,
    flags: '-STRICT_TRANS_TABLES,-STRICT_ALL_TABLES'
});

// Teste de conexão ao iniciar
pool.getConnection()
    .then(conn => {
        console.log('✅ Conectado ao Railway MySQL com sucesso!');
        conn.release();
    })
    .catch(err => {
        console.error('❌ Erro ao conectar ao Railway:', err.message);
        console.error('Verifique suas credenciais no .env');
    });

// Função para executar queries
async function executeQuery(query, params = []) {
    let connection;
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`[Tentativa ${attempt}/${maxRetries}] Executando query...`);
            
            connection = await pool.getConnection();
            
            // Adicionar timeout de 30 segundos
            const [rows] = await Promise.race([
                connection.execute(query, params),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Query timeout (30s)')), 30000)
                )
            ]);
            
            console.log('✅ Query executada com sucesso');
            return rows;
            
        } catch (error) {
            console.error(`❌ Erro na tentativa ${attempt}:`, error.message);
            
            // Erros de conexão que valem retry
            if (error.code === 'ER_MALFORMED_PACKET' || 
                error.code === 'PROTOCOL_CONNECTION_LOST' ||
                error.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR' ||
                error.code === 'ECONNREFUSED' ||
                error.code === 'ENOTFOUND') {
                
                if (attempt < maxRetries) {
                    const delayMs = 2000 * attempt;
                    console.log(`⏳ Aguardando ${delayMs}ms antes de tentar novamente...`);
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                    continue;
                }
            }
            
            // Última tentativa - lançar erro
            if (attempt === maxRetries) {
                throw error;
            }
            
            // Aguardar antes de tentar novamente
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            
        } finally {
            if (connection) {
                try {
                    connection.release();
                } catch (e) {
                    console.error('Erro ao liberar conexão:', e.message);
                }
            }
        }
    }
}

// Teste de conexão
async function testConnection() {
    try {
        console.log('🔍 Testando conexão com Railway...');
        const result = await executeQuery('SELECT 1 as test');
        console.log('✅ Conexão com Railway OK!');
        return true;
    } catch (error) {
        console.error('❌ Erro na conexão com Railway:', error.message);
        return false;
    }
}

// Fechar pool
async function closePool() {
    try {
        await pool.end();
        console.log('✅ Pool de conexões fechado');
    } catch (error) {
        console.error('❌ Erro ao fechar pool:', error.message);
        throw error;
    }
}

// Testar conexão ao iniciar
testConnection();

module.exports = {
    pool,
    executeQuery,
    testConnection,
    closePool
};