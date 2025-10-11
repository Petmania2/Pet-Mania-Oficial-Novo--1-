// app/models/usuarioModel.js
const { executeQuery } = require('../../config/pool_conexoes');
const bcrypt = require('bcryptjs');

class UsuarioModel {
  
  // Função auxiliar para limpar números (remove formatação)
  static limparNumeros(valor) {
    if (!valor) return '';
    // Remove todos os caracteres não numéricos
    return valor.replace(/\D/g, '');
  }
  
  // Criar novo usuário (adestrador ou cliente)
  static async criar(dadosUsuario) {
    try {
      const senhaHash = await bcrypt.hash(dadosUsuario.senha, 8);
      
      const query = `
        INSERT INTO USUARIOS 
        (NOME_USUARIO, EMAIL_USUARIO, CELULAR_USUARIO, CPF_USUARIO, SENHA_USUARIO, TIPO_USUARIO, DATA_NASC_USUARIO, ID_PERFIL) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NULL)
      `;
      
      const valores = [
        dadosUsuario.nome,
        dadosUsuario.email.toLowerCase().trim(),
        this.limparNumeros(dadosUsuario.celular) || '00000000000',
        this.limparNumeros(dadosUsuario.cpf),
        senhaHash,
        dadosUsuario.tipo, // 'A' = Adestrador, 'C' = Cliente
        dadosUsuario.dataNasc || new Date().toISOString().split('T')[0]
      ];
      
      const resultado = await executeQuery(query, valores);
      return resultado.insertId; // Retorna o ID do usuário criado
      
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }
  
  // Buscar usuário por email
  static async buscarPorEmail(email) {
    try {
      const query = `
        SELECT ID_USUARIO, NOME_USUARIO, EMAIL_USUARIO, SENHA_USUARIO, TIPO_USUARIO 
        FROM USUARIOS 
        WHERE EMAIL_USUARIO = ?
      `;
      const rows = await executeQuery(query, [email.toLowerCase().trim()]);
      return rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      return null;
    }
  }
  
  // Buscar usuário por ID
  static async buscarPorId(id) {
    try {
      const query = `
        SELECT ID_USUARIO, NOME_USUARIO, EMAIL_USUARIO, CELULAR_USUARIO, CPF_USUARIO, TIPO_USUARIO 
        FROM USUARIOS 
        WHERE ID_USUARIO = ?
      `;
      const rows = await executeQuery(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      return null;
    }
  }
  
  // Verificar senha
  static async verificarSenha(senhaTexto, senhaHash) {
    try {
      return await bcrypt.compare(senhaTexto, senhaHash);
    } catch (error) {
      console.error('Erro ao verificar senha:', error);
      return false;
    }
  }
  
  // Verificar se email existe
  static async emailExiste(email) {
    try {
      const query = 'SELECT ID_USUARIO FROM USUARIOS WHERE EMAIL_USUARIO = ?';
      const rows = await executeQuery(query, [email.toLowerCase().trim()]);
      return rows.length > 0;
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      return false;
    }
  }
  
  // Verificar se CPF existe
  static async cpfExiste(cpf) {
    try {
      const query = 'SELECT ID_USUARIO FROM USUARIOS WHERE CPF_USUARIO = ?';
      const cpfLimpo = this.limparNumeros(cpf);
      const rows = await executeQuery(query, [cpfLimpo]);
      return rows.length > 0;
    } catch (error) {
      console.error('Erro ao verificar CPF:', error);
      return false;
    }
  }
  
  // Atualizar senha
  static async atualizarSenha(idUsuario, novaSenha) {
    try {
      const senhaHash = await bcrypt.hash(novaSenha, 8);
      const query = 'UPDATE USUARIOS SET SENHA_USUARIO = ? WHERE ID_USUARIO = ?';
      await executeQuery(query, [senhaHash, idUsuario]);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      return false;
    }
  }
}

module.exports = UsuarioModel;