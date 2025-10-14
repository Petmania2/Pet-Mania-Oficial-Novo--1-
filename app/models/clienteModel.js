// app/models/clienteModel.js - Versão Corrigida
const { executeQuery } = require('../../config/pool_conexoes');
const UsuarioModel = require('./usuarioModel');

class ClienteModel {
  
  // Criar novo cliente (usa USUARIOS como base)
  static async criar(dadosCliente) {
    try {
      // Validações específicas do cliente
      if (!dadosCliente.nome || dadosCliente.nome.trim().length < 2) {
        throw new Error('Nome deve ter pelo menos 2 caracteres');
      }
      
      if (!dadosCliente.email || !UsuarioModel.validarEmail(dadosCliente.email)) {
        throw new Error('Email inválido');
      }
      
      if (!dadosCliente.senha || dadosCliente.senha.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres');
      }
      
      // 1. Verificar se email já existe
      const emailExiste = await UsuarioModel.emailExiste(dadosCliente.email);
      if (emailExiste) {
        throw new Error('Email já cadastrado');
      }
      
      // 2. Criar usuário primeiro
      const dadosUsuario = {
        nome: dadosCliente.nome.trim(),
        email: dadosCliente.email.toLowerCase().trim(),
        celular: dadosCliente.telefone || '00000000000',
        cpf: dadosCliente.cpf || '00000000000',
        senha: dadosCliente.senha,
        tipo: 'C', // C = Cliente
        dataNasc: dadosCliente.dataNasc || new Date().toISOString().split('T')[0]
      };
      
      const idUsuario = await UsuarioModel.criar(dadosUsuario);
      
      // 3. Criar registro de cliente com nomes CORRETOS
      const query = `
        INSERT INTO clientes 
        (ID_USUARIO, logradouro_cliente, num_resid_cliente, complemento_cliente, 
         bairro_cliente, cidade_cliente, uf_cliente, cep_cliente) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const valores = [
        idUsuario,
        dadosCliente.endereco?.trim() || dadosCliente.logradouro?.trim() || '',
        dadosCliente.numero?.trim() || 'S/N',
        dadosCliente.complemento?.trim() || '',
        dadosCliente.bairro?.trim() || '',
        dadosCliente.cidade?.trim() || '',
        dadosCliente.estado?.trim() || dadosCliente.uf?.trim() || 'SP',
        UsuarioModel.limparNumeros ? UsuarioModel.limparNumeros(dadosCliente.cep) : (dadosCliente.cep || '00000000')
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
      if (!email) {
        return null;
      }
      
      console.log('🔍 ClienteModel.buscarPorEmail - Email:', email);
      
      // Primeiro, buscar o usuário
      const queryUsuario = `
        SELECT ID_USUARIO as id, NOME_USUARIO as nome, EMAIL_USUARIO as email, 
               SENHA_USUARIO as senha, TIPO_USUARIO as tipo
        FROM USUARIOS 
        WHERE EMAIL_USUARIO = ? AND TIPO_USUARIO = 'C'
      `;
      
      const usuarios = await executeQuery(queryUsuario, [email.toLowerCase().trim()]);
      console.log('👤 Usuários encontrados:', usuarios.length);
      
      if (usuarios.length === 0) {
        console.log('❌ Nenhum usuário cliente encontrado com este email');
        return null;
      }
      
      const usuario = usuarios[0];
      console.log('✅ Usuário encontrado:', usuario.nome);
      
      // Verificar se existe registro na tabela clientes
      const queryCliente = `
        SELECT id_cliente 
        FROM clientes 
        WHERE ID_USUARIO = ?
      `;
      
      const clientes = await executeQuery(queryCliente, [usuario.id]);
      
      if (clientes.length === 0) {
        console.log('⚠️ Usuário existe mas não tem registro na tabela clientes');
        // Criar registro na tabela clientes se não existir
        const insertQuery = `
          INSERT INTO clientes (ID_USUARIO) 
          VALUES (?)
        `;
        await executeQuery(insertQuery, [usuario.id]);
        console.log('✅ Registro de cliente criado automaticamente');
      }
      
      return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha,
        id_cliente: clientes[0]?.id_cliente || null
      };
      
    } catch (error) {
      console.error('❌ Erro ao buscar cliente por email:', error);
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
      if (!id || isNaN(id)) {
        return null;
      }
      
      const query = `
        SELECT c.id_cliente as id, u.NOME_USUARIO as nome, u.EMAIL_USUARIO as email, 
               u.CELULAR_USUARIO as telefone, c.cidade_cliente as cidade, 
               c.logradouro_cliente as endereco, c.num_resid_cliente as numero,
               c.complemento_cliente as complemento, c.bairro_cliente as bairro,
               c.uf_cliente as estado, c.cep_cliente as cep, u.CPF_USUARIO as cpf
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
  
  // Buscar todos os clientes (com paginação)
  static async buscarTodos(limite = 50, offset = 0) {
    try {
      const query = `
        SELECT c.id_cliente as id, u.NOME_USUARIO as nome, u.EMAIL_USUARIO as email,
               c.cidade_cliente as cidade, c.uf_cliente as estado
        FROM clientes c
        INNER JOIN USUARIOS u ON c.ID_USUARIO = u.ID_USUARIO
        ORDER BY c.id_cliente DESC
        LIMIT ? OFFSET ?
      `;
      const rows = await executeQuery(query, [limite, offset]);
      return rows || [];
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return [];
    }
  }
}

module.exports = ClienteModel;