const { pool, executeQuery } = require('../../config/pool_conexoes');
const bcrypt = require('bcryptjs');

class AdestradorModel {
  // Criar novo adestrador
  static async criar(dadosAdestrador) {
    try {
      // Hash da senha
      const saltRounds = 10;
      const senhaHash = await bcrypt.hash(dadosAdestrador.senha, saltRounds);
      
      // Converter especialidades para JSON
      const especialidadesJson = JSON.stringify(dadosAdestrador.especialidades);
      
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
      
      // Usar a função executeQuery com retry
      const resultado = await executeQuery(query, valores);
      return resultado;
      
    } catch (error) {
      console.error('Erro ao criar adestrador:', error);
      throw error;
    }
  }
  
  // Buscar adestrador por email para login
  static async buscarPorEmail(email) {
    try {
      const query = 'SELECT * FROM adestradores WHERE email = ?';
      const rows = await executeQuery(query, [email]);
      return rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar adestrador por email:', error);
      throw error;
    }
  }
  
  // Verificar senha
  static async verificarSenha(senhaTexto, senhaHash) {
    try {
      return await bcrypt.compare(senhaTexto, senhaHash);
    } catch (error) {
      console.error('Erro ao verificar senha:', error);
      throw error;
    }
  }
  
  // Verificar se email já existe
  static async emailExiste(email) {
    try {
      const query = 'SELECT id FROM adestradores WHERE email = ?';
      const rows = await executeQuery(query, [email]);
      return rows.length > 0;
    } catch (error) {
      console.error('Erro ao verificar se email existe:', error);
      throw error;
    }
  }
  
  // Verificar se CPF já existe
  static async cpfExiste(cpf) {
    try {
      const query = 'SELECT id FROM adestradores WHERE cpf = ?';
      const rows = await executeQuery(query, [cpf]);
      return rows.length > 0;
    } catch (error) {
      console.error('Erro ao verificar se CPF existe:', error);
      throw error;
    }
  }
  
  // Buscar todos os adestradores (para listagem)
  static async buscarTodos() {
    try {
      const query = `
        SELECT id, nome, cidade, estado, experiencia, especialidades, preco, sobre 
        FROM adestradores 
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
      console.error('Erro ao buscar todos os adestradores:', error);
      throw error;
    }
  }
  
  // Buscar adestrador por ID
  static async buscarPorId(id) {
    try {
      const query = `
        SELECT id, nome, cidade, estado, experiencia, especialidades, preco, sobre, email, telefone
        FROM adestradores 
        WHERE id = ?
      `;
      const rows = await executeQuery(query, [id]);
      
      if (rows.length > 0) {
        const adestrador = rows[0];
        try {
          adestrador.especialidades = JSON.parse(adestrador.especialidades);
        } catch (e) {
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
}

module.exports = AdestradorModel;