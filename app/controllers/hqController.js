const hqModel = require("../models/hqModel");
const favoritoModel = require("../models/favoritoModel");

const hqController = {
  listar: async (req, res) => {
    const usuario = req.session.usuario || null;
    const results = usuario ? await hqModel.findAll(usuario.id) : [];
    res.render("pages/index", {
      usuario: usuario,
      listahq: results,
    });
  },

  favoritar: async (req, res) => {
    if (!req.session.usuario) {
      res.status(401).json({
        sucesso: false,
        mensagem: "Para favoritar é necessário estar logado!",
      });
    } else {
      await favoritoModel.favoritar({
        idHq: req.query.id,
        situacao: req.query.sit,
        idUsuario: req.session.usuario.id,
      });
      res.json({ sucesso: true });
    }
  },
};

module.exports = hqController;
