// app/models/clienteModel.js
const { executeQuery } = require('../../config/pool_conexoes');
const UsuarioModel = require('./usuarioModel');

class ClienteModel {
  
  // Criar novo cliente (usa USUARIOS como base)
  static async criar(dadosCliente) {
    try {
      // 1. Verificar se email ou CPF já existe
      const emailExiste = await UsuarioModel.emailExiste(dadosCliente.email);
      if (emailExiste) {
        throw new Error('Email já cadastrado');
      }
      
      // 2. Criar usuário primeiro
      const dadosUsuario = {
        nome: dadosCliente.nome,
        email: dadosCliente.email,
        celular: dadosCliente.telefone || '00000000000',
        cpf: dadosCliente.cpf || '00000000000', // CPF pode ser opcional para clientes
        senha: dadosCliente.senha,
        tipo: 'C', // C = Cliente
        dataNasc: dadosCliente.dataNasc || new Date().toISOString().split('T')[0]
      };
      
      const idUsuario = await UsuarioModel.criar(dadosUsuario);
      
      // 3. Criar registro de cliente
      const query = `
        INSERT INTO clientes 
        (ID_USUARIO, logradouro_cliente, num_resid_cliente, complemento_cliente, 
         bairro_paciente, cidade_paciente, uf_paciente, cep_paciente) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const valores = [
        idUsuario,
        dadosCliente.endereco || '',
        dadosCliente.numero || 'S/N',
        dadosCliente.complemento || '',
        dadosCliente.bairro || '',
        dadosCliente.cidade || '',
        dadosCliente.estado || '',
        dadosCliente.cep || '00000000'
      ];
      
      const resultado = await executeQuery(query, valores);
      return { idUsuario, idCliente: resultado.insertId };
      
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }
  
  // Buscar cliente por email (busca através de USUARIOS)
  static async buscarPorEmail(email) {
    try {
      const query = `
        SELECT u.ID_USUARIO as id, u.NOME_USUARIO as nome, u.EMAIL_USUARIO as email, 
               u.SENHA_USUARIO as senha, c.id_cliente
        FROM USUARIOS u
        INNER JOIN clientes c ON u.ID_USUARIO = c.ID_USUARIO
        WHERE u.EMAIL_USUARIO = ? AND u.TIPO_USUARIO = 'C'
      `;
      const rows = await executeQuery(query, [email.toLowerCase().trim()]);
      return rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar cliente por email:', error);
      return null;
    }
  }
  
  // Verificar senha (usa o UsuarioModel)
  static async verificarSenha(senhaTexto, senhaHash) {
    return await UsuarioModel.verificarSenha(senhaTexto, senhaHash);
  }
  
  // Buscar cliente por ID
  static async buscarPorId(id) {
    try {
      const query = `
        SELECT c.id_cliente as id, u.NOME_USUARIO as nome, u.EMAIL_USUARIO as email, 
               u.CELULAR_USUARIO as telefone, c.cidade_paciente as cidade, 
               c.logradouro_cliente as endereco, c.num_resid_cliente as numero,
               c.complemento_cliente as complemento, c.bairro_paciente as bairro,
               c.uf_paciente as estado, c.cep_paciente as cep
        FROM clientes c
        INNER JOIN USUARIOS u ON c.ID_USUARIO = u.ID_USUARIO
        WHERE u.ID_USUARIO = ?
      `;
      const rows = await executeQuery(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar cliente por ID:', error);
      return null;
    }
  }
  
  // Buscar todos os clientes
  static async buscarTodos() {
    try {
      const query = `
        SELECT c.id_cliente as id, u.NOME_USUARIO as nome, u.EMAIL_USUARIO as email,
               c.cidade_paciente as cidade, c.uf_paciente as estado
        FROM clientes c
        INNER JOIN USUARIOS u ON c.ID_USUARIO = u.ID_USUARIO
      `;
      const rows = await executeQuery(query);
      return rows || [];
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return [];
    }
  }
}

module.exports = ClienteModel;