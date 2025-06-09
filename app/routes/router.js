var express = require("express");
var router = express.Router();
const AdestradorModel = require("../models/adestradorModel");

// Rotas GET existentes
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
  // Verificar se está logado
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

// NOVAS ROTAS POST

// Rota para cadastro de adestrador
router.post("/cadastrar-adestrador", async function (req, res) {
  try {
    const {
      name, cpf, email, phone, city, state, 
      experience, specialty, price, about, password
    } = req.body;

    // Verificar se email já existe
    const emailExiste = await AdestradorModel.emailExiste(email);
    if (emailExiste) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "Este email já está cadastrado" 
      });
    }

    // Verificar se CPF já existe
    const cpfExiste = await AdestradorModel.cpfExiste(cpf);
    if (cpfExiste) {
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
      experiencia: parseInt(experience),
      especialidades: Array.isArray(specialty) ? specialty : [specialty],
      preco: parseFloat(price),
      sobre: about,
      senha: password
    };

    // Criar adestrador no banco
    await AdestradorModel.criar(dadosAdestrador);

    res.json({ 
      sucesso: true, 
      mensagem: "Cadastro realizado com sucesso! Redirecionando para login..." 
    });

  } catch (error) {
    console.error("Erro ao cadastrar adestrador:", error);
    
    // Tratar erro específico de limite de conexões
    if (error.code === 'ER_TOO_MANY_USER_CONNECTIONS' || error.code === 1226) {
      return res.status(503).json({ 
        sucesso: false, 
        erro: "Servidor temporariamente sobrecarregado. Tente novamente em alguns segundos." 
      });
    }
    
    res.status(500).json({ 
      sucesso: false, 
      erro: "Erro interno do servidor" 
    });
  }
});

// Rota para login
router.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;

    // Buscar adestrador por email
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
    
    // Tratar erro específico de limite de conexões
    if (error.code === 'ER_TOO_MANY_USER_CONNECTIONS' || error.code === 1226) {
      return res.status(503).json({ 
        sucesso: false, 
        erro: "Servidor temporariamente sobrecarregado. Tente novamente em alguns segundos." 
      });
    }
    
    res.status(500).json({ 
      sucesso: false, 
      erro: "Erro interno do servidor" 
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

module.exports = router;