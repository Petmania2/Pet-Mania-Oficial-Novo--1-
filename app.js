const express = require("express");
const session = require('express-session');
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

app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}\nhttp://localhost:${port}`);
});