const chatModel = require('../models/chatModel');

// Armazena usuários conectados: { userId: socketId }
const usuariosOnline = new Map();

function inicializarSocket(io) {
    io.on('connection', (socket) => {
        console.log('Usuário conectado:', socket.id);

        // Autenticar usuário
        socket.on('autenticar', (idUsuario) => {
            usuariosOnline.set(idUsuario, socket.id);
            socket.userId = idUsuario;
            console.log(`Usuário ${idUsuario} autenticado`);
            
            // Notificar status online
            socket.broadcast.emit('usuario_online', idUsuario);
        });

        // Entrar em uma conversa
        socket.on('entrar_conversa', (idConversa) => {
            socket.join(`conversa_${idConversa}`);
            console.log(`Usuário entrou na conversa ${idConversa}`);
        });

        // Enviar mensagem
        socket.on('enviar_mensagem', async (dados) => {
            try {
                const { idConversa, idRemetente, mensagem } = dados;

                // Salvar no banco
                const idMensagem = await chatModel.salvarMensagem(idConversa, idRemetente, mensagem);

                // Buscar dados do remetente
                const { pool } = require('../../config/pool_conexoes');
                const [usuario] = await pool.query(
                    'SELECT NOME_USUARIO FROM USUARIOS WHERE ID_USUARIO = ?',
                    [idRemetente]
                );

                const mensagemCompleta = {
                    id_mensagem: idMensagem,
                    id_conversa: idConversa,
                    id_remetente: idRemetente,
                    nome_remetente: usuario[0].NOME_USUARIO,
                    mensagem,
                    data_envio: new Date(),
                    lida: false
                };

                // Enviar para todos na conversa
                io.to(`conversa_${idConversa}`).emit('nova_mensagem', mensagemCompleta);
                
                console.log(`Mensagem enviada na conversa ${idConversa}`);
            } catch (erro) {
                console.error('Erro ao enviar mensagem:', erro);
                socket.emit('erro_mensagem', { erro: 'Erro ao enviar mensagem' });
            }
        });

        // Indicador de digitação
        socket.on('digitando', (dados) => {
            socket.to(`conversa_${dados.idConversa}`).emit('usuario_digitando', {
                idUsuario: dados.idUsuario,
                nome: dados.nome
            });
        });

        socket.on('parou_digitar', (dados) => {
            socket.to(`conversa_${dados.idConversa}`).emit('usuario_parou_digitar', {
                idUsuario: dados.idUsuario
            });
        });

        // Desconexão
        socket.on('disconnect', () => {
            if (socket.userId) {
                usuariosOnline.delete(socket.userId);
                socket.broadcast.emit('usuario_offline', socket.userId);
                console.log(`Usuário ${socket.userId} desconectado`);
            }
        });
    });
}

module.exports = { inicializarSocket, usuariosOnline };
