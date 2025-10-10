// Script para corrigir estrutura do banco
const { executeQuery } = require('./config/pool_conexoes');

async function corrigirBanco() {
    try {
        console.log('🔧 Corrigindo estrutura do banco...');
        
        // Verificar se existe imagem padrão
        const imagens = await executeQuery('SELECT * FROM IMAGENS WHERE ID_IMAGEM = 1');
        
        if (imagens.length === 0) {
            console.log('📝 Criando imagem padrão...');
            await executeQuery(`
                INSERT INTO IMAGENS (ID_IMAGEM, NOME_IMAGEM, IMAGEM_BLOB) 
                VALUES (1, 'default.png', NULL)
            `);
            console.log('✅ Imagem padrão criada');
        } else {
            console.log('✅ Imagem padrão já existe');
        }
        
        console.log('🎉 Banco corrigido com sucesso!');
        
    } catch (error) {
        console.log('❌ Erro:', error.message);
    }
    
    process.exit(0);
}

corrigirBanco();