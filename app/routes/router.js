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



module.exports = router;