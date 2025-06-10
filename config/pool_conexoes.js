const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuração do pool de conexões otimizada para Clever Cloud
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 3, // Reduzido para 3 (máximo é 5 no Clever Cloud)
    queueLimit: 0,
    acquireTimeout: 30000,
    timeout: 20000,
    idleTimeout: 30000, // Fechar conexões inativas após 30s
    maxIdle: 1, // Manter apenas 1 conexão idle
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    reconnect: true,
    ssl: {
        rejectUnauthorized: false
    }
});

// Função para executar queries com retry automático e liberação de conexão
async function executeQuery(query, params = []) {
    const maxRetries = 5;
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        let connection = null;
        
        try {
            console.log(`Executando query (tentativa ${attempt}):`, query.substring(0, 50) + '...');
            
            // Usar conexão única em vez do pool para melhor controle
            connection = await pool.getConnection();
            const [rows] = await connection.execute(query, params);
            
            console.log(`✅ Query executada com sucesso!`);
            return rows;
            
        } catch (error) {
            lastError = error;
            console.error(`❌ Erro na tentativa ${attempt}:`, {
                message: error.message,
                code: error.code,
                errno: error.errno
            });
            
            // Se for erro de limite de conexões, aguardar mais tempo
            if (error.code === 'ER_USER_LIMIT_REACHED' || 
                error.code === 'ER_TOO_MANY_USER_CONNECTIONS' || 
                error.code === 1226) {
                
                if (attempt < maxRetries) {
                    const waitTime = attempt * 2000; // Aumentar tempo de espera progressivamente
                    console.log(`⏳ Limite de conexões atingido. Aguardando ${waitTime}ms...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    continue;
                }
            }
            
            // Se for erro de conexão perdida, tentar reconectar
            if (error.code === 'ECONNRESET' || 
                error.code === 'PROTOCOL_CONNECTION_LOST' ||
                error.code === 'ENOTFOUND') {
                
                if (attempt < maxRetries) {
                    console.log('🔄 Problema de conexão. Tentando novamente...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    continue;
                }
            }
            
            // Para outros erros críticos, parar imediatamente
            if (error.code === 'ER_ACCESS_DENIED_ERROR' || 
                error.code === 'ER_BAD_DB_ERROR') {
                break;
            }
            
        } finally {
            // SEMPRE liberar a conexão
            if (connection) {
                try {
                    connection.release();
                    console.log('🔓 Conexão liberada');
                } catch (releaseError) {
                    console.error('Erro ao liberar conexão:', releaseError.message);
                }
            }
        }
    }
    
    // Se chegou aqui, todas as tentativas falharam
    console.error('❌ Todas as tentativas falharam. Último erro:', lastError.message);
    throw lastError;
}

// Função para testar a conexão
async function testConnection() {
    try {
        console.log('🔍 Testando conexão com o banco de dados...');
        await executeQuery('SELECT 1 as test');
        console.log('✅ Conexão com banco de dados estabelecida com sucesso!');
        return true;
    } catch (error) {
        console.error('❌ Erro ao conectar com o banco de dados:', error.message);
        return false;
    }
}

// Função para limpar conexões inativas periodicamente
function setupConnectionCleaner() {
    setInterval(async () => {
        try {
            console.log('🧹 Limpando conexões inativas...');
            // Executar uma query simples para manter pelo menos uma conexão ativa
            await executeQuery('SELECT 1 as keepalive');
        } catch (error) {
            console.log('Erro na limpeza de conexões:', error.message);
        }
    }, 5 * 60 * 1000); // A cada 5 minutos
}

// Função para fechar o pool de conexões graciosamente
async function closePool() {
    try {
        await pool.end();
        console.log('🔒 Pool de conexões fechado');
    } catch (error) {
        console.error('Erro ao fechar pool:', error);
    }
}

// Configurar limpeza automática
setupConnectionCleaner();

// NÃO testar conexão na inicialização para evitar usar conexões desnecessariamente
// testConnection();

// Exportar o pool e as funções
module.exports = {
    pool,
    executeQuery,
    testConnection,
    closePool
};