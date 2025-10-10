const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuração simplificada e robusta
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 1,
    ssl: {
        rejectUnauthorized: false
    }
});

// Função simplificada para executar queries
async function executeQuery(query, params = []) {
    let connection;
    const maxRetries = 2;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Executando query (tentativa ${attempt})`);
            
            connection = await pool.getConnection();
            const [rows] = await connection.execute(query, params);
            
            console.log('Query executada com sucesso');
            return rows;
            
        } catch (error) {
            console.error(`Erro na tentativa ${attempt}:`, error.message);
            
            if (attempt === maxRetries) {
                throw error;
            }
            
            // Aguardar antes de tentar novamente
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }
}

// Teste de conexão simples
// Função para fechar o pool de conexões
async function closePool() {
    try {
        await pool.end();
        console.log('Pool de conexões fechado com sucesso');
    } catch (error) {
        console.error('Erro ao fechar pool de conexões:', error.message);
        throw error;
    }
}
async function testConnection() {
    try {
        await executeQuery('SELECT 1 as test');
        console.log('Conexão com banco OK');
        return true;
    } catch (error) {
        console.error('Erro na conexão:', error.message);
        return false;
    }
}

module.exports = {
    pool,
    executeQuery,
    testConnection,
    closePool
};