var express = require("express");
var router = express.Router();
const AdestradorModel = require("../models/adestradorModel");
const ClienteModel = require("../models/clienteModel");
const PetModel = require("../models/petModel");
const hqController = require("../controllers/hqController");
const chatController = require("../controllers/chatController");
const favoritoModel = require("../models/favoritoModel");
const emailService = require("../services/emailService");
const mercadopago = require('mercadopago');
const multer = require('multer');
const path = require('path');

// Configuração do multer para upload de imagens
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif)'));
    }
  }
});

// Configuração do Mercado Pago versão 1.x
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

// Mapa de especialidades (nome para ID)
const mapEspecialidades = {
  'obediencia-basica': 1,
  'comportamento': 2,
  'truques': 3,
  'agressividade': 4,
  'filhotes': 5
};

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
    console.log('📊 Adestradores encontrados:', adestradores.length);
    if (adestradores.length > 0) {
      console.log('✅ Primeiro adestrador:', adestradores[0]);
    }
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
    console.error("❌ Erro ao carregar adestradores:", error);
    res.render("pages/index", { adestradores: [] });
  }
});

router.get("/Cadastroadestrador.ejs", function (req, res) {
  res.render("pages/Cadastroadestrador");    
});

router.get("/clientesadestrador.ejs", function (req, res) {
  res.render("pages/clientesadestrador");    
});

router.get("/mensagensadestrador.ejs", function (req, res) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'adestrador') {
    return res.redirect("/Login.ejs");
  }
  res.render("pages/mensagensadestrador");    
});

router.get("/agendamentoadestrador.ejs", function (req, res) {
  res.render("pages/agendamentoadestrador");    
});

router.get("/perfiladestrador.ejs", async function (req, res) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'adestrador') {
    return res.redirect("/Login.ejs");
  }
  try {
    let adestrador = await AdestradorModel.buscarPorId(req.session.usuario.id);
    if (!adestrador) {
      return res.redirect("/Login.ejs");
    }
    
    adestrador = {
      ...adestrador,
      experiencia: adestrador.experiencia || 0,
      sobre: adestrador.sobre || 'Sem informações adicionais'
    };
    
    res.render("pages/perfiladestrador", { adestrador });
  } catch (err) {
    console.error('Erro ao carregar perfil adestrador:', err);
    res.redirect("/Login.ejs");
  }
});

router.get("/planosadestrador.ejs", function (req, res) {
  res.render("pages/planosadestrador");    
});

router.get("/mensagenscliente.ejs", function (req, res) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'cliente') {
    return res.redirect("/Login.ejs");
  }
  res.render("pages/mensagenscliente");    
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

router.get("/buscaradestradorcliente.ejs", function (req, res) {
  res.render("pages/buscaradestradorcliente");    
});

router.get("/clienteperfiladestradorview.ejs", function (req, res) {
  res.render("pages/clienteperfiladestradorview");    
});

router.get("/meuspetscliente.ejs", async function (req, res) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'cliente') {
    return res.redirect("/Login.ejs");
  }
  
  try {
    const pets = await PetModel.buscarPorUsuario(req.session.usuario.id);
    res.render("pages/meuspetscliente", { pets: pets || [] });
  } catch (error) {
    console.error('Erro ao carregar pets:', error);
    res.render("pages/meuspetscliente", { pets: [] });
  }
});

router.get("/pets/:id", async function (req, res) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'cliente') {
    return res.status(401).json({ sucesso: false, erro: "Não autorizado" });
  }
  
  try {
    const pets = await PetModel.buscarPorUsuario(req.session.usuario.id);
    const pet = pets.find(p => p.ID_PET == req.params.id);
    
    if (!pet) {
      return res.status(404).json({ sucesso: false, erro: "Pet não encontrado" });
    }
    
    res.json(pet);
  } catch (error) {
    console.error('Erro ao buscar pet:', error);
    res.status(500).json({ sucesso: false, erro: "Erro ao buscar pet" });
  }
});

router.post("/pets/criar", async function (req, res) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'cliente') {
    return res.status(401).json({ sucesso: false, erro: "Não autorizado" });
  }
  
  try {
    const cliente = await ClienteModel.buscarPorId(req.session.usuario.id);
    
    const dadosPet = {
      idCliente: cliente.id,
      idUsuario: req.session.usuario.id,
      nomePet: req.body.nomePet,
      racaPet: req.body.racaPet,
      idadePet: req.body.idadePet || null,
      sexoPet: req.body.sexoPet || null,
      tipoAdestramento: null,
      problemaComportamento: req.body.problemaComportamento || null,
      observacoes: req.body.observacoes || null
    };
    
    const idPet = await PetModel.criar(dadosPet);
    res.json({ sucesso: true, idPet });
  } catch (error) {
    console.error('Erro ao criar pet:', error);
    res.status(500).json({ sucesso: false, erro: "Erro ao criar pet" });
  }
});

