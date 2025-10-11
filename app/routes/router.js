var express = require("express");
var router = express.Router();
const AdestradorModel = require("../models/adestradorModel");
const ClienteModel = require("../models/clienteModel");
const hqController = require("../controllers/hqController");
const favoritoModel = require("../models/favoritoModel");
const mercadopago = require('mercadopago');
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

router.get("/adestradores.ejs", function (req, res) {
  res.render("pages/adestradores");    
});

router.get("/test-chat.ejs", function (req, res) {
  res.render("pages/test-chat");    
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
    const cliente = await ClienteModel.buscarPorId(req.session.usuario.id);
    if (!cliente) {
      return res.redirect("/Login.ejs");
    }
    res.render("pages/painelcliente", { cliente });
  } catch (err) {
    console.error('Erro ao carregar painel cliente:', err);
    res.redirect("/Login.ejs");
  }
});

router.get("/perfilcliente.ejs", async function (req, res) {
  // Dados temporários para teste (sem banco de dados)
  const clienteTemp = {
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '(11) 99999-9999',
    cidade: 'São Paulo',
    endereco: 'Rua das Flores, 123',
    numero: '123',
    complemento: 'Apto 45',
    bairro: 'Centro',
    estado: 'SP',
    cep: '01234-567'
  };
  
  res.render("pages/perfilcliente", { cliente: clienteTemp });
});

// === ROTAS POST ===

router.post("/cadastrar-adestrador", rateLimit, async function (req, res) {
  try {
    const {
      name, cpf, email, phone, city, state, 
      experience, specialty, price, about, password,
      logradouro, numero, complemento, bairro, cep
    } = req.body;

    // Validações básicas
    if (!name || !cpf || !email || !password || !price) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Campos obrigatórios não preenchidos" 
      });
    }

    // Validar preço
    const precoConvertido = parseFloat(price);
    if (isNaN(precoConvertido) || precoConvertido < 50 || precoConvertido > 99999999.99) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Preço deve ser um valor válido entre R$ 50,00 e R$ 99.999.999,99" 
      });
    }

    // Montar dados do adestrador
    const dadosAdestrador = {
      nome: name.trim(),
      cpf: cpf.trim(),
      email: email.toLowerCase().trim(),
      telefone: phone?.trim() || '00000000000',
      cidade: city?.trim() || '',
      estado: state || '',
      experiencia: parseInt(experience) || 0,
      especialidade: Array.isArray(specialty) ? specialty[0] : (specialty || 1),
      preco: precoConvertido,
      sobre: about?.trim() || '',
      senha: password,
      logradouro: logradouro?.trim() || '',
      numero: numero?.trim() || 'S/N',
      complemento: complemento?.trim() || '',
      bairro: bairro?.trim() || '',
      cep: cep?.replace(/\D/g, '') || '00000000'
    };

    // Criar adestrador
    await AdestradorModel.criar(dadosAdestrador);
    
    res.json({ 
      sucesso: true, 
      mensagem: "Cadastro realizado com sucesso!" 
    });

  } catch (error) {
    console.error("Erro ao cadastrar adestrador:", error);
    
    if (error.message === 'Email já cadastrado') {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Este email já está cadastrado no sistema" 
      });
    }
    
    if (error.message === 'CPF já cadastrado') {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Este CPF já está cadastrado no sistema" 
      });
    }
    
    res.status(500).json({ 
      sucesso: false, 
      erro: "Erro interno. Tente novamente mais tarde." 
    });
  }
});

