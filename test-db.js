// Teste de conexão com o banco de dados
const { testConnection, executeQuery } = require('./config/pool_conexoes');

async function testarBanco() {
    console.log('=== TESTE DE CONEXÃO COM BANCO ===');
    
    try {
        // Teste básico de conexão
        const conectado = await testConnection();
        if (!conectado) {
            console.log('❌ Falha na conexão básica');
            return;
        }
        console.log('✅ Conexão básica OK');
        
        // Testar se as tabelas existem
        const tabelas = ['IMAGENS', 'USUARIOS', 'clientes', 'adestradores'];
        
        for (const tabela of tabelas) {
            try {
                const resultado = await executeQuery(`SELECT COUNT(*) as total FROM ${tabela}`);
                console.log(`✅ Tabela ${tabela}: ${resultado[0].total} registros`);
            } catch (error) {
                console.log(`❌ Tabela ${tabela}: ${error.message}`);
            }
        }
        
        // Testar inserção de usuário teste
        try {
            const usuarioTeste = await executeQuery(`
                SELECT * FROM USUARIOS WHERE EMAIL_USUARIO = 'teste@petmania.com'
            `);
            
            if (usuarioTeste.length === 0) {
                console.log('📝 Criando imagem padrão...');
                // Primeiro criar uma imagem padrão
                await executeQuery(`
                    INSERT INTO IMAGENS (NOME_IMAGEM, IMAGEM_BLOB) 
                    VALUES ('default.png', NULL)
                `);
                
                console.log('📝 Criando usuário de teste...');
                await executeQuery(`
                    INSERT INTO USUARIOS 
                    (NOME_USUARIO, EMAIL_USUARIO, CELULAR_USUARIO, CPF_USUARIO, SENHA_USUARIO, TIPO_USUARIO, DATA_NASC_USUARIO, ID_PERFIL) 
                    VALUES ('Teste Cliente', 'teste@petmania.com', '11999999999', '12345678901', '$2a$08$hash', 'C', '1990-01-01', 1)
                `);
                console.log('✅ Usuário de teste criado');
            } else {
                console.log('✅ Usuário de teste já existe');
            }
        } catch (error) {
            console.log('❌ Erro ao criar usuário teste:', error.message);
        }
        
    } catch (error) {
        console.log('❌ Erro geral:', error.message);
    }
    
    process.exit(0);
}

testarBanco();