router.put("/pets/:id", async function (req, res) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'cliente') {
    return res.status(401).json({ sucesso: false, erro: "Não autorizado" });
  }
  
  try {
    const dadosPet = {
      nomePet: req.body.nomePet,
      racaPet: req.body.racaPet,
      idadePet: req.body.idadePet || null,
      sexoPet: req.body.sexoPet || null,
      tipoAdestramento: null,
      problemaComportamento: req.body.problemaComportamento || null,
      observacoes: req.body.observacoes || null
    };
    await PetModel.atualizar(req.params.id, dadosPet);
    res.json({ sucesso: true });
  } catch (error) {
    console.error('Erro ao atualizar pet:', error);
    res.status(500).json({ sucesso: false, erro: "Erro ao atualizar pet" });
  }
});

router.delete("/pets/:id", async function (req, res) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'cliente') {
    return res.status(401).json({ sucesso: false, erro: "Não autorizado" });
  }
  
  try {
    await PetModel.deletar(req.params.id);
    res.json({ sucesso: true });
  } catch (error) {
    console.error('Erro ao deletar pet:', error);
    res.status(500).json({ sucesso: false, erro: "Erro ao deletar pet" });
  }
});

router.get("/test-chat.ejs", function (req, res) {
  res.render("pages/test-chat");    
});

router.get("/teste-chat-simples.ejs", function (req, res) {
  res.render("pages/teste-chat-simples");    
});

router.get("/paineladestrador", async function (req, res) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'adestrador') {
    return res.redirect("/Login.ejs");
  }
  try {
    let adestrador = await AdestradorModel.buscarPorId(req.session.usuario.id);
    if (!adestrador) {
      return res.redirect("/Login.ejs");
    }
    
    adestrador = {
      ...adestrador,
      experiencia: adestrador.experiencia || 0,
      sobre: adestrador.sobre || 'Sem informações adicionais'
    };
    
    res.render("pages/paineladestrador", { adestrador });
  } catch (err) {
    console.error('Erro ao carregar perfil adestrador:', err);
    res.redirect("/Login.ejs");
  }
});

router.get("/paineladestrador.ejs", async function (req, res) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'adestrador') {
    return res.redirect("/Login.ejs");
  }
  try {
    let adestrador = await AdestradorModel.buscarPorId(req.session.usuario.id);
    if (!adestrador) {
      return res.redirect("/Login.ejs");
    }
    
    adestrador = {
      ...adestrador,
      experiencia: adestrador.experiencia || 0,
      sobre: adestrador.sobre || 'Sem informações adicionais'
    };
    
    res.render("pages/paineladestrador", { adestrador });
  } catch (err) {
    console.error('Erro ao carregar perfil adestrador:', err);
    res.redirect("/Login.ejs");
  }
});

router.get("/planosadestrador.ejs", function (req, res) {
  res.render("pages/planosadestrador");    
});

router.get("/painelcliente", async function (req, res) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'cliente') {
    return res.redirect("/Login.ejs");
  }
  try {
    let cliente = await ClienteModel.buscarPorId(req.session.usuario.id);
    if (!cliente) {
      return res.redirect("/Login.ejs");
    }
    
    cliente = {
      ...cliente,
      tipo_adestramento: cliente.tipo_adestramento || 'obediencia-basica',
      descricao: cliente.descricao || 'Sem observações específicas'
    };
    
    res.render("pages/painelcliente", { cliente });
  } catch (err) {
    console.error('Erro ao carregar perfil cliente:', err);
    res.redirect("/Login.ejs");
  }
});

router.get("/painelcliente.ejs", async function (req, res) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'cliente') {
    return res.redirect("/Login.ejs");
  }
  try {
    let cliente = await ClienteModel.buscarPorId(req.session.usuario.id);
    if (!cliente) {
      return res.redirect("/Login.ejs");
    }
    
    cliente = {
      ...cliente,
      tipo_adestramento: cliente.tipo_adestramento || 'obediencia-basica',
      descricao: cliente.descricao || 'Sem observações específicas'
    };
    
    res.render("pages/painelcliente", { cliente });
  } catch (err) {
    console.error('Erro ao carregar perfil cliente:', err);
    res.redirect("/Login.ejs");
  }
});

