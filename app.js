const express = require("express");
const session = require('express-session');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const { closePool } = require('./config/pool_conexoes');
const { inicializarSocket } = require('./app/services/socketService');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
require('dotenv').config();

const port = process.env.PORT || process.env.APP_PORT || 3000;

// Configurar arquivos estáticos
app.use(express.static("app/public"));
// Adicionar caminho alternativo para arquivos estáticos (caso precise)
app.use('/css', express.static(path.join(__dirname, 'app/public/css')));
app.use('/js', express.static(path.join(__dirname, 'app/public/js')));
app.use('/imagens', express.static(path.join(__dirname, 'app/public/imagens')));

// Configurar EJS
app.set("view engine", "ejs");
app.set("views", "./app/views");

// Middlewares para parsing
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Configurar sessões
const sessionMiddleware = session({
  secret: process.env.SECRET_KEY || 'petmania_secret_change_this',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // true em produção com HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
});
app.use(sessionMiddleware);

// Compartilhar sessão com Socket.io
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

// Middleware para disponibilizar usuário em todas as views
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  res.locals.cliente = req.session.usuario && req.session.usuario.tipo === 'cliente' ? req.session.usuario : null;
  res.locals.adestrador = req.session.usuario && req.session.usuario.tipo === 'adestrador' ? req.session.usuario : null;
  next();
});

// Middleware para log de requests (opcional - para debug)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Inicializar Socket.io
inicializarSocket(io);

// Rotas
var rotas = require("./app/routes/router");
app.use("/", rotas);

// Middleware de erro 404
app.use((req, res) => {
  console.log(`404 - Página não encontrada: ${req.path}`);
  res.status(404).send(`
    <h1>404 - Página não encontrada</h1>
    <p>A página "${req.path}" não foi encontrada.</p>
    <a href="/">Voltar ao início</a>
  `);
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('❌ Erro na aplicação:', err.stack);
  res.status(500).send(`
    <h1>500 - Erro interno do servidor</h1>
    <p>Algo deu errado! Tente novamente mais tarde.</p>
    <a href="/">Voltar ao início</a>
  `);
});

server.listen(port, () => {
  console.log(`🚀 Servidor Pet Mania iniciado com sucesso!`);
  console.log(`📍 Porta: ${port}`);
  console.log(`🌐 URL: http://localhost:${port}`);
  console.log(`💬 Socket.io ativado para chat em tempo real`);
  console.log(`⏰ Iniciado em: ${new Date().toISOString()}`);
});

// Gerenciamento gracioso de encerramento do servidor
process.on('SIGINT', async () => {
  console.log('\n🛑 Recebido sinal de interrupção (Ctrl+C), encerrando servidor...');
  
  server.close(async () => {
    console.log('🔒 Servidor HTTP fechado');
    
    try {
      await closePool();
      console.log('✅ Todas as conexões de banco foram fechadas');
      console.log('👋 Servidor encerrado com sucesso!');
      process.exit(0);
    } catch (error) {
      console.error('❌ Erro ao fechar conexões:', error);
      process.exit(1);
    }
  });
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Recebido sinal de terminação, encerrando servidor...');
  
  server.close(async () => {
    console.log('🔒 Servidor HTTP fechado');
    
    try {
      await closePool();
      console.log('✅ Todas as conexões de banco foram fechadas');
      console.log('👋 Servidor encerrado com sucesso!');
      process.exit(0);
    } catch (error) {
      console.error('❌ Erro ao fechar conexões:', error);
      process.exit(1);
    }
  });
});

// Capturar erros não tratados
process.on('uncaughtException', async (error) => {
  console.error('❌ Erro não tratado (uncaughtException):', error);
  try {
    await closePool();
  } catch (e) {
    console.error('Erro ao fechar pool:', e);
  }
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error('❌ Promise rejeitada não tratada (unhandledRejection):', reason);
  try {
    await closePool();
  } catch (e) {
    console.error('Erro ao fechar pool:', e);
  }
  process.exit(1);
});

module.exports = app;