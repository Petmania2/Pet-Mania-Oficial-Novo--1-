const moment = require("moment");
var pool = require("../../config/pool_conexoes");

const favoritoModel = {
  findID: async (idHq, idUsuario) => {
    try {
      const [resultados] = await pool.query(
        "SELECT * FROM favorito where hq_id_hq = ? and usuario_id_usuario = ?",
        [idHq, idUsuario]
      );
      return resultados;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  create: async (camposJson) => {
    try {
      const [resultados] = await pool.query("insert into favorito set ?", camposJson);
      return resultados;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  update: async (camposJson, idHq, idUsuario) => {
    try {
      const [resultados] = await pool.query(
        "UPDATE favorito SET ? WHERE hq_id_hq = ? and usuario_id_usuario = ?",
        [camposJson, idHq, idUsuario]
      );
      return resultados;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  favoritar: async (dadosFavorito) => {
    try {
      if (dadosFavorito.situacao === "favorito") {
        const resultados = await favoritoModel.update(
          { status_favorito: 0 },
          dadosFavorito.idHq,
          dadosFavorito.idUsuario
        );
      } else if (dadosFavorito.situacao === "favoritar") {
        const result = await favoritoModel.findID(
          dadosFavorito.idHq,
          dadosFavorito.idUsuario
        );

        var total = Object.keys(result).length;

        if (total === 0) {
          let obj = {
            hq_id_hq: dadosFavorito.idHq,
            usuario_id_usuario: dadosFavorito.idUsuario,
            dt_inclusao_favorito: moment().format("YYYY/MM/DD"),
            status_favorito: 1,
          };
          const resultados = await favoritoModel.create(obj);
        } else {
          const resultados = await favoritoModel.update(
            { status_favorito: 1 },
            dadosFavorito.idHq,
            dadosFavorito.idUsuario
          );
        }
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};

module.exports = favoritoModel;
