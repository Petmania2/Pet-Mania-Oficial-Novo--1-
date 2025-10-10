// app/models/usuarioModel.js - Versão corrigida
const { executeQuery } = require('../../config/pool_conexoes');
const bcrypt = require('bcryptjs');

class UsuarioModel {
  
  // Função auxiliar para limpar números (remove formatação)
  static limparNumeros(valor) {
    if (!valor) return '';
    return valor.replace(/\D/g, '');
  }
  
  // Validar CPF
  static validarCPF(cpf) {
    const cpfLimpo = this.limparNumeros(cpf);
    if (cpfLimpo.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;
    
    // Validação dos dígitos verificadores
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digito1 = resto < 2 ? 0 : resto;
    
    if (digito1 !== parseInt(cpfLimpo.charAt(9))) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = resto < 2 ? 0 : resto;
    
    return digito2 === parseInt(cpfLimpo.charAt(10));
  }
  
  // Validar email
  static validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  // Criar novo usuário (adestrador ou cliente)
  static async criar(dadosUsuario) {
    const connection = await executeQuery('START TRANSACTION');
    
    try {
      // Validações
      if (!this.validarEmail(dadosUsuario.email)) {
        throw new Error('Email inválido');
      }
      
      if (dadosUsuario.cpf && !this.validarCPF(dadosUsuario.cpf)) {
        throw new Error('CPF inválido');
      }
      
      if (!dadosUsuario.senha || dadosUsuario.senha.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres');
      }
      
      // Verificar duplicatas
      const emailExiste = await this.emailExiste(dadosUsuario.email);
      if (emailExiste) {
        throw new Error('Email já cadastrado');
      }
      
      if (dadosUsuario.cpf) {
        const cpfExiste = await this.cpfExiste(dadosUsuario.cpf);
        if (cpfExiste) {
          throw new Error('CPF já cadastrado');
        }
      }
      
      const senhaHash = await bcrypt.hash(dadosUsuario.senha, 12); // Aumentado para 12 rounds
      
      const query = `
        INSERT INTO USUARIOS 
        (NOME_USUARIO, EMAIL_USUARIO, CELULAR_USUARIO, CPF_USUARIO, SENHA_USUARIO, TIPO_USUARIO, DATA_NASC_USUARIO) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      const valores = [
        dadosUsuario.nome?.trim() || '',
        dadosUsuario.email.toLowerCase().trim(),
        this.limparNumeros(dadosUsuario.celular) || '00000000000',
        this.limparNumeros(dadosUsuario.cpf) || '00000000000',
        senhaHash,
        dadosUsuario.tipo, // 'A' = Adestrador, 'C' = Cliente
        dadosUsuario.dataNasc || new Date().toISOString().split('T')[0]
      ];
      
      const resultado = await executeQuery(query, valores);
      
      // Registrar tentativa de login bem-sucedida
      await this.registrarTentativaLogin(dadosUsuario.email, true, dadosUsuario.ip);
      
      await executeQuery('COMMIT');
      return resultado.insertId;
      
    } catch (error) {
      await executeQuery('ROLLBACK');
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }
  
  // Buscar usuário por email
  static async buscarPorEmail(email) {
    try {
      if (!this.validarEmail(email)) {
        return null;
      }
      
      const query = `
        SELECT ID_USUARIO, NOME_USUARIO, EMAIL_USUARIO, SENHA_USUARIO, TIPO_USUARIO, ATIVO
        FROM USUARIOS 
        WHERE EMAIL_USUARIO = ? AND ATIVO = TRUE
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
        WHERE ID_USUARIO = ? AND ATIVO = TRUE
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
      if (!senhaTexto || !senhaHash) return false;
      return await bcrypt.compare(senhaTexto, senhaHash);
    } catch (error) {
      console.error('Erro ao verificar senha:', error);
      return false;
    }
  }
  
  // Verificar se email existe
  static async emailExiste(email) {
    try {
      if (!this.validarEmail(email)) return false;
      
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
      if (!cpf) return false;
      
      const cpfLimpo = this.limparNumeros(cpf);
      if (!this.validarCPF(cpfLimpo)) return false;
      
      const query = 'SELECT ID_USUARIO FROM USUARIOS WHERE CPF_USUARIO = ?';
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
      if (!novaSenha || novaSenha.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres');
      }
      
      const senhaHash = await bcrypt.hash(novaSenha, 12);
      const query = 'UPDATE USUARIOS SET SENHA_USUARIO = ? WHERE ID_USUARIO = ?';
      await executeQuery(query, [senhaHash, idUsuario]);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      return false;
    }
  }
  
  // Registrar tentativa de login
  static async registrarTentativaLogin(email, sucesso, ip = null) {
    try {
      const query = `
        INSERT INTO tentativas_login (email_tentativa, ip_address, sucesso) 
        VALUES (?, ?, ?)
      `;
      await executeQuery(query, [email.toLowerCase().trim(), ip || 'unknown', sucesso]);
    } catch (error) {
      console.error('Erro ao registrar tentativa de login:', error);
    }
  }
  
  // Verificar tentativas de login recentes
  static async verificarTentativasRecentes(email, ip = null) {
    try {
      const query = `
        SELECT COUNT(*) as tentativas 
        FROM tentativas_login 
        WHERE email_tentativa = ? 
        AND sucesso = FALSE 
        AND data_tentativa > DATE_SUB(NOW(), INTERVAL 15 MINUTE)
        ${ip ? 'AND ip_address = ?' : ''}
      `;
      
      const params = ip ? [email.toLowerCase().trim(), ip] : [email.toLowerCase().trim()];
      const rows = await executeQuery(query, params);
      
      return rows[0]?.tentativas || 0;
    } catch (error) {
      console.error('Erro ao verificar tentativas recentes:', error);
      return 0;
    }
  }
  
  // Desativar usuário
  static async desativar(idUsuario) {
    try {
      const query = 'UPDATE USUARIOS SET ATIVO = FALSE WHERE ID_USUARIO = ?';
      await executeQuery(query, [idUsuario]);
      return true;
    } catch (error) {
      console.error('Erro ao desativar usuário:', error);
      return false;
    }
  }
}

module.exports = UsuarioModel;