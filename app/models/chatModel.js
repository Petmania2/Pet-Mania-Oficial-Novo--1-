const { pool } = require('../../config/pool_conexoes');

const chatModel = {
    // Criar ou buscar conversa existente
    async criarOuBuscarConversa(idCliente, idAdestrador) {
        const [result] = await pool.query(
            `INSERT INTO conversas (id_cliente, id_adestrador) 
             VALUES (?, ?) 
             ON DUPLICATE KEY UPDATE id_conversa=LAST_INSERT_ID(id_conversa)`,
            [idCliente, idAdestrador]
        );
        return result.insertId;
    },

    // Buscar conversas de um usuário
    async buscarConversas(idUsuario, tipoUsuario) {
        if (tipoUsuario === 'C' || tipoUsuario === 'cliente') {
            // Cliente: buscar suas conversas
            const [conversas] = await pool.query(
                `SELECT 
                    conv.id_conversa,
                    conv.ultima_mensagem,
                    u_adestrador.ID_USUARIO as id_outro_usuario,
                    u_adestrador.NOME_USUARIO as nome_outro_usuario,
                    (SELECT COUNT(*) FROM mensagens m 
                     WHERE m.id_conversa = conv.id_conversa 
                     AND m.lida = FALSE 
                     AND m.id_remetente != ?) as nao_lidas
                 FROM conversas conv
                 JOIN clientes c ON conv.id_cliente = c.id_cliente
                 JOIN adestradores a ON conv.id_adestrador = a.id_adestrador
                 JOIN USUARIOS u_adestrador ON a.ID_USUARIO = u_adestrador.ID_USUARIO
                 WHERE c.ID_USUARIO = ?
                 ORDER BY conv.ultima_mensagem DESC`,
                [idUsuario, idUsuario]
            );
            return conversas;
        } else if (tipoUsuario === 'A' || tipoUsuario === 'adestrador') {
            // Adestrador: buscar suas conversas
            const [conversas] = await pool.query(
                `SELECT 
                    conv.id_conversa,
                    conv.ultima_mensagem,
                    u_cliente.ID_USUARIO as id_outro_usuario,
                    u_cliente.NOME_USUARIO as nome_outro_usuario,
                    (SELECT COUNT(*) FROM mensagens m 
                     WHERE m.id_conversa = conv.id_conversa 
                     AND m.lida = FALSE 
                     AND m.id_remetente != ?) as nao_lidas
                 FROM conversas conv
                 JOIN adestradores a ON conv.id_adestrador = a.id_adestrador
                 JOIN clientes c ON conv.id_cliente = c.id_cliente
                 JOIN USUARIOS u_cliente ON c.ID_USUARIO = u_cliente.ID_USUARIO
                 WHERE a.ID_USUARIO = ?
                 ORDER BY conv.ultima_mensagem DESC`,
                [idUsuario, idUsuario]
            );
            return conversas;
        } else {
            return [];
        }
    },

    // Salvar mensagem
    async salvarMensagem(idConversa, idRemetente, mensagem) {
        const [result] = await pool.query(
            `INSERT INTO mensagens (id_conversa, id_remetente, mensagem) 
             VALUES (?, ?, ?)`,
            [idConversa, idRemetente, mensagem]
        );
        return result.insertId;
    },

    // Buscar histórico de mensagens
    async buscarMensagens(idConversa, limite = 50) {
        const [mensagens] = await pool.query(
            `SELECT 
                m.id_mensagem,
                m.mensagem,
                m.data_envio,
                m.lida,
                m.id_remetente,
                u.NOME_USUARIO as nome_remetente
             FROM mensagens m
             JOIN USUARIOS u ON m.id_remetente = u.ID_USUARIO
             WHERE m.id_conversa = ?
             ORDER BY m.data_envio DESC
             LIMIT ?`,
            [idConversa, limite]
        );
        return mensagens.reverse();
    },

    // Marcar mensagens como lidas
    async marcarComoLida(idConversa, idUsuario) {
        await pool.query(
            `UPDATE mensagens 
             SET lida = TRUE 
             WHERE id_conversa = ? 
             AND id_remetente != ? 
             AND lida = FALSE`,
            [idConversa, idUsuario]
        );
    },

    // Enviar mensagem
    async enviarMensagem(idConversa, idRemetente, tipoRemetente, mensagem) {
        const [result] = await pool.query(
            `INSERT INTO mensagens (id_conversa, id_remetente, mensagem, lida) 
             VALUES (?, ?, ?, FALSE)`,
            [idConversa, idRemetente, mensagem]
        );
        
        // Atualizar ultima_mensagem na conversa
        await pool.query(
            `UPDATE conversas 
             SET ultima_mensagem = NOW() 
             WHERE id_conversa = ?`,
            [idConversa]
        );
        
        return result.insertId;
    }
};

module.exports = chatModel;