router.get("/agendamentos", async function (req, res) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'cliente') {
    return res.redirect("/Login.ejs");
  }
  try {
    let cliente = await ClienteModel.buscarPorId(req.session.usuario.id);
    if (!cliente) {
      return res.redirect("/Login.ejs");
    }
    res.render("pages/agendamentos", { cliente });
  } catch (err) {
    console.error('Erro ao carregar agendamentos:', err);
    res.redirect("/Login.ejs");
  }
});

router.get("/agendamentos.ejs", async function (req, res) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'cliente') {
    return res.redirect("/Login.ejs");
  }
  try {
    let cliente = await ClienteModel.buscarPorId(req.session.usuario.id);
    if (!cliente) {
      return res.redirect("/Login.ejs");
    }
    res.render("pages/agendamentos", { cliente });
  } catch (err) {
    console.error('Erro ao carregar agendamentos:', err);
    res.redirect("/Login.ejs");
  }
});

router.get("/perfilcliente.ejs", async function (req, res) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'cliente') {
    return res.redirect("/Login.ejs");
  }
  
  try {
    const cliente = await ClienteModel.buscarPorId(req.session.usuario.id);
    const pets = await PetModel.buscarPorUsuario(req.session.usuario.id);
    res.render("pages/perfilcliente", { cliente: cliente || {}, pets: pets || [] });
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
    res.render("pages/perfilcliente", { cliente: {}, pets: [] });
  }
});

// === ROTAS POST ===

