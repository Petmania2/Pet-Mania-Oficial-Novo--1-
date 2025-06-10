const express = require("express");
const session = require('express-session');
const { closePool } = require('./config/pool_conexoes'); // Importar função de fechamento
const app = express();
require('dotenv').config();

const port = process.env.APP_PORT || 3000;

app.use(express.static("app/public"));

app.set("view engine", "ejs");
app.set("views", "./app/views");

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Configurar sessões
app.use(session({
  secret: process.env.SECRET_KEY || 'petmania',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 horas
}));

var rotas = require("./app/routes/router");
app.use("/", rotas);

const server = app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}\nhttp://localhost:${port}`);
});

// Gerenciamento gracioso de encerramento do servidor
process.on('SIGINT', async () => {
  console.log('\n🛑 Recebido sinal de interrupção, encerrando servidor...');
  
  server.close(async () => {
    console.log('🔒 Servidor HTTP fechado');
    
    try {
      await closePool();
      console.log('✅ Todas as conexões foram fechadas');
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
      console.log('✅ Todas as conexões foram fechadas');
      process.exit(0);
    } catch (error) {
      console.error('❌ Erro ao fechar conexões:', error);
      process.exit(1);
    }
  });
});

// Capturar erros não tratados
process.on('uncaughtException', async (error) => {
  console.error('❌ Erro não tratado:', error);
  try {
    await closePool();
  } catch (e) {
    console.error('Erro ao fechar pool:', e);
  }
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error('❌ Promise rejeitada não tratada:', reason);
  try {
    await closePool();
  } catch (e) {
    console.error('Erro ao fechar pool:', e);
  }
  process.exit(1);
});