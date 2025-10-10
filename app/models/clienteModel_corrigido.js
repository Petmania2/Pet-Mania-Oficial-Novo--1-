// app/models/clienteModel.js - Versão corrigida
const { executeQuery } = require('../../config/pool_conexoes');
const UsuarioModel = require('./usuarioModel');

class ClienteModel {
  
  // Criar novo cliente (usa USUARIOS como base)
  static async criar(dadosCliente) {
    const connection = await executeQuery('START TRANSACTION');
    
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
        dataNasc: dadosCliente.dataNasc || new Date().toISOString().split('T')[0],
        ip: dadosCliente.ip
      };
      
      const idUsuario = await UsuarioModel.criar(dadosUsuario);
      
      // 3. Criar registro de cliente com nomenclatura corrigida
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
        dadosCliente.estado?.trim() || dadosCliente.uf?.trim() || '',
        UsuarioModel.limparNumeros(dadosCliente.cep) || '00000000'
      ];
      
      const resultado = await executeQuery(query, valores);
      
      await executeQuery('COMMIT');
      return { idUsuario, idCliente: resultado.insertId };
      
    } catch (error) {
      await executeQuery('ROLLBACK');
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }
  
  // Buscar cliente por email (busca através de USUARIOS)
  static async buscarPorEmail(email) {
    try {
      if (!UsuarioModel.validarEmail(email)) {
        return null;
      }
      
      const query = `
        SELECT u.ID_USUARIO as id, u.NOME_USUARIO as nome, u.EMAIL_USUARIO as email, 
               u.SENHA_USUARIO as senha, c.id_cliente, u.ATIVO as ativo
        FROM USUARIOS u
        INNER JOIN clientes c ON u.ID_USUARIO = c.ID_USUARIO
        WHERE u.EMAIL_USUARIO = ? AND u.TIPO_USUARIO = 'C' AND u.ATIVO = TRUE
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
      if (!id || isNaN(id)) {
        return null;
      }
      
      const query = `
        SELECT c.id_cliente as id, u.NOME_USUARIO as nome, u.EMAIL_USUARIO as email, 
               u.CELULAR_USUARIO as telefone, c.cidade_cliente as cidade, 
               c.logradouro_cliente as endereco, c.num_resid_cliente as numero,
               c.complemento_cliente as complemento, c.bairro_cliente as bairro,
               c.uf_cliente as estado, c.cep_cliente as cep, u.CPF_USUARIO as cpf,
               c.data_cadastro
        FROM clientes c
        INNER JOIN USUARIOS u ON c.ID_USUARIO = u.ID_USUARIO
        WHERE u.ID_USUARIO = ? AND u.ATIVO = TRUE
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
               c.cidade_cliente as cidade, c.uf_cliente as estado, c.data_cadastro
        FROM clientes c
        INNER JOIN USUARIOS u ON c.ID_USUARIO = u.ID_USUARIO
        WHERE u.ATIVO = TRUE
        ORDER BY c.data_cadastro DESC
        LIMIT ? OFFSET ?
      `;
      const rows = await executeQuery(query, [limite, offset]);
      return rows || [];
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return [];
    }
  }
  
  // Atualizar dados do cliente
  static async atualizar(idUsuario, dadosCliente) {
    const connection = await executeQuery('START TRANSACTION');
    
    try {
      // Atualizar dados do usuário
      if (dadosCliente.nome || dadosCliente.celular) {
        const queryUsuario = `
          UPDATE USUARIOS 
          SET NOME_USUARIO = COALESCE(?, NOME_USUARIO),
              CELULAR_USUARIO = COALESCE(?, CELULAR_USUARIO)
          WHERE ID_USUARIO = ?
        `;
        await executeQuery(queryUsuario, [
          dadosCliente.nome?.trim(),
          UsuarioModel.limparNumeros(dadosCliente.celular),
          idUsuario
        ]);
      }
      
      // Atualizar dados específicos do cliente
      const queryCliente = `
        UPDATE clientes 
        SET logradouro_cliente = COALESCE(?, logradouro_cliente),
            num_resid_cliente = COALESCE(?, num_resid_cliente),
            complemento_cliente = COALESCE(?, complemento_cliente),
            bairro_cliente = COALESCE(?, bairro_cliente),
            cidade_cliente = COALESCE(?, cidade_cliente),
            uf_cliente = COALESCE(?, uf_cliente),
            cep_cliente = COALESCE(?, cep_cliente)
        WHERE ID_USUARIO = ?
      `;
      
      await executeQuery(queryCliente, [
        dadosCliente.endereco?.trim(),
        dadosCliente.numero?.trim(),
        dadosCliente.complemento?.trim(),
        dadosCliente.bairro?.trim(),
        dadosCliente.cidade?.trim(),
        dadosCliente.estado?.trim(),
        UsuarioModel.limparNumeros(dadosCliente.cep),
        idUsuario
      ]);
      
      await executeQuery('COMMIT');
      return true;
    } catch (error) {
      await executeQuery('ROLLBACK');
      console.error('Erro ao atualizar cliente:', error);
      return false;
    }
  }
  
  // Buscar clientes por cidade
  static async buscarPorCidade(cidade, limite = 20) {
    try {
      const query = `
        SELECT c.id_cliente as id, u.NOME_USUARIO as nome, u.EMAIL_USUARIO as email,
               c.cidade_cliente as cidade, c.uf_cliente as estado
        FROM clientes c
        INNER JOIN USUARIOS u ON c.ID_USUARIO = u.ID_USUARIO
        WHERE c.cidade_cliente LIKE ? AND u.ATIVO = TRUE
        ORDER BY u.NOME_USUARIO
        LIMIT ?
      `;
      const rows = await executeQuery(query, [`%${cidade}%`, limite]);
      return rows || [];
    } catch (error) {
      console.error('Erro ao buscar clientes por cidade:', error);
      return [];
    }
  }
  
  // Contar total de clientes
  static async contarTotal() {
    try {
      const query = `
        SELECT COUNT(*) as total 
        FROM clientes c
        INNER JOIN USUARIOS u ON c.ID_USUARIO = u.ID_USUARIO
        WHERE u.ATIVO = TRUE
      `;
      const rows = await executeQuery(query);
      return rows[0]?.total || 0;
    } catch (error) {
      console.error('Erro ao contar clientes:', error);
      return 0;
    }
  }
  
  // Desativar cliente
  static async desativar(idUsuario) {
    try {
      return await UsuarioModel.desativar(idUsuario);
    } catch (error) {
      console.error('Erro ao desativar cliente:', error);
      return false;
    }
  }
}

module.exports = ClienteModel;