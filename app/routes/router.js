var express = require("express");
var router = express.Router();
const AdestradorModel = require("../models/adestradorModel");
const hqController = require("../controllers/hqController");
const favoritoModel = require("../models/favoritoModel");
const mercadopago = require('mercadopago');
const ClienteModel = require("../models/clienteModel");
mercadopago.access_token = process.env.MERCADOPAGO_ACCESS_TOKEN || 'SEU_ACCESS_TOKEN_AQUI';

// Middleware para rate limiting simples (em memória)
const rateLimitMap = new Map();

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 60000; // 1 minuto
  const maxRequests = 10; // máximo 10 requests por minuto
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }
  
  const clientData = rateLimitMap.get(ip);
  
  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + windowMs;
    return next();
  }
  
  if (clientData.count >= maxRequests) {
    return res.status(429).json({
      sucesso: false,
      erro: "Muitas tentativas. Aguarde um minuto."
    });
  }
  
  clientData.count++;
  next();
}

// Limpar rate limit cache periodicamente
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Limpeza a cada 5 minutos

// === ROTAS GET ===

router.get("/", async function (req, res) {
  try {
    const usuarioId = req.session.usuario ? req.session.usuario.id : null;
    let adestradores = await AdestradorModel.buscarTodos();
    // Para cada adestrador, verifica se é favorito do usuário logado
    if (usuarioId) {
      for (let adestrador of adestradores) {
        // Aqui usamos o id do adestrador como idHq (ajuste se necessário)
        const favoritos = await favoritoModel.findID(adestrador.id, usuarioId);
        adestrador.favorito = Array.isArray(favoritos) && favoritos.length > 0 && favoritos[0].status_favorito === 1;
      }
    } else {
      // Se não está logado, todos não são favoritos
      adestradores.forEach(a => a.favorito = false);
    }
    res.render("pages/index", { adestradores });
  } catch (error) {
    console.error("Erro ao carregar adestradores:", error);
    res.render("pages/index", { adestradores: [] });
  }
});

router.get("/Cadastroadestrador.ejs", function (req, res) {
  res.render("pages/Cadastroadestrador");    
});

router.get("/cliente.ejs", function (req, res) {
  res.render("pages/cliente");    
});

router.get("/meuspets.ejs", function (req, res) {
  res.render("pages/meupets");    
});

router.get("/agendamentoadestrador.ejs", function (req, res) {
  res.render("pages/agendamentoadestrador");    
});

router.get("/clienteadestrador.ejs", function (req, res) {
  res.render("pages/clienteadestrador");    
});

router.get("/Login.ejs", function (req, res) {
  res.render("pages/Login");    
});

router.get("/meuspets.ejs", function (req, res) {
  res.render("pages/meuspets");    
});

router.get("/mensagensadestrador.ejs", function (req, res) {
  res.render("pages/mensagensadestrador");    
});

router.get("/adestradores.ejs", function (req, res) {
  res.render("pages/adestradores");    
});

router.get("/paineladestrador.ejs", async function (req, res) {
  if (!req.session.usuario) {
    return res.redirect("/Login.ejs");
  }
  
  try {
    // Buscar dados completos do adestrador
    const adestrador = await AdestradorModel.buscarPorId(req.session.usuario.id);
    if (!adestrador) {
      return res.redirect("/Login.ejs");
    }
    
    res.render("pages/paineladestrador", { 
      usuario: req.session.usuario,
      adestrador: adestrador 
    });
  } catch (error) {
    console.error("Erro ao carregar painel:", error);
    res.redirect("/Login.ejs");
  }
});
// Substitua a rota atual do perfiladestrador.ejs no arquivo router.js por esta versão corrigida:

