const chatModel = require('../models/chatModel');

const chatController = {
    // Iniciar conversa
    async iniciarConversa(req, res) {
        try {
            console.log('🔵 Iniciando conversa...');
            console.log('Body:', req.body);
            console.log('Sessão:', req.session.usuario);
            
            if (!req.session.usuario) {
                return res.status(401).json({ erro: 'Não autenticado' });
            }
            
            const { idAdestrador } = req.body;
            const idUsuario = req.session.usuario.id;
            const tipoUsuario = req.session.usuario.tipo;

            if (tipoUsuario !== 'cliente') {
                return res.status(403).json({ erro: 'Apenas clientes podem iniciar conversas' });
            }

            // Buscar id_cliente
            const { pool } = require('../../config/pool_conexoes');
            const [clientes] = await pool.query(
                'SELECT id_cliente FROM clientes WHERE ID_USUARIO = ?',
                [idUsuario]
            );
            
            if (!clientes || clientes.length === 0) {
                return res.status(404).json({ erro: 'Cliente não encontrado' });
            }

            const idConversa = await chatModel.criarOuBuscarConversa(clientes[0].id_cliente, idAdestrador);
            console.log('✅ Conversa criada/encontrada:', idConversa);
            res.json({ idConversa });
        } catch (erro) {
            console.error('❌ Erro ao iniciar conversa:', erro);
            res.status(500).json({ erro: 'Erro ao iniciar conversa: ' + erro.message });
        }
    },

    // Listar conversas do usuário
    async listarConversas(req, res) {
        try {
            if (!req.session.usuario) {
                return res.status(401).json({ erro: 'Não autenticado' });
            }
            
            const idUsuario = req.session.usuario.id;
            const tipoUsuario = req.session.usuario.tipo;

            const conversas = await chatModel.buscarConversas(idUsuario, tipoUsuario);
            res.json({ conversas });
        } catch (erro) {
            console.error('Erro ao listar conversas:', erro);
            res.status(500).json({ erro: 'Erro ao listar conversas' });
        }
    },

    // Buscar histórico de mensagens
    async buscarHistorico(req, res) {
        try {
            const { idConversa } = req.params;
            const mensagens = await chatModel.buscarMensagens(idConversa);
            res.json({ mensagens });
        } catch (erro) {
            console.error('Erro ao buscar histórico:', erro);
            res.status(500).json({ erro: 'Erro ao buscar histórico' });
        }
    },

    // Marcar como lida
    async marcarLida(req, res) {
        try {
            if (!req.session.usuario) {
                return res.status(401).json({ erro: 'Não autenticado' });
            }
            
            const { idConversa } = req.params;
            const idUsuario = req.session.usuario.id;
            
            await chatModel.marcarComoLida(idConversa, idUsuario);
            res.json({ sucesso: true });
        } catch (erro) {
            console.error('Erro ao marcar como lida:', erro);
            res.status(500).json({ erro: 'Erro ao marcar como lida' });
        }
    }
};

module.exports = chatController;
