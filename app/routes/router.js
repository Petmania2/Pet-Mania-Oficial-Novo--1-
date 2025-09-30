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
  res.render("pages/meuspets");    
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

router.get("/buscaradestrador.ejs", function (req, res) {
  res.render("pages/buscaradestrador");    
});

router.get("/perfilcliente.ejs", async function (req, res) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'cliente') {
    return res.redirect("/Login.ejs");
  }
  try {
    const { executeQuery } = require('../../config/pool_conexoes');
    const rows = await executeQuery('SELECT nome, email FROM clientes WHERE id = ?', [req.session.usuario.id]);
    const cliente = rows[0] || null;
    res.render("pages/perfilcliente", { cliente });
  } catch (err) {
    console.error('Erro ao carregar perfil cliente:', err);
    res.redirect("/Login.ejs");
  }
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
  try {
    const { executeQuery } = require('../../config/pool_conexoes');
    await executeQuery('UPDATE clientes SET nome = ?, email = ? WHERE id = ?', [nome, email, req.session.usuario.id]);
    // Atualiza sessão
    req.session.usuario.nome = nome;
    req.session.usuario.email = email;
    res.redirect("/perfilcliente.ejs");
  } catch (err) {
    console.error('Erro ao atualizar cliente:', err);
    res.status(500).send("Erro interno ao atualizar dados.");
  }
});

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

    // Validação de senha forte
    if (password.length < 8) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "A senha deve ter pelo menos 8 caracteres" 
      });
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "A senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula e 1 número" 
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

    // Verificar duplicados
    const emailExiste = await AdestradorModel.emailExiste(email);
    if (emailExiste) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Este email já está cadastrado" 
      });
    }

    const cpfExiste = await AdestradorModel.cpfExiste(cpf);
    if (cpfExiste) {
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
    
    // Email removido temporariamente

    res.json({ 
      sucesso: true, 
      mensagem: "Cadastro realizado com sucesso! Verifique seu email." 
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

// Rota para login - COM DEBUG
router.post("/login", async function (req, res) {
  console.log('=== ROTA DE LOGIN CHAMADA ===');
  console.log('Body recebido:', req.body);
  
  try {
    const { email, password, tipo } = req.body;
    console.log('Dados extraídos:', { email, tipo, temSenha: !!password });

    if (!email || !password || !tipo) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Email, senha e tipo são obrigatórios" 
      });
    }

    let usuario;
    if (tipo === "adestrador") {
      console.log('Buscando adestrador por email:', email);
      usuario = await AdestradorModel.buscarPorEmail(email);
      console.log('Adestrador encontrado:', !!usuario);
    } else if (tipo === "cliente") {
      console.log('Buscando cliente por email:', email);
      usuario = await ClienteModel.buscarPorEmail(email);
      console.log('Cliente encontrado:', !!usuario);
    } else {
      return res.status(400).json({ sucesso: false, erro: "Tipo de usuário inválido" });
    }

    if (!usuario) {
      console.log('Usuário não encontrado para email:', email);
      return res.status(400).json({ sucesso: false, erro: "Email ou senha incorretos" });
    }

    console.log('Verificando senha...');
    const senhaValida = await (tipo === "adestrador" ? AdestradorModel.verificarSenha(password, usuario.senha) : ClienteModel.verificarSenha(password, usuario.senha));
    console.log('Senha válida:', senhaValida);
    
    if (!senhaValida) {
      return res.status(400).json({ sucesso: false, erro: "Email ou senha incorretos" });
    }

    req.session.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: tipo
    };

    // Email removido temporariamente

    res.json({ 
      sucesso: true, 
      mensagem: "Login realizado com sucesso! Verifique seu email.",
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

// Rota para cadastro de cliente - SIMPLIFICADA
router.post("/cadastrar-cliente", async function (req, res) {
  try {
    console.log('Dados recebidos para cadastro cliente:', req.body);
    
    const { nome, email, senha } = req.body;
    
    if (!nome || !email || !senha) {
      return res.status(400).json({ sucesso: false, erro: "Todos os campos são obrigatórios" });
    }
    
    // Verificar se email já existe
    const { executeQuery } = require('../../config/pool_conexoes');
    const existente = await executeQuery('SELECT id FROM clientes WHERE email = ?', [email]);
    
    if (existente && existente.length > 0) {
      return res.status(400).json({ sucesso: false, erro: "Email já cadastrado" });
    }
    
    // Hash da senha
    const bcrypt = require('bcrypt');
    const senhaHash = await bcrypt.hash(senha, 8);
    
    // Inserir cliente
    console.log('Inserindo cliente no banco...');
    const resultado = await executeQuery('INSERT INTO clientes (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senhaHash]);
    console.log('Cliente inserido com ID:', resultado.insertId);
    
    // Criar sessão
    req.session.usuario = {
      id: resultado.insertId,
      nome: nome,
      email: email,
      tipo: 'cliente'
    };
    
    console.log('Sessão criada para cliente:', req.session.usuario);
    
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

// Rota para favoritar/desfavoritar - SIMPLIFICADA
router.get("/favoritar", async (req, res) => {
  try {
    if (!req.session.usuario) {
      return res.status(401).json({
        sucesso: false,
        mensagem: "Para favoritar é necessário estar logado!"
      });
    }
    
    // Aqui você pode implementar a lógica de favoritar
    // Por enquanto, apenas retorna sucesso
    res.json({ sucesso: true, mensagem: "Favorito atualizado!" });
    
  } catch (error) {
    console.error('Erro ao favoritar:', error);
    res.status(500).json({ sucesso: false, mensagem: "Erro interno" });
  }
});

// Rota para criar pagamento com Mercado Pago
router.post('/criar-pagamento', async (req, res) => {
  try {
    console.log('=== CRIAR PAGAMENTO ===');
    console.log('Body:', req.body);
    console.log('Token MP configurado:', !!process.env.MP_ACCESS_TOKEN);
    
    const { descricao, valor } = req.body;
    
    if (!descricao || !valor) {
      return res.status(400).json({ erro: 'Descrição e valor são obrigatórios' });
    }

    const preference = {
      items: [{
        title: descricao,
        quantity: 1,
        unit_price: parseFloat(valor),
        currency_id: 'BRL'
      }]
    };

    console.log('Preferência:', preference);
    const response = await mercadopago.preferences.create(preference);
    console.log('Resposta MP:', response.body);
    
    res.json({ checkout_url: response.body.init_point });
    
  } catch (error) {
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    console.error('Erro completo:', error);
    res.status(500).json({ 
      erro: 'Erro ao criar pagamento',
      detalhes: error.message,
      stack: error.stack
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

// Rotas para Chat com respostas programadas
router.post('/chat/send', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Mensagem é obrigatória'
      });
    }
    
    const aiChatService = require('../services/aiChatService');
    const response = await aiChatService.sendMessage(message);
    
    res.json(response);
  } catch (error) {
    console.error('Erro no chat:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Rota de debug para verificar usuários (remover em produção)
router.get('/debug-usuarios', async (req, res) => {
  try {
    const { executeQuery } = require('../../config/pool_conexoes');
    
    let adestradores = [];
    let clientes = [];
    
    try {
      adestradores = await executeQuery('SELECT id, nome, email FROM adestradores ORDER BY id DESC LIMIT 5');
    } catch (e) {
      console.log('Erro ao buscar adestradores:', e.message);
    }
    
    try {
      clientes = await executeQuery('SELECT id, nome, email FROM clientes ORDER BY id DESC LIMIT 5');
    } catch (e) {
      console.log('Erro ao buscar clientes:', e.message);
    }
    
    res.json({ 
      adestradores: adestradores || [],
      clientes: clientes || [],
      total_adestradores: adestradores ? adestradores.length : 0,
      total_clientes: clientes ? clientes.length : 0
    });
  } catch (error) {
    res.status(500).json({ 
      erro: error.message 
    });
  }
});

// Rota para criar tabela clientes se não existir
router.get('/criar-tabela-clientes', async (req, res) => {
  try {
    const { executeQuery } = require('../../config/pool_conexoes');
    
    const createTable = `
      CREATE TABLE IF NOT EXISTS clientes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await executeQuery(createTable);
    
    res.json({ 
      sucesso: true,
      mensagem: 'Tabela clientes criada/verificada com sucesso!' 
    });
  } catch (error) {
    res.status(500).json({ 
      erro: error.message 
    });
  }
});

// Rota de teste simples
router.post('/teste-login', (req, res) => {
  console.log('=== TESTE LOGIN CHAMADO ===');
  console.log('Body:', req.body);
  res.json({ sucesso: true, mensagem: 'Teste funcionando!' });
});

// Rota para página de contratação
router.get('/contratar-adestrador', (req, res) => {
  res.render('pages/contratar-adestrador');
});

// Rota para teste simples
router.get('/teste-checkout', (req, res) => {
  res.render('pages/teste-checkout');
});

// Rota para processar contratação
router.post('/contratar-adestrador', async (req, res) => {
  console.log('=== CONTRATAÇÃO INICIADA ===');
  console.log('Body:', req.body);
  console.log('MP Token:', process.env.MP_ACCESS_TOKEN ? 'Configurado' : 'Não configurado');
  
  try {
    const { adestradorId } = req.body;
    
    if (!adestradorId) {
      return res.status(400).json({ erro: 'ID do adestrador é obrigatório' });
    }
    
    const adestradores = {
      '1': { nome: 'João Silva', preco: 150.00 },
      '2': { nome: 'Maria Santos', preco: 200.00 }
    };
    
    const adestrador = adestradores[adestradorId];
    console.log('Adestrador encontrado:', adestrador);
    
    if (!adestrador) {
      return res.status(400).json({ erro: 'Adestrador não encontrado' });
    }
    
    const preference = {
      items: [{
        title: `Sessão com ${adestrador.nome}`,
        quantity: 1,
        unit_price: adestrador.preco,
        currency_id: 'BRL'
      }]
    };
    
    console.log('Preferência criada:', preference);
    
    const result = await mercadopago.preferences.create(preference);
    console.log('Resultado MP:', result.body);
    
    res.json({ 
      sucesso: true,
      preferenceId: result.body.id, 
      initPoint: result.body.init_point 
    });
    
  } catch (error) {
    console.error('=== ERRO COMPLETO ===');
    console.error('Mensagem:', error.message);
    console.error('Código:', error.code);
    console.error('Status:', error.status);
    console.error('Stack:', error.stack);
    
    res.status(500).json({ 
      erro: 'Erro interno',
      detalhes: error.message 
    });
  }
});

// Rotas de retorno
router.get('/contratacao-sucesso', (req, res) => {
  res.send('<h1>Contratação realizada com sucesso!</h1>');
});

router.get('/contratacao-falha', (req, res) => {
  res.send('<h1>Falha na contratação</h1>');
});

router.get('/contratacao-pendente', (req, res) => {
  res.send('<h1>Pagamento pendente</h1>');
});

// Rota de teste Mercado Pago
router.get('/teste-mp', async (req, res) => {
  try {
    const preference = {
      items: [{
        title: 'Teste Pet Mania',
        quantity: 1,
        unit_price: 10.00,
        currency_id: 'BRL'
      }]
    };
    const result = await mercadopago.preferences.create(preference);
    res.json({ sucesso: true, init_point: result.body.init_point });
  } catch (error) {
    res.json({ sucesso: false, erro: error.message });
  }
});

// Webhook para receber notificações do Mercado Pago
router.post('/webhook/mercadopago', (req, res) => {
  console.log('Webhook Mercado Pago:', req.body);
  res.status(200).send('OK');
});

module.exports = router;