router.get("/perfiladestrador.ejs", async function (req, res) {
  // Verificar se o usuário está logado
  if (!req.session.usuario) {
    return res.redirect("/Login.ejs");
  }
  
  try {
    // Buscar dados completos do adestrador
    const adestrador = await AdestradorModel.buscarPorId(req.session.usuario.id);
    if (!adestrador) {
      return res.redirect("/Login.ejs");
    }
    
    // Renderizar a view passando os dados do adestrador
    res.render("pages/perfiladestrador", { 
      usuario: req.session.usuario,
      adestrador: adestrador 
    });
  } catch (error) {
    console.error("Erro ao carregar perfil do adestrador:", error);
    res.redirect("/Login.ejs");
  }
});
router.get("/planosadestrador.ejs", function (req, res) {
  res.render("pages/planosadestrador");    
});

router.get("/tipodeusuario.ejs", function (req, res) {
  res.render("pages/tipodeusuario");    
});

router.get("/clientesadestrador.ejs", function (req, res) {
  res.render("pages/clientesadestrador");    
});

router.get("/index.ejs", function (req, res) {
  res.render("pages/index");    
});

router.get("/painelcliente.ejs", function (req, res) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'cliente') {
    return res.redirect("/Login.ejs");
  }
  (async () => {
    try {
      const pool = require('../config/pool_conexoes');
      const [rows] = await pool.query('SELECT nome, email FROM clientes WHERE id = ?', [req.session.usuario.id]);
      const cliente = rows[0] || null;
      res.render("pages/painelcliente", { cliente });
    } catch (err) {
      res.render("pages/painelcliente", { cliente: null });
    }
  })();
});

router.get("/buscaradestrador.ejs", function (req, res) {
  res.render("pages/buscaradestrador");    
});

router.get("/perfilcliente.ejs", async function (req, res) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'cliente') {
    return res.redirect("/Login.ejs");
  }
  const pool = require('../config/pool_conexoes');
  const [rows] = await pool.query('SELECT nome, email FROM clientes WHERE id = ?', [req.session.usuario.id]);
  const cliente = rows[0] || null;
  res.render("pages/perfilcliente", { cliente });
});

// === ROTAS POST ===
router.post("/atualizar-cliente", rateLimit, async function (req, res) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'cliente') {
    return res.redirect("/Login.ejs");
  }
  const { nome, email } = req.body;
  if (!nome || !email) {
    return res.status(400).send("Nome e email são obrigatórios.");
  }
  const pool = require('../config/pool_conexoes');
  await pool.query('UPDATE clientes SET nome = ?, email = ? WHERE id = ?', [nome, email, req.session.usuario.id]);
  // Atualiza sessão
  req.session.usuario.nome = nome;
  req.session.usuario.email = email;
  res.redirect("/perfilcliente.ejs");
});
// SUBSTITUA a rota "/cadastrar-adestrador" no seu router.js por esta versão corrigida:

