const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    console.log('🔍 Testando conexão com MySQL...');
    console.log('Host:', process.env.DB_HOST);
    console.log('User:', process.env.DB_USER);
    console.log('Database:', process.env.DB_NAME);
    console.log('Port:', process.env.DB_PORT);
    
    const config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        connectTimeout: 20000,
        acquireTimeout: 20000,
        timeout: 20000,
        // Configurações adicionais para Clever Cloud
        ssl: {
            rejectUnauthorized: false
        }
    };

    try {
        console.log('⏳ Tentando conectar...');
        const connection = await mysql.createConnection(config);
        
        console.log('✅ Conexão estabelecida com sucesso!');
        
        // Testar uma query simples
        const [rows] = await connection.execute('SELECT 1 as test');
        console.log('✅ Query de teste executada:', rows);
        
        await connection.end();
        console.log('✅ Conexão fechada corretamente');
        
    } catch (error) {
        console.error('❌ Erro na conexão:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState
        });
        
        // Diagnósticos adicionais
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n🔧 Possíveis soluções:');
            console.log('1. Verificar se as credenciais estão corretas no Clever Cloud');
            console.log('2. Verificar se o IP está autorizado');
            console.log('3. Verificar se o banco de dados existe');
            console.log('4. Tentar regenerar as credenciais no Clever Cloud');
        }
        
        if (error.code === 'ENOTFOUND') {
            console.log('\n🔧 Host não encontrado - verificar URL do banco');
        }
        
        if (error.code === 'ETIMEDOUT') {
            console.log('\n🔧 Timeout - verificar firewall/rede');
        }
    }
}

// Também testar sem especificar o database
async function testConnectionWithoutDB() {
    console.log('\n🔍 Testando conexão sem especificar database...');
    
    const config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        ssl: {
            rejectUnauthorized: false
        }
    };

    try {
        const connection = await mysql.createConnection(config);
        console.log('✅ Conexão sem DB estabelecida!');
        
        // Listar databases disponíveis
        const [databases] = await connection.execute('SHOW DATABASES');
        console.log('📋 Databases disponíveis:', databases.map(db => db.Database));
        
        await connection.end();
        
    } catch (error) {
        console.error('❌ Erro na conexão sem DB:', error.message);
    }
}

// Executar testes
async function runTests() {
    await testConnection();
    await testConnectionWithoutDB();
}

runTests();