router.post("/cadastrar-adestrador", rateLimit, async function (req, res) {
  try {
    const {
      name, cpf, email, phone, city, state, 
      experience, specialty, price, about, password,
      logradouro, numero, complemento, bairro, cep
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

    const especialidadeNome = Array.isArray(specialty) ? specialty[0] : specialty;
    const especialidadeId = mapEspecialidades[especialidadeNome] || 1;
    
    const dadosAdestrador = {
      nome: name.trim(),
      cpf: cpf.trim(),
      email: email.toLowerCase().trim(),
      telefone: phone?.trim() || '00000000000',
      cidade: city?.trim() || '',
      estado: state || '',
      experiencia: parseInt(experience) || 0,
      especialidade: especialidadeId,
      preco: precoConvertido,
      sobre: about?.trim() || '',
      senha: password,
      logradouro: logradouro?.trim() || '',
      numero: numero?.trim() || 'S/N',
      complemento: complemento?.trim() || '',
      bairro: bairro?.trim() || '',
      cep: cep?.replace(/\D/g, '') || '00000000'
    };

    await AdestradorModel.criar(dadosAdestrador);
    
    // Enviar email de boas-vindas em background (não bloqueia o cadastro)
    emailService.enviarEmailBoasVindas(dadosAdestrador.email, dadosAdestrador.nome, 'adestrador').catch(err => {
      console.error('Erro ao enviar email de boas-vindas:', err);
    });
    
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
    
    if (!nome || !email || !senha) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Nome, email e senha são obrigatórios" 
      });
    }
    
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
    
    const resultado = await ClienteModel.criar(dadosCliente);
    
    // Criar pet automaticamente se informações foram fornecidas
    if (req.body.nomePet && req.body.racaPet) {
      try {
        const dadosPet = {
          idCliente: resultado.idCliente,
          idUsuario: resultado.idUsuario,
          nomePet: req.body.nomePet,
          racaPet: req.body.racaPet,
          idadePet: req.body.idadePet ? req.body.idadePet + ' anos' : null,
          sexoPet: req.body.sexoPet || null,
          tipoAdestramento: req.body.tipoCadastro || null,
          problemaComportamento: req.body.descricao || null
        };
        
        await PetModel.criar(dadosPet);
      } catch (petError) {
        console.log('Aviso: Não foi possível criar pet automaticamente:', petError.message);
      }
    }
    
    // Enviar email de boas-vindas em background (não bloqueia o cadastro)
    emailService.enviarEmailBoasVindas(email, nome, 'cliente').catch(err => {
      console.error('Erro ao enviar email de boas-vindas:', err);
    });
    
    req.session.usuario = {
      id: resultado.idUsuario,
      nome: nome,
      email: email,
      tipo: 'cliente'
    };
    
    res.json({ 
      sucesso: true, 
      mensagem: "Cadastro realizado com sucesso!",
      redirecionarPara: "/painelcliente" 
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

// ✅ ROTA LOGIN CORRIGIDA COM SESSION.SAVE()
router.post("/login", async function (req, res) {
  try {
    console.log('\n=== TENTATIVA DE LOGIN ===');
    console.log('🔍 Dados recebidos:', req.body);
    const { email, password, tipo } = req.body;

    if (!email || !password || !tipo) {
      console.log('❌ Dados incompletos');
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Email, senha e tipo são obrigatórios",
        mensagem: "Email, senha e tipo são obrigatórios"
      });
    }

    console.log(`🔍 Tentando login como ${tipo} com email: ${email}`);

    let usuario;
    try {
      if (tipo === "adestrador") {
        console.log('🐕 Buscando adestrador...');
        usuario = await AdestradorModel.buscarPorEmail(email);
        console.log('🐕 Resultado busca adestrador:', usuario ? 'ENCONTRADO' : 'NÃO ENCONTRADO');
      } else if (tipo === "cliente") {
        console.log('👤 Buscando cliente...');
        usuario = await ClienteModel.buscarPorEmail(email);
        console.log('👤 Resultado busca cliente:', usuario ? 'ENCONTRADO' : 'NÃO ENCONTRADO');
      } else {
        console.log('❌ Tipo inválido:', tipo);
        return res.status(400).json({ 
          sucesso: false, 
          erro: "Tipo de usuário inválido",
          mensagem: "Tipo de usuário inválido"
        });
      }
    } catch (modelError) {
      console.error('❌ Erro ao buscar usuário:', modelError);
      return res.status(500).json({ 
        sucesso: false, 
        erro: "Erro interno do servidor",
        mensagem: "Erro interno do servidor"
      });
    }

    if (!usuario) {
      console.log('❌ Usuário não encontrado para email:', email);
      return res.status(401).json({ 
        sucesso: false, 
        erro: "Email ou senha incorretos",
        mensagem: "Email ou senha incorretos"
      });
    }

    console.log('✅ Usuário encontrado:', usuario.nome);

    let senhaValida = false;
    try {
      senhaValida = await (tipo === "adestrador" 
        ? AdestradorModel.verificarSenha(password, usuario.senha) 
        : ClienteModel.verificarSenha(password, usuario.senha));
    } catch (senhaError) {
      console.error('❌ Erro ao verificar senha:', senhaError);
      return res.status(500).json({ 
        sucesso: false, 
        erro: "Erro interno do servidor",
        mensagem: "Erro interno do servidor"
      });
    }
    
    if (!senhaValida) {
      console.log('❌ Senha incorreta para:', email);
      return res.status(401).json({ 
        sucesso: false, 
        erro: "Email ou senha incorretos",
        mensagem: "Email ou senha incorretos"
      });
    }

    // ✅ CRIAR A SESSÃO
    req.session.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: tipo
    };

    console.log('✅ Sessão criada para:', email, 'Tipo:', tipo);

    // ✅ SALVAR A SESSÃO EXPLICITAMENTE
    req.session.save((err) => {
      if (err) {
        console.error('❌ ERRO CRÍTICO ao salvar sessão:', err);
        return res.status(500).json({ 
          sucesso: false, 
          erro: "Erro ao salvar sessão",
          mensagem: "Erro ao salvar sessão"
        });
      }

      console.log('✅ Sessão salva com sucesso!');
      const redirecionarPara = tipo === "adestrador" ? "/paineladestrador" : "/painelcliente";
      console.log('Redirecionando para:', redirecionarPara);
      
      res.json({ 
        sucesso: true, 
        mensagem: "Login realizado com sucesso!",
        redirecionarPara: redirecionarPara
      });
    });

  } catch (error) {
    console.error("❌ Erro ao fazer login:", error);
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

router.post("/atualizar-cliente", async function (req, res) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'cliente') {
    return res.redirect("/Login.ejs");
  }
  
  try {
    const { nome, email } = req.body;
    
    if (!nome || !email) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Nome e email são obrigatórios" 
      });
    }
    
    await ClienteModel.atualizar(req.session.usuario.id, {
      nome: nome.trim(),
      email: email.toLowerCase().trim()
    });
    
    req.session.usuario.nome = nome.trim();
    req.session.usuario.email = email.toLowerCase().trim();
    
    res.redirect("/painelcliente");
    
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    res.status(500).json({ 
      sucesso: false, 
      erro: "Erro interno. Tente novamente mais tarde." 
    });
  }
});

