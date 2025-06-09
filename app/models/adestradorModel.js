const pool = require('../../config/pool_conexoes');
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
      
      const [resultado] = await pool.execute(query, valores);
      return resultado;
      
    } catch (error) {
      throw error;
    }
  }
  
  // Buscar adestrador por email para login
  static async buscarPorEmail(email) {
    try {
      const query = 'SELECT * FROM adestradores WHERE email = ?';
      const [rows] = await pool.execute(query, [email]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
  
  // Verificar senha
  static async verificarSenha(senhaTexto, senhaHash) {
    return await bcrypt.compare(senhaTexto, senhaHash);
  }
  
  // Verificar se email já existe
  static async emailExiste(email) {
    try {
      const query = 'SELECT id FROM adestradores WHERE email = ?';
      const [rows] = await pool.execute(query, [email]);
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  }
  
  // Verificar se CPF já existe
  static async cpfExiste(cpf) {
    try {
      const query = 'SELECT id FROM adestradores WHERE cpf = ?';
      const [rows] = await pool.execute(query, [cpf]);
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AdestradorModel;