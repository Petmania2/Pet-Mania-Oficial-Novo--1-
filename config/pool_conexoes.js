const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuração do pool MUITO mais conservadora para Clever Cloud
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 4, // REDUZIDO para apenas 2 conexões
    queueLimit: 10, // Fila limitada
    acquireTimeout: 10000, // Timeout menor
    timeout: 15000, // Timeout de query menor
    idleTimeout: 10000, // Fechar conexões inativas rapidamente
    maxIdle: 0, // NÃO manter conexões idle
    enableKeepAlive: false, // Desabilitar keep-alive
    reconnect: true,
    ssl: {
        rejectUnauthorized: false
    }
});

// Singleton para controlar uma única conexão ativa
class DatabaseConnection {
    constructor() {
        this.activeConnection = null;
        this.connectionInUse = false;
    }

    async getConnection() {
        // Se já tem uma conexão ativa e não está em uso, reutilizar
        if (this.activeConnection && !this.connectionInUse) {
            try {
                // Testar se a conexão ainda está válida
                await this.activeConnection.ping();
                this.connectionInUse = true;
                return this.activeConnection;
            } catch (error) {
                // Conexão morreu, limpar
                this.activeConnection = null;
                this.connectionInUse = false;
            }
        }

        // Criar nova conexão se necessário
        if (!this.activeConnection) {
            this.activeConnection = await pool.getConnection();
            this.connectionInUse = true;
        }

        return this.activeConnection;
    }

    releaseConnection() {
        this.connectionInUse = false;
        // NÃO liberar a conexão imediatamente, reutilizar
    }

    async closeConnection() {
        if (this.activeConnection) {
            try {
                this.activeConnection.release();
                this.activeConnection = null;
                this.connectionInUse = false;
            } catch (error) {
                console.error('Erro ao fechar conexão:', error.message);
            }
        }
    }
}

// Instância singleton
const dbConnection = new DatabaseConnection();

// Função otimizada para executar queries
async function executeQuery(query, params = []) {
    const maxRetries = 3; // Reduzido para 3 tentativas
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`🔍 Executando query (tentativa ${attempt})`);
            
            const connection = await dbConnection.getConnection();
            const [rows] = await connection.execute(query, params);
            
            console.log(`✅ Query executada com sucesso!`);
            dbConnection.releaseConnection();
            return rows;
            
        } catch (error) {
            lastError = error;
            console.error(`❌ Erro na tentativa ${attempt}:`, {
                message: error.message,
                code: error.code
            });
            
            dbConnection.releaseConnection();
            
            // Se for erro de limite de conexões
            if (error.code === 'ER_USER_LIMIT_REACHED' || 
                error.code === 'ER_TOO_MANY_USER_CONNECTIONS' || 
                error.errno === 1226) {
                
                console.log('🚫 Limite de conexões atingido. Fechando todas as conexões...');
                
                // Fechar conexão singleton
                await dbConnection.closeConnection();
                
                // Fechar todas as conexões do pool
                try {
                    await pool.end();
                    console.log('🔒 Pool fechado devido ao limite');
                } catch (e) {
                    console.error('Erro ao fechar pool:', e.message);
                }
                
                // Recriar pool se não for a última tentativa
                if (attempt < maxRetries) {
                    const waitTime = attempt * 3000;
                    console.log(`⏳ Aguardando ${waitTime}ms antes de tentar novamente...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    continue;
                }
            }
            
            // Para erros de conexão, fechar e tentar novamente
            if (error.code === 'ECONNRESET' || 
                error.code === 'PROTOCOL_CONNECTION_LOST') {
                
                await dbConnection.closeConnection();
                
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    continue;
                }
            }
            
            // Para outros erros, parar
            break;
        }
    }
    
    console.error('❌ Todas as tentativas falharam:', lastError.message);
    throw lastError;
}

// Função para testar conexão de forma mais leve
async function testConnection() {
    try {
        console.log('🔍 Testando conexão...');
        await executeQuery('SELECT 1 as test');
        console.log('✅ Conexão OK!');
        return true;
    } catch (error) {
        console.error('❌ Erro na conexão:', error.message);
        return false;
    }
}

// Limpeza agressiva de conexões a cada 2 minutos
function setupConnectionCleaner() {
    setInterval(async () => {
        try {
            console.log('🧹 Limpando conexões...');
            await dbConnection.closeConnection();
            
            // Forçar limpeza do pool
            const poolConnections = pool._allConnections;
            if (poolConnections && poolConnections.length > 0) {
                console.log(`🔄 Limpando ${poolConnections.length} conexões do pool...`);
                for (const conn of poolConnections) {
                    try {
                        if (conn && conn.connection && !conn.connection.destroyed) {
                            conn.connection.destroy();
                        }
                    } catch (e) {
                        // Ignorar erros de limpeza
                    }
                }
            }
        } catch (error) {
            console.log('Erro na limpeza:', error.message);
        }
    }, 2 * 60 * 1000); // A cada 2 minutos
}

// Função para fechar tudo
async function closePool() {
    try {
        await dbConnection.closeConnection();
        await pool.end();
        console.log('🔒 Todas as conexões fechadas');
    } catch (error) {
        console.error('Erro ao fechar:', error.message);
    }
}

// Configurar limpeza
setupConnectionCleaner();

module.exports = {
    pool,
    executeQuery,
    testConnection,
    closePool
};