router.post("/cadastrar-adestrador", rateLimit, async function (req, res) {
  try {
    const {
      name, cpf, email, phone, city, state, 
      experience, specialty, price, about, password
    } = req.body;

    // Validação básica dos dados obrigatórios
    if (!name || !cpf || !email || !password || !price) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Campos obrigatórios não preenchidos" 
      });
    }

    // VALIDAÇÃO ESPECÍFICA DO PREÇO - CORREÇÃO DO BUG
    const precoConvertido = parseFloat(price);
    if (isNaN(precoConvertido) || precoConvertido < 50 || precoConvertido > 99999999.99) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Preço deve ser um valor válido entre R$ 50,00 e R$ 99.999.999,99" 
      });
    }

    // VALIDAÇÃO DA EXPERIÊNCIA
    const experienciaConvertida = parseInt(experience);
    if (isNaN(experienciaConvertida) || experienciaConvertida < 0 || experienciaConvertida > 50) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Anos de experiência deve ser um valor válido entre 0 e 50" 
      });
    }

    // VALIDAÇÃO DAS ESPECIALIDADES
    if (!specialty || (Array.isArray(specialty) && specialty.length === 0)) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Selecione pelo menos uma especialidade" 
      });
    }

    // Verificar duplicados com UMA ÚNICA query
    const duplicados = await AdestradorModel.verificarDuplicados(email, cpf);
    
    if (duplicados.emailExiste) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Este email já está cadastrado" 
      });
    }

    if (duplicados.cpfExiste) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Este CPF já está cadastrado" 
      });
    }

    // Preparar dados do adestrador com validações aplicadas
    const dadosAdestrador = {
      nome: name.trim(),
      cpf: cpf.trim(),
      email: email.toLowerCase().trim(),
      telefone: phone.trim(),
      cidade: city.trim(),
      estado: state,
      experiencia: experienciaConvertida,
      especialidades: Array.isArray(specialty) ? specialty : [specialty],
      preco: precoConvertido, // AGORA COM VALIDAÇÃO CORRETA
      sobre: about ? about.trim() : '',
      senha: password
    };

    // LOG para debug (remova em produção)
    console.log('Dados sendo enviados para o banco:', {
      ...dadosAdestrador,
      senha: '[OCULTA]'
    });

    // Criar adestrador no banco
    await AdestradorModel.criar(dadosAdestrador);

    res.json({ 
      sucesso: true, 
      mensagem: "Cadastro realizado com sucesso! Redirecionando..." 
    });

  } catch (error) {
    console.error("Erro ao cadastrar adestrador:", error);
    
    // Tratar diferentes tipos de erro
    if (error.code === 'ER_TOO_MANY_USER_CONNECTIONS' || 
        error.code === 'ER_USER_LIMIT_REACHED' || 
        error.errno === 1226) {
      return res.status(503).json({ 
        sucesso: false, 
        erro: "Servidor temporariamente ocupado. Tente em alguns minutos." 
      });
    }
    
    if (error.code === 'ECONNRESET' || 
        error.code === 'PROTOCOL_CONNECTION_LOST') {
      return res.status(503).json({ 
        sucesso: false, 
        erro: "Problema de conexão. Tente novamente." 
      });
    }

    // Erro específico de valor fora do range
    if (error.code === 'ER_WARN_DATA_OUT_OF_RANGE') {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Um dos valores informados está fora do limite permitido. Verifique o preço e a experiência." 
      });
    }
    
    // Erros de validação
    if (error.message.includes('email já está cadastrado') || 
        error.message.includes('CPF já está cadastrado')) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: error.message 
      });
    }
    
    res.status(500).json({ 
      sucesso: false, 
      erro: "Erro interno. Tente novamente mais tarde." 
    });
  }
});
// Rota para login - OTIMIZADA
router.post("/login", rateLimit, async function (req, res) {
  try {
    const { email, password, tipo } = req.body;

    if (!email || !password || !tipo) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Email, senha e tipo são obrigatórios" 
      });
    }

    let usuario;
    if (tipo === "adestrador") {
      usuario = await AdestradorModel.buscarPorEmail(email);
    } else if (tipo === "cliente") {
      usuario = await ClienteModel.buscarPorEmail(email);
    } else {
      return res.status(400).json({ sucesso: false, erro: "Tipo de usuário inválido" });
    }

    if (!usuario) {
      return res.status(400).json({ sucesso: false, erro: "Email ou senha incorretos" });
    }

    const senhaValida = await (tipo === "adestrador" ? AdestradorModel.verificarSenha(password, usuario.senha) : ClienteModel.verificarSenha(password, usuario.senha));
    if (!senhaValida) {
      return res.status(400).json({ sucesso: false, erro: "Email ou senha incorretos" });
    }

    req.session.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: tipo
    };

    // Salvar login do cliente no banco (opcional, se necessário)
    // await pool.query('UPDATE clientes SET ultimo_login = NOW() WHERE id = ?', [usuario.id]);

    res.json({ 
      sucesso: true, 
      mensagem: "Login realizado com sucesso!",
      redirecionarPara: tipo === "adestrador" ? "/paineladestrador.ejs" : "/painelcliente.ejs"
    });

  } catch (error) {
    console.error("Erro ao fazer login:", error);
    
    // Tratar erros de conexão
    if (error.code === 'ER_TOO_MANY_USER_CONNECTIONS' || 
        error.code === 'ER_USER_LIMIT_REACHED' || 
        error.errno === 1226) {
      return res.status(503).json({ 
        sucesso: false, 
        erro: "Servidor ocupado. Aguarde alguns minutos e tente novamente." 
      });
    }
    
    if (error.code === 'ECONNRESET' || 
        error.code === 'PROTOCOL_CONNECTION_LOST') {
      return res.status(503).json({ 
        sucesso: false, 
        erro: "Problema de conexão. Tente novamente." 
      });
    }
    
    res.status(500).json({ 
      sucesso: false, 
      erro: "Erro interno. Tente novamente mais tarde." 
    });
  }
});

