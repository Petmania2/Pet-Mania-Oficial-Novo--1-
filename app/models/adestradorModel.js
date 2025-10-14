// app/models/adestradorModel.js
const { executeQuery } = require('../../config/pool_conexoes');
const UsuarioModel = require('./usuarioModel');

class AdestradorModel {
  
  // Criar novo adestrador (usa USUARIOS como base)
  static async criar(dadosAdestrador) {
    try {
      // 1. Verificar se email ou CPF já existe
      const emailExiste = await UsuarioModel.emailExiste(dadosAdestrador.email);
      if (emailExiste) {
        throw new Error('Email já cadastrado');
      }
      
      const cpfExiste = await UsuarioModel.cpfExiste(dadosAdestrador.cpf);
      if (cpfExiste) {
        throw new Error('CPF já cadastrado');
      }
      
      // 2. Criar usuário primeiro
      const dadosUsuario = {
        nome: dadosAdestrador.nome,
        email: dadosAdestrador.email,
        celular: dadosAdestrador.telefone || '00000000000',
        cpf: dadosAdestrador.cpf,
        senha: dadosAdestrador.senha,
        tipo: 'A', // A = Adestrador
        dataNasc: dadosAdestrador.dataNasc || new Date().toISOString().split('T')[0]
      };
      
      const idUsuario = await UsuarioModel.criar(dadosUsuario);
      
      // 3. Criar registro de adestrador
      const query = `
        INSERT INTO adestradores 
        (ID_USUARIO, logradouro_adestrador, num_resid_adestrador, complemento_adestrador, 
         bairro_adestrador, cidade_adestrador, uf_adestrador, cep_ADESTRADOR, 
         anos_experiencia, id_esp_adestrador, valor_sessao, sobre_sua_experiencia, 
         data_cadastro, ativo) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 1)
      `;
      
      const valores = [
        idUsuario,
        dadosAdestrador.logradouro || '',
        dadosAdestrador.numero || 'S/N',
        dadosAdestrador.complemento || '',
        dadosAdestrador.bairro || '',
        dadosAdestrador.cidade || '',
        dadosAdestrador.estado || '',
        dadosAdestrador.cep || '00000000',
        dadosAdestrador.experiencia || 0,
        dadosAdestrador.especialidade || 1, // ID da especialidade (usar 1 como padrão)
        dadosAdestrador.preco,
        dadosAdestrador.sobre || ''
      ];
      
      const resultado = await executeQuery(query, valores);
      return { idUsuario, idAdestrador: resultado.insertId };
      
    } catch (error) {
      console.error('Erro ao criar adestrador:', error);
      throw error;
    }
  }
  
  // Buscar adestrador por email (busca através de USUARIOS)
  static async buscarPorEmail(email) {
    try {
      console.log('🔍 AdestradorModel.buscarPorEmail - Email:', email);
      
      // Primeiro, buscar o usuário
      const queryUsuario = `
        SELECT ID_USUARIO as id, NOME_USUARIO as nome, EMAIL_USUARIO as email, 
               SENHA_USUARIO as senha, TIPO_USUARIO as tipo
        FROM USUARIOS 
        WHERE EMAIL_USUARIO = ? AND TIPO_USUARIO = 'A'
      `;
      
      const usuarios = await executeQuery(queryUsuario, [email.toLowerCase().trim()]);
      console.log('👤 Usuários encontrados:', usuarios.length);
      
      if (usuarios.length === 0) {
        console.log('❌ Nenhum usuário adestrador encontrado com este email');
        return null;
      }
      
      const usuario = usuarios[0];
      console.log('✅ Usuário encontrado:', usuario.nome);
      
      // Verificar se existe registro na tabela adestradores
      const queryAdestrador = `
        SELECT id_adestrador 
        FROM adestradores 
        WHERE ID_USUARIO = ?
      `;
      
      const adestradores = await executeQuery(queryAdestrador, [usuario.id]);
      
      if (adestradores.length === 0) {
        console.log('⚠️ Usuário existe mas não tem registro na tabela adestradores');
        // Criar registro na tabela adestradores se não existir
        const insertQuery = `
          INSERT INTO adestradores (ID_USUARIO, valor_sessao, ativo) 
          VALUES (?, 100.00, 1)
        `;
        await executeQuery(insertQuery, [usuario.id]);
        console.log('✅ Registro de adestrador criado automaticamente');
      }
      
      return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha,
        id_adestrador: adestradores[0]?.id_adestrador || null
      };
      
    } catch (error) {
      console.error('❌ Erro ao buscar adestrador por email:', error);
      return null;
    }
  }
  
  // Verificar senha (usa o UsuarioModel)
  static async verificarSenha(senhaTexto, senhaHash) {
    return await UsuarioModel.verificarSenha(senhaTexto, senhaHash);
  }
  
  // Verificar email
  static async emailExiste(email) {
    return await UsuarioModel.emailExiste(email);
  }
  
  // Verificar CPF
  static async cpfExiste(cpf) {
    return await UsuarioModel.cpfExiste(cpf);
  }
  
  // Buscar todos os adestradores
  static async buscarTodos() {
    try {
      const query = `
        SELECT a.id_adestrador as id, u.NOME_USUARIO as nome, 
               a.cidade_adestrador as cidade, a.uf_adestrador as estado, 
               a.anos_experiencia as experiencia, a.valor_sessao as preco
        FROM adestradores a
        INNER JOIN USUARIOS u ON a.ID_USUARIO = u.ID_USUARIO
        WHERE a.ativo = 1
      `;
      const rows = await executeQuery(query);
      return rows || [];
    } catch (error) {
      console.error('Erro ao buscar adestradores:', error);
      return [];
    }
  }
  
  // Buscar por ID
  static async buscarPorId(id) {
    try {
      const query = `
        SELECT a.id_adestrador as id, u.NOME_USUARIO as nome, u.CPF_USUARIO as cpf,
               u.EMAIL_USUARIO as email, u.CELULAR_USUARIO as telefone,
               a.cidade_adestrador as cidade, a.uf_adestrador as estado, 
               a.anos_experiencia as experiencia, a.valor_sessao as preco,
               a.logradouro_adestrador as logradouro, a.num_resid_adestrador as numero,
               a.complemento_adestrador as complemento, a.bairro_adestrador as bairro,
               a.cep_ADESTRADOR as cep, a.sobre_sua_experiencia as sobre
        FROM adestradores a
        INNER JOIN USUARIOS u ON a.ID_USUARIO = u.ID_USUARIO
        WHERE u.ID_USUARIO = ?
      `;
      const rows = await executeQuery(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar adestrador por ID:', error);
      return null;
    }
  }
}

module.exports = AdestradorModel;