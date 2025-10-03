var express = require("express");
var router = express.Router();
const AdestradorModel = require("../models/adestradorModel");
const hqController = require("../controllers/hqController");
const favoritoModel = require("../models/favoritoModel");
const mercadopago = require('mercadopago');
const ClienteModel = require("../models/clienteModel");

// Configuração do Mercado Pago versão 1.x
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

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

// === ROTAS GET ===

router.get("/", async function (req, res) {
  try {
    const usuarioId = req.session.usuario ? req.session.usuario.id : null;
    let adestradores = await AdestradorModel.buscarTodos();
    if (usuarioId) {
      for (let adestrador of adestradores) {
        const favoritos = await favoritoModel.findID(adestrador.id, usuarioId);
        adestrador.favorito = Array.isArray(favoritos) && favoritos.length > 0 && favoritos[0].status_favorito === 1;
      }
    } else {
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
  res.render("pages/meuspets");    
});

router.get("/Login.ejs", function (req, res) {
  res.render("pages/Login");    
});

router.get("/paineladestrador.ejs", async function (req, res) {
  if (!req.session.usuario) {
    return res.redirect("/Login.ejs");
  }
  
  try {
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

router.get("/planosadestrador.ejs", function (req, res) {
  res.render("pages/planosadestrador");    
});

router.get("/painelcliente.ejs", async function (req, res) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'cliente') {
    return res.redirect("/Login.ejs");
  }
  try {
    const { executeQuery } = require('../../config/pool_conexoes');
    const rows = await executeQuery('SELECT nome, email FROM clientes WHERE id = ?', [req.session.usuario.id]);
    const cliente = rows[0] || null;
    res.render("pages/painelcliente", { cliente });
  } catch (err) {
    console.error('Erro ao carregar painel cliente:', err);
    res.render("pages/painelcliente", { cliente: null });
  }
});

// === ROTAS POST ===

router.post("/cadastrar-adestrador", rateLimit, async function (req, res) {
  try {
    const {
      name, cpf, email, phone, city, state, 
      experience, specialty, price, about, password
    } = req.body;

    if (!name || !cpf || !email || !password || !price) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Campos obrigatórios não preenchidos" 
      });
    }

    const precoConvertido = parseFloat(price);
    if (isNaN(precoConvertido) || precoConvertido < 50 || precoConvertido > 99999999.99) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Preço deve ser um valor válido entre R$ 50,00 e R$ 99.999.999,99" 
      });
    }

    const dadosAdestrador = {
      nome: name.trim(),
      cpf: cpf.trim(),
      email: email.toLowerCase().trim(),
      telefone: phone.trim(),
      cidade: city.trim(),
      estado: state,
      experiencia: parseInt(experience),
      especialidades: Array.isArray(specialty) ? specialty : [specialty],
      preco: precoConvertido,
      sobre: about ? about.trim() : '',
      senha: password
    };

    await AdestradorModel.criar(dadosAdestrador);
    
    res.json({ 
      sucesso: true, 
      mensagem: "Cadastro realizado com sucesso!" 
    });

  } catch (error) {
    console.error("Erro ao cadastrar adestrador:", error);
    res.status(500).json({ 
      sucesso: false, 
      erro: "Erro interno. Tente novamente mais tarde." 
    });
  }
});

router.post("/login", async function (req, res) {
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

    res.json({ 
      sucesso: true, 
      mensagem: "Login realizado com sucesso!",
      redirecionarPara: tipo === "adestrador" ? "/paineladestrador.ejs" : "/painelcliente.ejs"
    });

  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ 
      sucesso: false, 
      erro: "Erro interno. Tente novamente mais tarde." 
    });
  }
});

router.post("/logout", function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erro ao fazer logout:", err);
      return res.status(500).json({ sucesso: false });
    }
    res.json({ sucesso: true });
  });
});