router.post("/atualizar-adestrador", async function (req, res) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'adestrador') {
    return res.status(401).json({ sucesso: false, erro: "Não autorizado" });
  }
  
  try {
    const dados = req.body;
    
    await AdestradorModel.atualizar(req.session.usuario.id, dados);
    
    // Atualizar dados da sessão se necessário
    if (dados.nome) req.session.usuario.nome = dados.nome.trim();
    if (dados.email) req.session.usuario.email = dados.email.toLowerCase().trim();
    
    res.json({ sucesso: true, mensagem: "Perfil atualizado com sucesso!" });
    
  } catch (error) {
    console.error("Erro ao atualizar adestrador:", error);
    res.status(500).json({ 
      sucesso: false, 
      erro: "Erro interno. Tente novamente mais tarde." 
    });
  }
});

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

router.get('/api/adestradores', async (req, res) => {
  try {
    const adestradores = await AdestradorModel.buscarTodos();
    res.json(adestradores);
  } catch (error) {
    console.error('Erro ao buscar adestradores:', error);
    res.status(500).json([]);
  }
});

router.get('/api/adestrador/:id', async (req, res) => {
  try {
    const adestrador = await AdestradorModel.buscarPorIdAdestrador(req.params.id);
    if (!adestrador) {
      return res.status(404).json({ erro: 'Adestrador não encontrado' });
    }
    res.json(adestrador);
  } catch (error) {
    console.error('Erro ao buscar adestrador:', error);
    res.status(500).json({ erro: 'Erro ao buscar adestrador' });
  }
});

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

router.get('/chat/test', (req, res) => {
  res.json({ 
    status: 'Chat funcionando!', 
    timestamp: new Date().toISOString() 
  });
});

router.get('/favicon.ico', (req, res) => {
  res.status(204).send();
});

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

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao fazer logout:', err);
    }
    res.redirect('/');
  });
});

router.get('/sair', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao fazer logout:', err);
    }
    res.redirect('/');
  });
});

router.use((error, req, res, next) => {
  console.error('Erro no router:', error);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado'
  });
});

router.get('/tipodeusuario.ejs', (req, res) => {
  res.render('pages/tipodeusuario');
});

// Upload de foto de perfil
router.post('/upload-foto-perfil', upload.single('foto'), async (req, res) => {
  if (!req.session.usuario) {
    return res.status(401).json({ sucesso: false, erro: 'Não autorizado' });
  }
  
  if (!req.file) {
    return res.status(400).json({ sucesso: false, erro: 'Nenhuma imagem enviada' });
  }
  
  try {
    const { executeQuery } = require('../../config/pool_conexoes');
    
    // Inserir imagem no banco
    const queryImagem = `INSERT INTO IMAGENS (NOME_IMAGEM, IMAGEM_BLOB) VALUES (?, ?)`;
    const resultadoImagem = await executeQuery(queryImagem, [req.file.originalname, req.file.buffer]);
    
    // Atualizar ID_PERFIL do usuário
    if (req.session.usuario.tipo === 'adestrador') {
      await AdestradorModel.atualizarFotoPerfil(req.session.usuario.id, resultadoImagem.insertId);
    } else {
      const queryUsuario = `UPDATE USUARIOS SET ID_PERFIL = ? WHERE ID_USUARIO = ?`;
      await executeQuery(queryUsuario, [resultadoImagem.insertId, req.session.usuario.id]);
    }
    
    res.json({ sucesso: true, mensagem: 'Foto atualizada com sucesso!' });
    
  } catch (error) {
    console.error('Erro ao fazer upload da foto:', error);
    res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
  }
});

// Servir imagens do banco
router.get('/imagem/:id', async (req, res) => {
  try {
    const { executeQuery } = require('../../config/pool_conexoes');
    const query = `SELECT NOME_IMAGEM, IMAGEM_BLOB FROM IMAGENS WHERE ID_IMAGEM = ?`;
    const resultado = await executeQuery(query, [req.params.id]);
    
    if (resultado.length === 0) {
      // Retornar imagem padrão SVG
      const defaultAvatar = `
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#e0e0e0"/>
          <circle cx="100" cy="80" r="40" fill="#999"/>
          <path d="M 50 150 Q 100 120 150 150" fill="#999"/>
        </svg>
      `;
      res.setHeader('Content-Type', 'image/svg+xml');
      return res.send(defaultAvatar);
    }
    
    const imagem = resultado[0];
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(imagem.IMAGEM_BLOB);
    
  } catch (error) {
    console.error('Erro ao buscar imagem:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// === ROTAS DE CHAT ===
router.post('/chat/iniciar', chatController.iniciarConversa);
router.get('/chat/conversas', chatController.listarConversas);
router.get('/chat/historico/:idConversa', chatController.buscarHistorico);
router.post('/chat/marcar-lida/:idConversa', chatController.marcarLida);
router.post('/chat/enviar', chatController.enviarMensagem);

module.exports = router;