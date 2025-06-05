const express = require("express");
const router = express.Router();

// Rotas de páginas
router.get("/", (req, res) => {
    res.render("pages/index");    
});

router.get("/Cadastroadestrador.ejs", (req, res) => {
    res.render("pages/Cadastroadestrador.ejs");    
});

router.get("/cliente.ejs", (req, res) => {
    res.render("pages/cliente.ejs");    
});

router.get("/agendamentoadestrador.ejs", (req, res) => {
    res.render("pages/agendamentoadestrador.ejs");    
});

router.get("/clienteadestrador.ejs", (req, res) => {
    res.render("pages/clienteadestrador.ejs");    
});

router.get("/Login.ejs", (req, res) => {
    res.render("pages/Login.ejs");    
});

router.get("/mensagensadestrador.ejs", (req, res) => {
    res.render("pages/mensagensadestrador.ejs");    
});

router.get("/paineladestrador.ejs", (req, res) => {
    res.render("pages/paineladestrador.ejs");    
});

router.get("/perfiladestrador.ejs", (req, res) => {
    res.render("pages/perfiladestrador.ejs");    
});

router.get("/planosadestrador.ejs", (req, res) => {
    res.render("pages/planosadestrador.ejs");    
});

router.get("/tipodeusuario.ejs", (req, res) => {
    res.render("pages/tipodeusuario.ejs");    
});

router.get("/clientesadestrador.ejs", (req, res) => {
    res.render("pages/clientesadestrador.ejs");    
});

router.get("/index.ejs", (req, res) => {
    res.render("pages/index.ejs");    
});

// Rotas POST
router.post("/exibir", (req, res) => {
    const nome = req.body.nome;
    const email = req.body.email;

    res.json({
        nomeusuario: nome,
        emailusuario: email
    });
});

router.post("/", (req, res) => {
    const objJson = {
        nome: req.body.nome,
        email: req.body.email
    };

    res.render("pages/mostrar", { dadosEnviados: objJson });
});

// Rota adicional (exemplo com controller — ajuste conforme necessário)
const adestradorController = require("../controllers/adestradorController");

router.get("/cadastro", (req, res) => {
    res.render("pages/Cadastroadestrador", {
        listaErros: null,
        dadosNotificacao: null,
        valores: {}
    });
});

module.exports = router;
