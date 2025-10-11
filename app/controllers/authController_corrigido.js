// app/controllers/authController.js - Versão corrigida
const ClienteModel = require('../models/clienteModel');
const AdestradorModel = require('../models/adestradorModel');
const UsuarioModel = require('../models/usuarioModel');
const rateLimit = require('express-rate-limit');

// Rate limiting para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas por IP
  message: {
    sucesso: false,
    mensagem: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authController = {
  // Middleware de rate limiting
  loginLimiter,

  // Exibir página de login
  exibirLogin: (req, res) => {
    try {
      // Se já estiver logado, redirecionar
      if (req.session.usuario) {
        const redirectUrl = req.session.usuario.tipo === 'cliente' 
          ? '/painelcliente.ejs' 
          : '/paineladestrador.ejs';
        return res.redirect(redirectUrl);
      }
      
      res.render('pages/Login', {
        erro: null,
        email: '',
        tipo: 'cliente'
      });
    } catch (error) {
      console.error('Erro ao exibir login:', error);
      res.status(500).render('pages/error', { 
        mensagem: 'Erro interno do servidor' 
      });
    }
  },

  // Processar login
  login: async (req, res) => {
    try {
      const { email, password, tipo } = req.body;
      const clientIP = req.ip || req.connection.remoteAddress;

      // Validações básicas
      if (!email || !password || !tipo) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Preencha todos os campos obrigatórios!'
        });
      }

      // Validar formato do email
      if (!UsuarioModel.validarEmail(email)) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Formato de email inválido!'
        });
      }

      // Validar tipo de usuário
      if (!['cliente', 'adestrador'].includes(tipo)) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Tipo de usuário inválido!'
        });
      }

      // Verificar tentativas recentes de login
      const tentativasRecentes = await UsuarioModel.verificarTentativasRecentes(email, clientIP);
      if (tentativasRecentes >= 5) {
        return res.status(429).json({
          sucesso: false,
          mensagem: 'Muitas tentativas de login. Aguarde 15 minutos antes de tentar novamente.'
        });
      }

      let usuario = null;
      let senhaValida = false;

      // Buscar usuário conforme o tipo selecionado
      try {
        if (tipo === 'cliente') {
          usuario = await ClienteModel.buscarPorEmail(email);
          if (usuario && usuario.ativo !== false) {
            senhaValida = await ClienteModel.verificarSenha(password, usuario.senha);
          }
        } else if (tipo === 'adestrador') {
          usuario = await AdestradorModel.buscarPorEmail(email);
          if (usuario && usuario.ativo !== false) {
            senhaValida = await AdestradorModel.verificarSenha(password, usuario.senha);
          }
        }
      } catch (modelError) {
        console.error('Erro ao buscar usuário:', modelError);
        // Registrar tentativa falhada
        await UsuarioModel.registrarTentativaLogin(email, false, clientIP);
        
        return res.status(500).json({
          sucesso: false,
          mensagem: 'Erro interno do servidor. Tente novamente mais tarde.'
        });
      }

      // Verificar se usuário existe e está ativo
      if (!usuario) {
        await UsuarioModel.registrarTentativaLogin(email, false, clientIP);
        return res.status(401).json({
          sucesso: false,
          mensagem: `Não encontramos uma conta de ${tipo} com este email!`
        });
      }

      // Verificar se a conta está ativa
      if (usuario.ativo === false) {
        await UsuarioModel.registrarTentativaLogin(email, false, clientIP);
        return res.status(401).json({
          sucesso: false,
          mensagem: 'Conta desativada. Entre em contato com o suporte.'
        });
      }

      // Verificar senha
      if (!senhaValida) {
        await UsuarioModel.registrarTentativaLogin(email, false, clientIP);
        return res.status(401).json({
          sucesso: false,
          mensagem: 'Senha incorreta!'
        });
      }

      // Login bem-sucedido - registrar tentativa
      await UsuarioModel.registrarTentativaLogin(email, true, clientIP);

      // Criar sessão segura
      req.session.usuario = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: tipo,
        loginTime: new Date().toISOString(),
        ip: clientIP
      };

      // Regenerar ID da sessão para segurança
      req.session.regenerate((err) => {
        if (err) {
          console.error('Erro ao regenerar sessão:', err);
        }
        
        // Redirecionar conforme o tipo de usuário
        const redirectUrl = tipo === 'cliente' ? '/painelcliente.ejs' : '/paineladestrador.ejs';

        res.json({
          sucesso: true,
          mensagem: 'Login realizado com sucesso!',
          redirecionarPara: redirectUrl,
          usuario: {
            nome: usuario.nome,
            tipo: tipo
          }
        });
      });

    } catch (error) {
      console.error('Erro no login:', error);
      
      // Registrar tentativa falhada em caso de erro
      if (req.body.email) {
        await UsuarioModel.registrarTentativaLogin(
          req.body.email, 
          false, 
          req.ip || req.connection.remoteAddress
        );
      }
      
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor. Tente novamente mais tarde.'
      });
    }
  },

  // Verificar se usuário está autenticado
  verificarAutenticacao: (req, res, next) => {
    try {
      if (!req.session.usuario) {
        return res.status(401).json({
          sucesso: false,
          mensagem: 'Acesso negado. Faça login primeiro.',
          redirecionarPara: '/Login.ejs'
        });
      }

      // Verificar se a sessão não expirou (24 horas)
      const loginTime = new Date(req.session.usuario.loginTime);
      const agora = new Date();
      const diferencaHoras = (agora - loginTime) / (1000 * 60 * 60);

      if (diferencaHoras > 24) {
        req.session.destroy();
        return res.status(401).json({
          sucesso: false,
          mensagem: 'Sessão expirada. Faça login novamente.',
          redirecionarPara: '/Login.ejs'
        });
      }

      next();
    } catch (error) {
      console.error('Erro na verificação de autenticação:', error);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor'
      });
    }
  },

  // Verificar tipo de usuário
  verificarTipoUsuario: (tipoRequerido) => {
    return (req, res, next) => {
      try {
        if (!req.session.usuario) {
          return res.status(401).json({
            sucesso: false,
            mensagem: 'Acesso negado. Faça login primeiro.'
          });
        }

        if (req.session.usuario.tipo !== tipoRequerido) {
          return res.status(403).json({
            sucesso: false,
            mensagem: 'Acesso negado. Tipo de usuário incorreto.'
          });
        }

        next();
      } catch (error) {
        console.error('Erro na verificação de tipo de usuário:', error);
        res.status(500).json({
          sucesso: false,
          mensagem: 'Erro interno do servidor'
        });
      }
    };
  },

  // Logout
  logout: (req, res) => {
    try {
      const usuario = req.session.usuario;
      
      req.session.destroy((err) => {
        if (err) {
          console.error('Erro ao fazer logout:', err);
          return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao fazer logout'
          });
        }

        // Limpar cookie de sessão
        res.clearCookie('connect.sid');
        
        // Se for requisição AJAX
        if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
          return res.json({
            sucesso: true,
            mensagem: 'Logout realizado com sucesso!',
            redirecionarPara: '/Login.ejs'
          });
        }
        
        // Se for requisição normal
        res.redirect('/Login.ejs');
      });
    } catch (error) {
      console.error('Erro no logout:', error);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor'
      });
    }
  },

  // Verificar status da sessão
  verificarSessao: (req, res) => {
    try {
      if (req.session.usuario) {
        res.json({
          logado: true,
          usuario: {
            id: req.session.usuario.id,
            nome: req.session.usuario.nome,
            email: req.session.usuario.email,
            tipo: req.session.usuario.tipo
          }
        });
      } else {
        res.json({
          logado: false,
          usuario: null
        });
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor'
      });
    }
  }
};

module.exports = authController;