// Rota para logout
router.post("/logout", function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erro ao fazer logout:", err);
      return res.status(500).json({ sucesso: false });
    }
    res.json({ sucesso: true });
  });
});

// Rotas POST existentes
router.post("/exibir", function (req, res) {
  var nome = req.body.nome;
  var email = req.body.email;

  res.json({
    "nomeusuario": nome, 
    "emailusuario": email
  });
});

router.post("/", (req, res) => {
  let objJson = { nome: req.body.Nome, Email: req.body.Email };
  res.render("pages/mostrar", { dadosEnviados: objJson });
});

// Rota para favoritar/desfavoritar uma HQ
router.get("/favoritar", hqController.favoritar);

// Rota para criar pagamento com Mercado Pago
router.post('/criar-pagamento', async (req, res) => {
  try {
    const { descricao, valor, token, paymentMethodId, payerEmail, paymentMethod } = req.body;
    // Pagamento via cartão de crédito (real)
    if (token && paymentMethodId && payerEmail) {
      const payment_data = {
        transaction_amount: parseFloat(valor),
        token: token,
        description: descricao,
        installments: 1,
        payment_method_id: paymentMethodId,
        payer: {
          email: payerEmail
        }
      };
      const payment = await mercadopago.payment.create(payment_data);
      if (payment.body.status === 'approved') {
        return res.json({ status: 'approved' });
      } else {
        return res.json({ status: payment.body.status });
      }
    }

    // Pagamento via Pix
    if (paymentMethod === 'pix') {
      preference.payment_methods = { excluded_payment_types: [{ id: 'credit_card' }] };
      const response = await mercadopago.preferences.create(preference);
      // Buscar QR Code Pix
      if (response.body && response.body.init_point) {
        // Mercado Pago não retorna o QR Code diretamente na preferência, é necessário usar o endpoint de pagamento Pix
        // Aqui, apenas retorna o link de pagamento Pix (o QR Code será gerado pelo SDK ou pelo usuário)
        return res.json({ checkout_url: response.body.init_point });
      }
      return res.status(500).json({ erro: 'Erro ao gerar pagamento Pix.' });
    }

    // Checkout padrão (redirecionamento)
    const response = await mercadopago.preferences.create(preference);
    res.json({ checkout_url: response.body.init_point });
  } catch (error) {
    console.error('Erro Mercado Pago:', error);
    res.status(500).json({ erro: 'Erro ao criar pagamento.' });
  }
});

router.get('/pagamento-sucesso', (req, res) => {
  res.render('pages/pagamento-sucesso');
});

router.get('/pagamento-falha', (req, res) => {
  res.render('pages/pagamento-falha');
});

router.get('/pagamento-pendente', (req, res) => {
  res.render('pages/pagamento-pendente');
});