router.post("/cadastrar-cliente", rateLimit, async function (req, res) {
  try {
    const { 
      nome, email, senha, telefone, cidade, endereco, 
      tipo_adestramento, descricao, cpf,
      logradouro, numero, complemento, bairro, estado, cep
    } = req.body;
    
    // Validações básicas
    if (!nome || !email || !senha) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Nome, email e senha são obrigatórios" 
      });
    }
    
    // Montar dados do cliente
    const dadosCliente = {
      nome: nome.trim(),
      email: email.toLowerCase().trim(),
      senha: senha,
      telefone: telefone?.trim() || '00000000000',
      cpf: cpf?.trim() || '00000000000',
      cidade: cidade?.trim() || '',
      endereco: endereco?.trim() || logradouro?.trim() || '',
      numero: numero?.trim() || 'S/N',
      complemento: complemento?.trim() || '',
      bairro: bairro?.trim() || '',
      estado: estado || '',
      cep: cep?.replace(/\D/g, '') || '00000000'
    };
    
    // Criar cliente
    const resultado = await ClienteModel.criar(dadosCliente);
    
    // Criar sessão
    req.session.usuario = {
      id: resultado.idUsuario,
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
    
    if (error.message === 'Email já cadastrado') {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Este email já está cadastrado no sistema" 
      });
    }
    
    res.status(500).json({ 
      sucesso: false, 
      erro: "Erro interno: " + error.message 
    });
  }
});

router.post("/login", async function (req, res) {
  try {
    console.log('Login attempt:', req.body);
    const { email, password, tipo } = req.body;

    if (!email || !password || !tipo) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Email, senha e tipo são obrigatórios",
        mensagem: "Email, senha e tipo são obrigatórios"
      });
    }

    let usuario;
    try {
      if (tipo === "adestrador") {
        usuario = await AdestradorModel.buscarPorEmail(email);
      } else if (tipo === "cliente") {
        usuario = await ClienteModel.buscarPorEmail(email);
      } else {
        return res.status(400).json({ 
          sucesso: false, 
          erro: "Tipo de usuário inválido",
          mensagem: "Tipo de usuário inválido"
        });
      }
    } catch (modelError) {
      console.error('Erro ao buscar usuário:', modelError);
      return res.status(500).json({ 
        sucesso: false, 
        erro: "Erro interno do servidor",
        mensagem: "Erro interno do servidor"
      });
    }

    if (!usuario) {
      return res.status(401).json({ 
        sucesso: false, 
        erro: "Email ou senha incorretos",
        mensagem: "Email ou senha incorretos"
      });
    }

    let senhaValida = false;
    try {
      senhaValida = await (tipo === "adestrador" 
        ? AdestradorModel.verificarSenha(password, usuario.senha) 
        : ClienteModel.verificarSenha(password, usuario.senha));
    } catch (senhaError) {
      console.error('Erro ao verificar senha:', senhaError);
      return res.status(500).json({ 
        sucesso: false, 
        erro: "Erro interno do servidor",
        mensagem: "Erro interno do servidor"
      });
    }
    
    if (!senhaValida) {
      return res.status(401).json({ 
        sucesso: false, 
        erro: "Email ou senha incorretos",
        mensagem: "Email ou senha incorretos"
      });
    }

    req.session.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: tipo
    };

    console.log('Login successful for:', email);
    res.json({ 
      sucesso: true, 
      mensagem: "Login realizado com sucesso!",
      redirecionarPara: tipo === "adestrador" ? "/paineladestrador.ejs" : "/painelcliente.ejs"
    });

  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ 
      sucesso: false, 
      erro: "Erro interno. Tente novamente mais tarde.",
      mensagem: "Erro interno. Tente novamente mais tarde."
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

// Rota para criar preferência (compatibilidade)
router.post('/criar-preferencia', async (req, res) => {
  try {
    const { title, price, quantity = 1 } = req.body;
    
    if (!title || !price) {
      return res.status(400).json({ erro: 'Título e preço são obrigatórios' });
    }

    const valorNumerico = parseFloat(price);
    if (isNaN(valorNumerico)) {
      return res.status(400).json({ erro: 'Preço deve ser um número válido' });
    }

    const preference = {
      items: [{
        title: title,
        quantity: parseInt(quantity),
        unit_price: valorNumerico,
        currency_id: 'BRL'
      }]
    };
    
    const response = await mercadopago.preferences.create(preference);
    
    if (response.body && response.body.init_point) {
      res.json({ initPoint: response.body.init_point });
    } else {
      res.status(500).json({ erro: 'Não foi possível criar preferência' });
    }
    
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    res.status(500).json({ 
      erro: 'Erro ao criar pagamento',
      detalhes: error.message
    });
  }
});

