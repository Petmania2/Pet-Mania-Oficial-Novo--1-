const hqModel = require("../models/hqModel");
const favoritoModel = require("../models/favoritoModel");

const hqController = {
  listar: async (req, res) => {
    req.session.autenticado.login = req.query.login;
    const results = await hqModel.findAll(req.session.autenticado.id);
    res.render("pages/index", {
      autenticado: req.session.autenticado,
      login: req.session.logado,
      listahq: results,
    });
  },

  favoritar: async (req, res) => {
    if (req.session.autenticado.autenticado === null) {
      res.status(401).json({
        sucesso: false,
        mensagem: "Para favoritar é necessário estar logado!",
      });
    } else {
      await favoritoModel.favoritar({
        idHq: req.query.id,
        situacao: req.query.sit,
        idUsuario: req.session.autenticado.id,
      });
      res.json({ sucesso: true });
    }
  },
};

module.exports = hqController;
