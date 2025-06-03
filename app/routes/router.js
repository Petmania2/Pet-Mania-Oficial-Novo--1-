var express = require("express");
var router = express.Router();


router.get("/", 
    function (req, res) {
    res.render("pages/index");    
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