// Rota para criar pagamento com Mercado Pago
router.post('/criar-pagamento', async (req, res) => {
  console.log('=== ROTA CRIAR PAGAMENTO CHAMADA ===');
  
  try {
    console.log('Headers:', req.headers);
    console.log('Body completo:', JSON.stringify(req.body, null, 2));
    
    const { descricao, valor } = req.body;
    
    if (!descricao || !valor) {
      console.log('ERRO: Campos obrigatórios faltando');
      return res.status(400).json({ erro: 'Descrição e valor são obrigatórios' });
    }

    const valorNumerico = parseFloat(valor);
    
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

    console.log('Tentando criar preferência no Mercado Pago...');
    
    const response = await mercadopago.preferences.create(preference);
    
    if (response.body && response.body.init_point) {
      console.log('Sucesso! Retornando init_point:', response.body.init_point);
      res.json({ 
        checkout_url: response.body.init_point,
        initPoint: response.body.init_point 
      });
    } else {
      console.log('ERRO: Não foi possível obter init_point');
      res.status(500).json({ erro: 'Não foi possível criar preferência' });
    }
    
  } catch (error) {
    console.log('=== ERRO CAPTURADO ===');
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

// Chat com PetBot
router.post('/chat/send', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Mensagem obrigatória e deve ser um texto válido' 
      });
    }
    
    if (message.length > 500) {
      return res.status(400).json({ 
        success: false, 
        error: 'Mensagem muito longa. Máximo 500 caracteres.' 
      });
    }
    
    const aiChatService = require('../services/aiChatService');
    const response = await aiChatService.sendMessage(message.trim());
    
    if (response && response.success) {
      res.json(response);
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Erro ao processar mensagem' 
      });
    }
    
  } catch (error) {
    console.error('Erro no chat:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// Rota de teste Mercado Pago
router.get('/teste-mp', async (req, res) => {
  try {
    console.log('=== TESTE MERCADO PAGO ===');
    console.log('Token:', process.env.MP_ACCESS_TOKEN ? 'Configurado' : 'Não configurado');
    
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
      init_point: result.body.init_point
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

// Rota para verificar se usuário está logado
router.get('/check-auth', (req, res) => {
  try {
    res.json({ 
      loggedIn: !!req.session.usuario,
      user: req.session.usuario ? {
        id: req.session.usuario.id,
        nome: req.session.usuario.nome,
        tipo: req.session.usuario.tipo
      } : null
    });
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    res.json({ loggedIn: false, user: null });
  }
});

// Rota de teste para o chat
router.get('/chat/test', (req, res) => {
  res.json({ 
    status: 'Chat funcionando!', 
    timestamp: new Date().toISOString() 
  });
});

// Rota para favicon
router.get('/favicon.ico', (req, res) => {
  res.status(204).send();
});

// Rota para imagens placeholder
router.get('/api/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params;
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#999" text-anchor="middle" dy=".3em">${width}x${height}</text>
    </svg>
  `;
  
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

// Rota para logout via GET
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao fazer logout:', err);
    }
    res.redirect('/');
  });
});

// Middleware para capturar erros gerais
router.use((error, req, res, next) => {
  console.error('Erro no router:', error);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado'
  });
});

// MODIFICADOPELAIA: Rota para página de seleção de tipo de usuário
router.get('/tipodeusuario.ejs', (req, res) => {
  res.render('pages/tipodeusuario');
});

module.exports = router;