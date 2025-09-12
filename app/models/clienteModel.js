const bcrypt = require('bcrypt');
const pool = require('../../config/pool_conexoes');

const ClienteModel = {
  async buscarPorEmail(email) {
    const [rows] = await pool.query('SELECT id, nome, email, senha FROM clientes WHERE email = ? LIMIT 1', [email]);
    return rows[0] || null;
  },
  async verificarSenha(senhaTexto, senhaHash) {
    return await bcrypt.compare(senhaTexto, senhaHash);
  }
};

module.exports = ClienteModel;
