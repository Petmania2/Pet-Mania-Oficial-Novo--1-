var express = require("express");
var router = express.Router();
const AdestradorModel = require("../models/adestradorModel");

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

// Rotas GET existentes (sem alteração)
router.get("/", function (req, res) {
  res.render("pages/index");    
});

router.get("/Cadastroadestrador.ejs", function (req, res) {
  res.render("pages/Cadastroadestrador.ejs");    
});

router.get("/cliente.ejs", function (req, res) {
  res.render("pages/cliente.ejs");    
});

router.get("/agendamentoadestrador.ejs", function (req, res) {
  res.render("pages/agendamentoadestrador.ejs");    
});

router.get("/clienteadestrador.ejs", function (req, res) {
  res.render("pages/clienteadestrador.ejs");    
});

router.get("/Login.ejs", function (req, res) {
  res.render("pages/Login.ejs");    
});

router.get("/mensagensadestrador.ejs", function (req, res) {
  res.render("pages/mensagensadestrador.ejs");    
});

router.get("/paineladestrador.ejs", function (req, res) {
  if (!req.session.usuario) {
    return res.redirect("/Login.ejs");
  }
  res.render("pages/paineladestrador.ejs", { usuario: req.session.usuario });    
});

router.get("/perfiladestrador.ejs", function (req, res) {
  res.render("pages/perfiladestrador.ejs");    
});

router.get("/planosadestrador.ejs", function (req, res) {
  res.render("pages/planosadestrador.ejs");    
});

router.get("/tipodeusuario.ejs", function (req, res) {
  res.render("pages/tipodeusuario.ejs");    
});

router.get("/clientesadestrador.ejs", function (req, res) {
  res.render("pages/clientesadestrador.ejs");    
});

router.get("/index.ejs", function (req, res) {
  res.render("pages/index.ejs");    
});

router.get("/painelcliente.ejs", function (req, res) {
  res.render("pages/painelcliente.ejs");    
});

router.get("/buscaradestrador.ejs", function (req, res) {
  res.render("pages/buscaradestrador.ejs");    
});

router.get("/perfilcliente.ejs", function (req, res) {
  res.render("pages/perfilcliente.ejs");    
});

// ROTAS POST OTIMIZADAS

// Rota para cadastro - OTIMIZADA
router.post("/cadastrar-adestrador", rateLimit, async function (req, res) {
  try {
    const {
      name, cpf, email, phone, city, state, 
      experience, specialty, price, about, password
    } = req.body;

    // Validação básica dos dados
    if (!name || !cpf || !email || !password) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Campos obrigatórios não preenchidos" 
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

    // Preparar dados do adestrador
    const dadosAdestrador = {
      nome: name,
      cpf: cpf,
      email: email,
      telefone: phone,
      cidade: city,
      estado: state,
      experiencia: parseInt(experience) || 0,
      especialidades: Array.isArray(specialty) ? specialty : [specialty],
      preco: parseFloat(price) || 0,
      sobre: about || '',
      senha: password
    };

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
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Email e senha são obrigatórios" 
      });
    }

    // Buscar adestrador por email (query otimizada)
    const adestrador = await AdestradorModel.buscarPorEmail(email);
    
    if (!adestrador) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Email ou senha incorretos" 
      });
    }

    // Verificar senha
    const senhaValida = await AdestradorModel.verificarSenha(password, adestrador.senha);
    
    if (!senhaValida) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Email ou senha incorretos" 
      });
    }

    // Criar sessão
    req.session.usuario = {
      id: adestrador.id,
      nome: adestrador.nome,
      email: adestrador.email,
      tipo: 'adestrador'
    };

    res.json({ 
      sucesso: true, 
      mensagem: "Login realizado com sucesso!",
      redirecionarPara: "/paineladestrador.ejs"
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

// Rota para logout - sem alteração
router.post("/logout", function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erro ao fazer logout:", err);
      return res.status(500).json({ sucesso: false });
    }
    res.json({ sucesso: true });
  });
});

// Rotas POST existentes (sem alteração)
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

module.exports = router;