const bcrypt = require('bcrypt');
const { executeQuery } = require('../../config/pool_conexoes');

const ClienteModel = {
  async buscarPorEmail(email) {
    try {
      console.log('Buscando cliente com email:', email);
      const rows = await executeQuery('SELECT id, nome, email, senha FROM clientes WHERE email = ?', [email]);
      console.log('Resultado da busca cliente:', rows.length > 0 ? 'Encontrado' : 'Não encontrado');
      return rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar cliente por email:', error);
      return null;
    }
  },

  async buscarPorId(id) {
    try {
      const rows = await executeQuery(`
        SELECT id, nome, email, telefone, cidade, endereco, 
               nome_pet, raca_pet, idade_pet, tipo_cadastro, descricao 
        FROM clientes WHERE id = ?
      `, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar cliente por ID:', error);
      return null;
    }
  },

  async verificarSenha(senhaTexto, senhaHash) {
    try {
      return await bcrypt.compare(senhaTexto, senhaHash);
    } catch (error) {
      console.error('Erro ao verificar senha:', error);
      return false;
    }
  },

  async criarCliente(dadosCliente) {
    try {
      const {
        nome, email, telefone, cidade, endereco,
        nomePet, racaPet, idadePet, tipoCadastro,
        descricao, senha
      } = dadosCliente;

      const senhaHash = await bcrypt.hash(senha, 8);
      
      const result = await executeQuery(`
        INSERT INTO clientes (
          nome, email, telefone, cidade, endereco,
          nome_pet, raca_pet, idade_pet, tipo_cadastro,
          descricao, senha
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [nome, email, telefone, cidade, endereco, nomePet, racaPet, idadePet, tipoCadastro, descricao, senhaHash]);
      
      return result.insertId;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  },

  async atualizarCliente(id, dadosAtualizados) {
    try {
      const { nome, email } = dadosAtualizados;
      const result = await executeQuery(
        'UPDATE clientes SET nome = ?, email = ? WHERE id = ?',
        [nome, email, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      return false;
    }
  }
};

module.exports = ClienteModel;