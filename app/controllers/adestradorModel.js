var pool = require("../../config/pool_conexoes");

const adestradorModel = {
    findAll: async () => {
        try {
            const [resultados] = await pool.query(
                "SELECT a.*, u.nome_usuario, u.email_usuario, u.status_usuario " +
                "FROM adestrador a " +
                "INNER JOIN usuario u ON a.id_usuario = u.id_usuario " +
                "WHERE u.status_usuario = 1"
            );
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    findById: async (id) => {
        try {
            const [resultados] = await pool.query(
                "SELECT a.*, u.nome_usuario, u.email_usuario, u.fone_usuario " +
                "FROM adestrador a " +
                "INNER JOIN usuario u ON a.id_usuario = u.id_usuario " +
                "WHERE a.id_adestrador = ? AND u.status_usuario = 1",
                [id]
            );
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    findByUserId: async (userId) => {
        try {
            const [resultados] = await pool.query(
                "SELECT * FROM adestrador WHERE id_usuario = ?",
                [userId]
            );
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    create: async (camposForm) => {
        try {
            const [resultados] = await pool.query(
                "INSERT INTO adestrador SET ?",
                [camposForm]
            );
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    update: async (camposForm, id) => {
        try {
            const [resultados] = await pool.query(
                "UPDATE adestrador SET ? WHERE id_adestrador = ?",
                [camposForm, id]
            );
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    delete: async (id) => {
        try {
            const [resultados] = await pool.query(
                "UPDATE adestrador SET status_adestrador = 0 WHERE id_adestrador = ?",
                [id]
            );
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    findByCity: async (cidade) => {
        try {
            const [resultados] = await pool.query(
                "SELECT a.*, u.nome_usuario, u.email_usuario " +
                "FROM adestrador a " +
                "INNER JOIN usuario u ON a.id_usuario = u.id_usuario " +
                "WHERE a.cidade_adestrador LIKE ? AND u.status_usuario = 1",
                [`%${cidade}%`]
            );
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    findBySpecialty: async (especialidade) => {
        try {
            const [resultados] = await pool.query(
                "SELECT a.*, u.nome_usuario, u.email_usuario " +
                "FROM adestrador a " +
                "INNER JOIN usuario u ON a.id_usuario = u.id_usuario " +
                "WHERE a.especialidades_adestrador LIKE ? AND u.status_usuario = 1",
                [`%${especialidade}%`]
            );
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
};

module.exports = adestradorModel;