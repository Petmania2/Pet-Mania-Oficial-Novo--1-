const moment = require("moment");
const { executeQuery } = require("../../config/pool_conexoes");

const hqModel = {
  findAll: async (id = null) => {
    try {
      const resultados = await executeQuery(
        "SELECT h.id_hq, h.nome_hq, h.descr_hq, h.imagem_hq, " +
        "h.preco_hq, h.status_hq, IF(f.hq_id_hq IS NULL, 'favoritar', 'favorito') as favorito " +
        "FROM hq h " +
        "LEFT JOIN favorito f " +
        "ON ((h.id_hq = f.hq_id_hq AND f.usuario_id_usuario = ?) AND f.status_favorito = 1)",
        [id]
      );
      return resultados;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
};

module.exports = hqModel;