router.post("/cadastrar-cliente", async function (req, res) {
  try {
    const { nome, email, senha } = req.body;
    
    if (!nome || !email || !senha) {
      return res.status(400).json({ sucesso: false, erro: "Todos os campos são obrigatórios" });
    }
    
    const { executeQuery } = require('../../config/pool_conexoes');
    const existente = await executeQuery('SELECT id FROM clientes WHERE email = ?', [email]);
    
    if (existente && existente.length > 0) {
      return res.status(400).json({ sucesso: false, erro: "Email já cadastrado" });
    }
    
    const bcrypt = require('bcrypt');
    const senhaHash = await bcrypt.hash(senha, 8);
    
    const resultado = await executeQuery('INSERT INTO clientes (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senhaHash]);
    
    req.session.usuario = {
      id: resultado.insertId,
      nome: nome,
      email: email,
      tipo: 'cliente'
    };
    
    res.json({ 
      sucesso: true, 
      mensagem: "Cadastro realizado com sucesso!",
      redirecionarPara: "/painelcliente.ejs" 
    });
    
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
    res.status(500).json({ sucesso: false, erro: "Erro interno: " + error.message });
  }
});

// Rota para criar pagamento com Mercado Pago
router.post('/criar-pagamento', async (req, res) => {
  console.log('=== ROTA CRIAR PAGAMENTO CHAMADA ===');
  
  try {
    console.log('Headers:', req.headers);
    console.log('Body completo:', JSON.stringify(req.body, null, 2));
    console.log('Token MP existe:', !!process.env.MP_ACCESS_TOKEN);
    console.log('Token MP primeiros chars:', process.env.MP_ACCESS_TOKEN?.substring(0, 10));
    
    const { descricao, valor } = req.body;
    console.log('Descrição extraída:', descricao);
    console.log('Valor extraído:', valor, 'tipo:', typeof valor);
    
    if (!descricao || !valor) {
      console.log('ERRO: Campos obrigatórios faltando');
      return res.status(400).json({ erro: 'Descrição e valor são obrigatórios' });
    }

    const valorNumerico = parseFloat(valor);
    console.log('Valor numérico:', valorNumerico);
    
    if (isNaN(valorNumerico)) {
      console.log('ERRO: Valor não é um número válido');
      return res.status(400).json({ erro: 'Valor deve ser um número válido' });
    }

    const preference = {
      items: [{
        title: descricao,
        quantity: 1,
        unit_price: valorNumerico,
        currency_id: 'BRL'
      }]
    };

    console.log('Preferência criada:', JSON.stringify(preference, null, 2));
    console.log('Tentando criar preferência no Mercado Pago...');
    
    const response = await mercadopago.preferences.create(preference);
    console.log('Resposta do MP - Status:', response.status);
    console.log('Resposta do MP - Body:', JSON.stringify(response.body, null, 2));
    
    if (response.body && response.body.init_point) {
      console.log('Sucesso! Retornando init_point:', response.body.init_point);
      res.json({ checkout_url: response.body.init_point });
    } else {
      console.log('ERRO: Não foi possível obter init_point');
      res.status(500).json({ erro: 'Não foi possível criar preferência' });
    }
    
  } catch (error) {
    console.log('=== ERRO CAPTURADO ===');
    console.error('Tipo do erro:', error.constructor.name);
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    console.error('Código:', error.code);
    console.error('Status:', error.status);
    console.error('Erro completo:', error);
    
    res.status(500).json({ 
      erro: 'Erro ao criar pagamento',
      detalhes: error.message,
      codigo: error.code || 'UNKNOWN'
    });
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

// Chat simples
router.post('/chat/send', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, error: 'Mensagem obrigatória' });
    }
    
    const aiChatService = require('../services/aiChatService');
    const response = await aiChatService.sendMessage(message);
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erro no chat' });
  }
});

// Rota de teste Mercado Pago
router.get('/teste-mp', async (req, res) => {
  try {
    console.log('=== TESTE MERCADO PAGO ===');
    console.log('Token:', process.env.MP_ACCESS_TOKEN ? 'Configurado' : 'Não configurado');
    console.log('Tipo do token:', process.env.MP_ACCESS_TOKEN?.substring(0, 4));
    
    const preference = {
      items: [{
        title: 'Teste Pet Mania',
        quantity: 1,
        unit_price: 10.00,
        currency_id: 'BRL'
      }]
    };
    
    console.log('Criando preferência de teste...');
    const result = await mercadopago.preferences.create(preference);
    console.log('Sucesso! Init point:', result.body.init_point);
    
    res.json({ 
      sucesso: true, 
      init_point: result.body.init_point,
      token_tipo: process.env.MP_ACCESS_TOKEN?.substring(0, 8)
    });
  } catch (error) {
    console.error('Erro no teste MP:', error);
    res.json({ 
      sucesso: false, 
      erro: error.message,
      codigo: error.status || 'N/A'
    });
  }
});

// Rota para favicon
router.get('/favicon.ico', (req, res) => {
  res.status(204).send();
});

module.exports = router;