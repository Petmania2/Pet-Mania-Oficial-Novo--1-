const { executeQuery } = require('../../config/pool_conexoes');
const bcrypt = require('bcryptjs');

class AdestradorModel {
  // Criar novo adestrador - otimizado
  static async criar(dadosAdestrador) {
    let senhaHash;
    
    try {
      // Hash da senha com menos rounds para ser mais rápido
      const saltRounds = 8; // Reduzido de 10 para 8
      senhaHash = await bcrypt.hash(dadosAdestrador.senha, saltRounds);
    } catch (error) {
      console.error('Erro ao gerar hash da senha:', error);
      throw new Error('Erro ao processar senha');
    }
    
    try {
      // Converter especialidades para JSON
      const especialidadesJson = JSON.stringify(dadosAdestrador.especialidades);
      
      // Query otimizada com prepared statement
      const query = `
        INSERT INTO adestradores 
        (nome, cpf, email, telefone, cidade, estado, experiencia, especialidades, preco, sobre, senha)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const valores = [
        dadosAdestrador.nome,
        dadosAdestrador.cpf,
        dadosAdestrador.email,
        dadosAdestrador.telefone,
        dadosAdestrador.cidade,
        dadosAdestrador.estado,
        dadosAdestrador.experiencia,
        especialidadesJson,
        dadosAdestrador.preco,
        dadosAdestrador.sobre,
        senhaHash
      ];
      
      const resultado = await executeQuery(query, valores);
      return resultado;
      
    } catch (error) {
      console.error('Erro ao criar adestrador:', error);
      
      // Tratar erros específicos do MySQL
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('email')) {
          throw new Error('Este email já está cadastrado');
        } else if (error.message.includes('cpf')) {
          throw new Error('Este CPF já está cadastrado');
        }
        throw new Error('Dados duplicados encontrados');
      }
      
      throw error;
    }
  }
  
  // Buscar adestrador por email - otimizado
  static async buscarPorEmail(email) {
    try {
      // Query mais específica, buscando apenas os campos necessários para login
      const query = 'SELECT id, nome, email, senha FROM adestradores WHERE email = ? AND ativo = TRUE LIMIT 1';
      const rows = await executeQuery(query, [email]);
      return rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar adestrador por email:', error);
      throw error;
    }
  }
  
  // Verificar senha - otimizado
  static async verificarSenha(senhaTexto, senhaHash) {
    try {
      return await bcrypt.compare(senhaTexto, senhaHash);
    } catch (error) {
      console.error('Erro ao verificar senha:', error);
      return false; // Retornar false em caso de erro
    }
  }
  
  // Método combinado para verificar email E CPF de uma vez
  static async verificarDuplicados(email, cpf) {
    try {
      const query = `
        SELECT 
          SUM(CASE WHEN email = ? THEN 1 ELSE 0 END) as email_existe,
          SUM(CASE WHEN cpf = ? THEN 1 ELSE 0 END) as cpf_existe
        FROM adestradores 
        WHERE email = ? OR cpf = ?
      `;
      const rows = await executeQuery(query, [email, cpf, email, cpf]);
      
      if (rows[0]) {
        return {
          emailExiste: rows[0].email_existe > 0,
          cpfExiste: rows[0].cpf_existe > 0
        };
      }
      
      return { emailExiste: false, cpfExiste: false };
    } catch (error) {
      console.error('Erro ao verificar duplicados:', error);
      throw error;
    }
  }
  
  // Métodos individuais mantidos para compatibilidade
  static async emailExiste(email) {
    try {
      const duplicados = await this.verificarDuplicados(email, '');
      return duplicados.emailExiste;
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      throw error;
    }
  }
  
  static async cpfExiste(cpf) {
    try {
      const duplicados = await this.verificarDuplicados('', cpf);
      return duplicados.cpfExiste;
    } catch (error) {
      console.error('Erro ao verificar CPF:', error);
      throw error;
    }
  }
  
  // Buscar todos - simplificado
  static async buscarTodos() {
    try {
      const query = `
        SELECT id, nome, cidade, estado, experiencia, especialidades, preco, sobre 
        FROM adestradores 
        WHERE ativo = TRUE
        ORDER BY nome
      `;
      const rows = await executeQuery(query);
      
      // Converter especialidades de JSON para array
      return rows.map(adestrador => {
        try {
          adestrador.especialidades = JSON.parse(adestrador.especialidades);
        } catch (e) {
          adestrador.especialidades = [];
        }
        return adestrador;
      });
    } catch (error) {
      console.error('Erro ao buscar adestradores:', error);
      throw error;
    }
  }
  
  // Buscar por ID - otimizado
 // Buscar por ID - CORRIGIDO para incluir CPF e todos os campos necessários
static async buscarPorId(id) {
  try {
    const query = `
      SELECT id, nome, cpf, cidade, estado, experiencia, especialidades, preco, sobre, email, telefone
      FROM adestradores 
      WHERE id = ? AND ativo = TRUE
      LIMIT 1
    `;
    const rows = await executeQuery(query, [id]);
    
    if (rows.length > 0) {
      const adestrador = rows[0];
      try {
        // Garantir que especialidades seja sempre um array
        if (typeof adestrador.especialidades === 'string') {
          adestrador.especialidades = JSON.parse(adestrador.especialidades);
        } else if (!Array.isArray(adestrador.especialidades)) {
          adestrador.especialidades = [];
        }
      } catch (e) {
        console.error('Erro ao parsear especialidades:', e);
        adestrador.especialidades = [];
      }
      return adestrador;
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar adestrador por ID:', error);
    throw error;
  }
}
  
  // Método para limpar cache/conexões (chamado periodicamente)
  static async limpeza() {
    try {
      // Query simples para manter conexão ativa
      await executeQuery('SELECT 1');
      console.log('🔄 Limpeza do modelo concluída');
    } catch (error) {
      console.log('Erro na limpeza do modelo:', error.message);
    }
  }
}

// Configurar limpeza periódica do modelo
setInterval(() => {
  AdestradorModel.limpeza();
}, 5 * 60 * 1000); // A cada 5 minutos

module.exports = AdestradorModel;