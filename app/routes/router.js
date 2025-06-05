var express = require("express");
var router = express.Router();


router.get("/", 
    function (req, res) {
    res.render("pages/index");    
});

router.get("/Cadastroadestrador.ejs", 
    function (req, res) {
    res.render("pages/Cadastroadestrador.ejs");    
});

// Nova rota para cadastro de cliente (caso precise)
router.get("/cliente.ejs", 
    function (req, res) {
    res.render("pages/cliente.ejs");    
});

router.get("/agendamentoadestrador.ejs", 
    function (req, res) {
    res.render("pages/agendamentoadestrador.ejs");    
});

router.get("/clienteadestrador.ejs", 
    function (req, res) {
    res.render("pages/clienteadestrador.ejs");    
});

router.get("/Login.ejs", 
    function (req, res) {
    res.render("pages/Login.ejs");    
});

router.get("/mensagensadestrador.ejs", 
    function (req, res) {
    res.render("pages/mensagensadestrador.ejs");    
});

router.get("/paineladestrador.ejs", 
    function (req, res) {
    res.render("pages/paineladestrador.ejs");    
});

router.get("/perfiladestrador.ejs", 
    function (req, res) {
    res.render("pages/perfiladestrador.ejs");    
});

router.get("/planosadestrador.ejs", 
    function (req, res) {
    res.render("pages/planosadestrador.ejs");    
});

router.get("/tipodeusuario.ejs", 
    function (req, res) {
    res.render("pages/tipodeusuario.ejs");    
});

router.get("/clientesadestrador.ejs", 
    function (req, res) {
    res.render("pages/clientesadestrador.ejs");    
});

router.get("/index.ejs", 
    function (req, res) {
    res.render("pages/index.ejs");    
});











router.post("/exibir", 
    function (req, res) {

    var nome = req.body.nome;
    var email = req.body.email;

    res.json({"nomeusuario":nome, 
        "emailusuario":email
    })

});

router.post("/", (req, res)=>{
    let objJson = {nome:req.body.nome, email:req.body.email} 

    res.render("pages/mostrar", {dadosEnviados:objJson});
})


const express = require("express");
const router = express.Router();
const adestradorController = require("../controllers/adestradorController");

// Rota para exibir página de cadastro
router.get("/cadastro", (req, res) => {
    res.render("pages/Cadastroadestrador", { 
        listaErros: null, 
        dadosNotificacao: null, 
        valores: {} 
    });
});

// Rota para processar cadastro (API)
router.post("/api/cadastrar", 
    adestradorController.regrasValidacaoCadastro, 
    adestradorController.cadastrar
);

// Rota para listar todos os adestradores (API)
router.get("/api/listar", adestradorController.listarTodos);

// Rota para buscar adestrador por ID (API)
router.get("/api/:id", adestradorController.buscarPorId);

// Rota para buscar adestradores por cidade (API)
router.get("/api/cidade/:cidade", adestradorController.buscarPorCidade);

// Rota para buscar adestradores por especialidade (API)
router.get("/api/especialidade/:especialidade", adestradorController.buscarPorEspecialidade);

module.exports = router;