// Rota para cadastro de cliente
router.post("/cadastrar-cliente", rateLimit, async function (req, res) {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ sucesso: false, erro: "Todos os campos são obrigatórios" });
    }
    // Verifica se já existe cliente com o mesmo email
    const existente = await ClienteModel.buscarPorEmail(email);
    if (existente) {
      return res.status(400).json({ sucesso: false, erro: "Email já cadastrado" });
    }
    // Criptografa a senha
    const bcrypt = require('bcrypt');
    const senhaHash = await bcrypt.hash(senha, 10);
    // Insere no banco
    const pool = require('../config/pool_conexoes');
    await pool.query('INSERT INTO clientes (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senhaHash]);
    // Busca o cliente cadastrado
    const cliente = await ClienteModel.buscarPorEmail(email);
    // Cria sessão
    req.session.usuario = {
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      tipo: 'cliente'
    };
    // Redireciona para perfil do cliente
    res.json({ sucesso: true, redirecionarPara: "/perfilcliente.ejs" });
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
    res.status(500).json({ sucesso: false, erro: "Erro interno ao cadastrar cliente" });
  }
});

module.exports = router;

// Rota para criar pagamento com Mercado Pago
router.post('/criar-pagamento', async (req, res) => {
  try {
    const { descricao, valor, token, paymentMethodId, payerEmail, paymentMethod } = req.body;
    // Pagamento via cartão de crédito (real)
    if (token && paymentMethodId && payerEmail) {
      const payment_data = {
        transaction_amount: parseFloat(valor),
        token: token,
        description: descricao,
        installments: 1,
        payment_method_id: paymentMethodId,
        payer: {
          email: payerEmail
        }
      };
      const payment = await mercadopago.payment.create(payment_data);
      if (payment.body.status === 'approved') {
        return res.json({ status: 'approved' });
      } else {
        return res.json({ status: payment.body.status });
      }
    }

    // Pagamento via Pix
    if (paymentMethod === 'pix') {
      preference.payment_methods = { excluded_payment_types: [{ id: 'credit_card' }] };
      const response = await mercadopago.preferences.create(preference);
      // Buscar QR Code Pix
      if (response.body && response.body.init_point) {
        // Mercado Pago não retorna o QR Code diretamente na preferência, é necessário usar o endpoint de pagamento Pix
        // Aqui, apenas retorna o link de pagamento Pix (o QR Code será gerado pelo SDK ou pelo usuário)
        return res.json({ checkout_url: response.body.init_point });
      }
      return res.status(500).json({ erro: 'Erro ao gerar pagamento Pix.' });
    }

    // Checkout padrão (redirecionamento)
    const response = await mercadopago.preferences.create(preference);
    res.json({ checkout_url: response.body.init_point });
  } catch (error) {
    console.error('Erro Mercado Pago:', error);
    res.status(500).json({ erro: 'Erro ao criar pagamento.' });
  }
});

router.get('/pagamento-sucesso', (req, res) => {
  res.render('pages/pagamento-sucesso');
});

router.get('/pagamento-falha', (req, res) => {
  res.render('pages/pagamento-falha');
});

router.get('/pagamento-pendente', (req, res) => {
  res.render('pages/pagamento-pendente');
});

// Rota para cadastro de cliente
router.post("/cadastrar-cliente", rateLimit, async function (req, res) {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ sucesso: false, erro: "Todos os campos são obrigatórios" });
    }
    // Verifica se já existe cliente com o mesmo email
    const existente = await ClienteModel.buscarPorEmail(email);
    if (existente) {
      return res.status(400).json({ sucesso: false, erro: "Email já cadastrado" });
    }
    // Criptografa a senha
    const bcrypt = require('bcrypt');
    const senhaHash = await bcrypt.hash(senha, 10);
    // Insere no banco
    const pool = require('../config/pool_conexoes');
    await pool.query('INSERT INTO clientes (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senhaHash]);
    // Busca o cliente cadastrado
    const cliente = await ClienteModel.buscarPorEmail(email);
    // Cria sessão
    req.session.usuario = {
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      tipo: 'cliente'
    };
    // Redireciona para perfil do cliente
    res.json({ sucesso: true, redirecionarPara: "/perfilcliente.ejs" });
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
    res.status(500).json({ sucesso: false, erro: "Erro interno ao cadastrar cliente" });
  }
});

module.exports = router;
