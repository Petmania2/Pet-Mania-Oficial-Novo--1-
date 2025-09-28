const ClienteModel = require('../models/clienteModel');
const AdestradorModel = require('../models/adestradorModel');

const authController = {
  // Exibir página de login
  exibirLogin: (req, res) => {
    res.render('pages/Login');
  },

  // Processar login
  login: async (req, res) => {
    try {
      const { email, password, tipo } = req.body;

      if (!email || !password || !tipo) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Preencha todos os campos!'
        });
      }

      let usuario = null;
      let senhaValida = false;

      // Buscar usuário conforme o tipo selecionado
      if (tipo === 'cliente') {
        usuario = await ClienteModel.buscarPorEmail(email);
        if (usuario) {
          senhaValida = await ClienteModel.verificarSenha(password, usuario.senha);
        }
      } else if (tipo === 'adestrador') {
        usuario = await AdestradorModel.buscarPorEmail(email);
        if (usuario) {
          senhaValida = await AdestradorModel.verificarSenha(password, usuario.senha);
        }
      }

      // Verificar se usuário existe e senha está correta
      if (!usuario) {
        return res.status(401).json({
          sucesso: false,
          mensagem: `Não encontramos uma conta de ${tipo} com este email!`
        });
      }

      if (!senhaValida) {
        return res.status(401).json({
          sucesso: false,
          mensagem: 'Senha incorreta!'
        });
      }

      // Criar sessão
      req.session.usuario = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: tipo
      };

      // Redirecionar conforme o tipo de usuário
      const redirectUrl = tipo === 'cliente' ? '/perfil-cliente' : '/perfil-adestrador';

      res.json({
        sucesso: true,
        mensagem: 'Login realizado com sucesso!',
        redirect: redirectUrl
      });

    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor'
      });
    }
  },

  // Logout
  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Erro ao fazer logout:', err);
        return res.redirect('/');
      }
      res.redirect('/login');
    });
  }
};

module.exports = authController;