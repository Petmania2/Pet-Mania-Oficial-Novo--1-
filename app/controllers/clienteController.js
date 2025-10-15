const ClienteModel = require('../models/clienteModel');
const emailService = require('../services/emailService');

const clienteController = {
  // Exibir página de cadastro
  exibirCadastro: (req, res) => {
    res.render('pages/cliente');
  },

  // Processar cadastro
  cadastrar: async (req, res) => {
    try {
      const {
        nome, email, telefone, cidade, endereco,
        nomePet, racaPet, idadePet, tipoCadastro, 
        descricao, senha
      } = req.body;

      // Verificar se email já existe
      const clienteExistente = await ClienteModel.buscarPorEmail(email);
      if (clienteExistente) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Este email já está cadastrado!'
        });
      }

      // Criar cliente
      const clienteId = await ClienteModel.criarCliente({
        nome, email, telefone, cidade, endereco,
        nomePet, racaPet, idadePet, tipoCadastro,
        descricao, senha
      });

      // Enviar email de boas-vindas em background (não bloqueia o cadastro)
      emailService.enviarEmailBoasVindas(email, nome, 'cliente').catch(err => {
        console.error('Erro ao enviar email de boas-vindas:', err);
      });

      res.json({
        sucesso: true,
        mensagem: 'Cadastro realizado com sucesso!',
        redirect: '/login'
      });

    } catch (error) {
      console.error('Erro no cadastro:', error);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor'
      });
    }
  },

  // Exibir perfil do cliente
  exibirPerfil: async (req, res) => {
    try {
      if (!req.session.usuario || req.session.usuario.tipo !== 'cliente') {
        return res.redirect('/login');
      }

      const cliente = await ClienteModel.buscarPorId(req.session.usuario.id);
      res.render('pages/perfilcliente', { cliente });

    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      res.redirect('/login');
    }
  },

  // Atualizar dados do cliente
  atualizarPerfil: async (req, res) => {
    try {
      if (!req.session.usuario || req.session.usuario.tipo !== 'cliente') {
        return res.redirect('/login');
      }

      const { nome, email } = req.body;
      const clienteId = req.session.usuario.id;

      await ClienteModel.atualizarCliente(clienteId, { nome, email });

      // Atualizar sessão
      req.session.usuario.nome = nome;
      req.session.usuario.email = email;

      res.redirect('/perfil-cliente?sucesso=1');

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      res.redirect('/perfil-cliente?erro=1');
    }
  }
};

module.exports = clienteController;