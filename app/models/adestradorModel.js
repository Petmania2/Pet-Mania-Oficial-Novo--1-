const { executeQuery } = require('../../config/pool_conexoes');
const bcrypt = require('bcryptjs');

class AdestradorModel {
  // Criar novo adestrador - otimizado
  static async criar(dadosAdestrador) {
    try {
      const senhaHash = await bcrypt.hash(dadosAdestrador.senha, 8);
      
      const query = 'INSERT INTO adestradores (nome, cpf, email, telefone, cidade, estado, experiencia, preco, senha, ativo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)';
      
      const valores = [
        dadosAdestrador.nome,
        dadosAdestrador.cpf,
        dadosAdestrador.email,
        dadosAdestrador.telefone,
        dadosAdestrador.cidade,
        dadosAdestrador.estado,
        dadosAdestrador.experiencia,
        dadosAdestrador.preco,
        senhaHash
      ];
      
      console.log('Executando INSERT com valores:', valores);
      const resultado = await executeQuery(query, valores);
      console.log('Resultado do INSERT:', resultado);
      return resultado;
      
    } catch (error) {
      console.error('Erro ao criar adestrador:', error);
      throw error;
    }
  }
  
  // Buscar adestrador por email - otimizado
  static async buscarPorEmail(email) {
    try {
      const query = 'SELECT id, nome, email, senha FROM adestradores WHERE email = ?';
      console.log('Buscando adestrador com email:', email);
      const rows = await executeQuery(query, [email]);
      console.log('Resultado da busca:', rows.length > 0 ? 'Encontrado' : 'Não encontrado');
      return rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar adestrador por email:', error);
      return null;
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
  
  // Verificar email simples
  static async emailExiste(email) {
    try {
      const query = 'SELECT id FROM adestradores WHERE email = ?';
      const rows = await executeQuery(query, [email]);
      return rows.length > 0;
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      return false;
    }
  }
  
  static async cpfExiste(cpf) {
    try {
      const query = 'SELECT id FROM adestradores WHERE cpf = ?';
      const rows = await executeQuery(query, [cpf]);
      return rows.length > 0;
    } catch (error) {
      console.error('Erro ao verificar CPF:', error);
      return false;
    }
  }
  
  // Buscar todos - ultra simplificado
  static async buscarTodos() {
    try {
      const query = 'SELECT id, nome, cidade, estado, experiencia, preco FROM adestradores';
      const rows = await executeQuery(query);
      return rows || [];
    } catch (error) {
      console.error('Erro ao buscar adestradores:', error);
      return []; // Retornar array vazio em caso de erro
    }
  }
  
  // Buscar por ID - otimizado
 // Buscar por ID - CORRIGIDO para incluir CPF e todos os campos necessários
static async buscarPorId(id) {
  try {
    const query = 'SELECT id, nome, cpf, cidade, estado, experiencia, preco, email, telefone FROM adestradores WHERE id = ?';
    const rows = await executeQuery(query, [id]);
    return rows[0] || null;
  } catch (error) {
    console.error('Erro ao buscar adestrador por ID:', error);
    return null;
  }
}
  
}

module.exports = AdestradorModel;