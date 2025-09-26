const bcrypt = require('bcrypt');
const { executeQuery } = require('../../config/pool_conexoes');

const ClienteModel = {
  async buscarPorEmail(email) {
    console.log('Buscando cliente com email:', email);
    const rows = await executeQuery('SELECT id, nome, email, senha FROM clientes WHERE email = ?', [email]);
    console.log('Resultado da busca cliente:', rows.length > 0 ? 'Encontrado' : 'Não encontrado');
    return rows[0] || null;
  },
  async verificarSenha(senhaTexto, senhaHash) {
    return await bcrypt.compare(senhaTexto, senhaHash);
  },
  async criarCliente({ nome, email, senha }) {
    const senhaHash = await bcrypt.hash(senha, 8);
    const result = await executeQuery('INSERT INTO clientes (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senhaHash]);
    return result.insertId;
  }
};

module.exports = ClienteModel;
