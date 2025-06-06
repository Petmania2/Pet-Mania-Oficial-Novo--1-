var express = require("express");
var router = express.Router();


router.get("/", 
    function (req, res) {
    res.render("pages/index");    
});

router.get("/Cadastroadestrador.ejs", 
    function (req, res) {
    res.render("pages/Cadastroadestrador.ejs");    
});

// Nova rota para cadastro de cliente (caso precise)
router.get("/cliente.ejs", 
    function (req, res) {
    res.render("pages/cliente.ejs");    
});

router.get("/agendamentoadestrador.ejs", 
    function (req, res) {
    res.render("pages/agendamentoadestrador.ejs");    
});

router.get("/clienteadestrador.ejs", 
    function (req, res) {
    res.render("pages/clienteadestrador.ejs");    
});

router.get("/Login.ejs", 
    function (req, res) {
    res.render("pages/Login.ejs");    
});

router.get("/mensagensadestrador.ejs", 
    function (req, res) {
    res.render("pages/mensagensadestrador.ejs");    
});

router.get("/paineladestrador.ejs", 
    function (req, res) {
    res.render("pages/paineladestrador.ejs");    
});

router.get("/perfiladestrador.ejs", 
    function (req, res) {
    res.render("pages/perfiladestrador.ejs");    
});

router.get("/planosadestrador.ejs", 
    function (req, res) {
    res.render("pages/planosadestrador.ejs");    
});

router.get("/tipodeusuario.ejs", 
    function (req, res) {
    res.render("pages/tipodeusuario.ejs");    
});

router.get("/clientesadestrador.ejs", 
    function (req, res) {
    res.render("pages/clientesadestrador.ejs");    
});

router.get("/index.ejs", 
    function (req, res) {
    res.render("pages/index.ejs");    
});











router.post("/exibir", 
    function (req, res) {

    var Nome = req.body.Nome;
    var Email = req.body.Nmail;

    res.json({"nomeusuario":Nome, 
        "emailusuario":Email
    })

});

router.post("/", (req, res)=>{
    let objJson = {nome:req.body.Nome, Email:req.body.Email} 

    res.render("pages/mostrar", {dadosEnviados:objJson});
})
-----------------------------------------------------

// // module.exports = router;

// var express = require("express");
// var router = express.Router();

// // Importar conexão com banco de dados
// var fabricaDeConexao = require("../database/connection"); // Ajuste o caminho conforme sua estrutura
// var conexao = fabricaDeConexao();

// // Importar controllers (se você tiver)
// // const usuarioController = require('../controllers/usuarioController');

// // Middleware para verificar se usuário está autenticado
// const verificarUsuAutenticado = (req, res, next) => {
//     if (req.session && req.session.autenticado) {
//         return next();
//     }
//     res.redirect('/Login.ejs');
// };

// // Middleware para verificar se usuário NÃO está autenticado
// const verificarUsuNaoAutenticado = (req, res, next) => {
//     if (req.session && req.session.autenticado) {
//         return res.redirect('/paineladestrador.ejs');
//     }
//     next();
// };

// // Função auxiliar para converter status em texto
// function getStatusTexto(status) {
//     switch (status) {
//         case 0:
//             return 'Pendente';
//         case 1:
//             return 'Aprovado';
//         case 2:
//             return 'Rejeitado';
//         default:
//             return 'Desconhecido';
//     }
// }

// // ==========================================
// // ROTAS PRINCIPAIS E PÁGINAS
// // ==========================================

// // Rota principal
// router.get("/", 
//     function (req, res) {
//         res.render("pages/index", {
//             autenticado: req.session.autenticado || null
//         });    
//     }
// );

// // Rotas para páginas estáticas (GET)
// router.get("/Cadastroadestrador.ejs", verificarUsuNaoAutenticado,
//     function (req, res) {
//         res.render("pages/Cadastroadestrador", {
//             listaErros: null,
//             dadosNotificacao: null,
//             valores: null
//         });    
//     }
// );

// router.get("/cliente.ejs", verificarUsuNaoAutenticado,
//     function (req, res) {
//         res.render("pages/cliente", {
//             listaErros: null,
//             dadosNotificacao: null,
//             valores: null
//         });    
//     }
// );

// router.get("/Login.ejs", verificarUsuNaoAutenticado,
//     function (req, res) {
//         res.render("pages/Login", {
//             listaErros: null,
//             dadosNotificacao: null,
//             valores: null
//         });    
//     }
// );

// router.get("/tipodeusuario.ejs", verificarUsuNaoAutenticado,
//     function (req, res) {
//         res.render("pages/tipodeusuario");    
//     }
// );

// router.get("/index.ejs", 
//     function (req, res) {
//         res.render("pages/index", {
//             autenticado: req.session.autenticado || null
//         });    
//     }
// );

// // Rotas protegidas (precisam de autenticação)
// router.get("/agendamentoadestrador.ejs", verificarUsuAutenticado,
//     function (req, res) {
//         res.render("pages/agendamentoadestrador", {
//             autenticado: req.session.autenticado
//         });    
//     }
// );

// router.get("/clienteadestrador.ejs", verificarUsuAutenticado,
//     function (req, res) {
//         res.render("pages/clienteadestrador", {
//             autenticado: req.session.autenticado
//         });    
//     }
// );

// router.get("/mensagensadestrador.ejs", verificarUsuAutenticado,
//     function (req, res) {
//         res.render("pages/mensagensadestrador", {
//             autenticado: req.session.autenticado
//         });    
//     }
// );

// router.get("/paineladestrador.ejs", verificarUsuAutenticado,
//     function (req, res) {
//         res.render("pages/paineladestrador", {
//             autenticado: req.session.autenticado,
//             dadosNotificacao: null
//         });    
//     }
// );

// router.get("/perfiladestrador.ejs", verificarUsuAutenticado,
//     function (req, res) {
//         res.render("pages/perfiladestrador", {
//             autenticado: req.session.autenticado
//         });    
//     }
// );

// router.get("/planosadestrador.ejs", verificarUsuAutenticado,
//     function (req, res) {
//         res.render("pages/planosadestrador", {
//             autenticado: req.session.autenticado
//         });    
//     }
// );

// router.get("/clientesadestrador.ejs", verificarUsuAutenticado,
//     function (req, res) {
//         res.render("pages/clientesadestrador", {
//             autenticado: req.session.autenticado
//         });    
//     }
// );

// // ==========================================
// // ROTAS DE VALIDAÇÃO E GERENCIAMENTO DE ADESTRADORES
// // ==========================================

// // Rota para listar adestradores pendentes de aprovação
// router.get("/adestradores-pendentes", verificarUsuAutenticado, function (req, res) {
//     // Verifica se o usuário logado é um administrador ou adestrador aprovado
//     if (!req.session.autenticado || req.session.autenticado.tipo !== 'adestrador') {
//         return res.redirect('/Login.ejs');
//     }

//     const queryPendentes = `
//         SELECT id, nome, email, telefone, especialidade, created_at 
//         FROM adestradores 
//         WHERE status = 0 
//         ORDER BY created_at DESC
//     `;

//     conexao.query(queryPendentes, (err, results) => {
//         if (err) {
//             console.error("Erro ao buscar adestradores pendentes:", err);
//             return res.render("pages/adestradores-pendentes", {
//                 autenticado: req.session.autenticado,
//                 adestradores: [],
//                 dadosNotificacao: {
//                     titulo: "Erro",
//                     mensagem: "Erro ao carregar adestradores pendentes",
//                     tipo: "error"
//                 }
//             });
//         }

//         res.render("pages/adestradores-pendentes", {
//             autenticado: req.session.autenticado,
//             adestradores: results,
//             dadosNotificacao: null
//         });
//     });
// });

// // Rota para listar todos os adestradores com seus status
// router.get("/gerenciar-adestradores", verificarUsuAutenticado, function (req, res) {
//     // Verifica se o usuário logado tem permissão
//     if (!req.session.autenticado || req.session.autenticado.tipo !== 'adestrador') {
//         return res.redirect('/Login.ejs');
//     }

//     const queryTodos = `
//         SELECT id, nome, email, telefone, especialidade, status, created_at,
//                approved_at, rejected_at, rejection_reason
//         FROM adestradores 
//         ORDER BY created_at DESC
//     `;

//     conexao.query(queryTodos, (err, results) => {
//         if (err) {
//             console.error("Erro ao buscar adestradores:", err);
//             return res.render("pages/gerenciar-adestradores", {
//                 autenticado: req.session.autenticado,
//                 adestradores: [],
//                 dadosNotificacao: {
//                     titulo: "Erro",
//                     mensagem: "Erro ao carregar adestradores",
//                     tipo: "error"
//                 }
//             });
//         }

//         // Adiciona descrição do status
//         const adestradoresComStatus = results.map(adestrador => ({
//             ...adestrador,
//             statusTexto: getStatusTexto(adestrador.status)
//         }));

//         res.render("pages/gerenciar-adestradores", {
//             autenticado: req.session.autenticado,
//             adestradores: adestradoresComStatus,
//             dadosNotificacao: null
//         });
//     });
// });

// // Rota para buscar detalhes de um adestrador específico
// router.get("/adestrador-detalhes/:id", verificarUsuAutenticado, function (req, res) {
//     const adestradorId = req.params.id;

//     // Verifica se o usuário logado tem permissão
//     if (!req.session.autenticado || req.session.autenticado.tipo !== 'adestrador') {
//         return res.status(403).json({ 
//             sucesso: false, 
//             mensagem: "Acesso negado" 
//         });
//     }

//     const queryDetalhes = `
//         SELECT id, nome, email, telefone, especialidade, status, created_at,
//                approved_at, rejected_at, rejection_reason
//         FROM adestradores 
//         WHERE id = ?
//     `;

//     conexao.query(queryDetalhes, [adestradorId], (err, results) => {
//         if (err) {
//             console.error("Erro ao buscar detalhes do adestrador:", err);
//             return res.status(500).json({ 
//                 sucesso: false, 
//                 mensagem: "Erro interno do servidor" 
//             });
//         }

//         if (results.length === 0) {
//             return res.status(404).json({ 
//                 sucesso: false, 
//                 mensagem: "Adestrador não encontrado" 
//             });
//         }

//         const adestrador = {
//             ...results[0],
//             statusTexto: getStatusTexto(results[0].status)
//         };

//         res.json({ 
//             sucesso: true, 
//             adestrador: adestrador 
//         });
//     });
// });

// // ==========================================
// // ROTAS POST PARA PROCESSAR FORMULÁRIOS
// // ==========================================

// // Cadastro de adestrador
// router.post("/cadastrar-adestrador", async (req, res) => {
//     try {
//         const { nome, email, telefone, senha, especialidade } = req.body;
        
//         // Validação básica
//         if (!nome || !email || !senha) {
//             return res.render("pages/Cadastroadestrador", {
//                 listaErros: [{ msg: "Nome, email e senha são obrigatórios" }],
//                 dadosNotificacao: null,
//                 valores: req.body
//             });
//         }

//         // Verificar se email já existe
//         const queryVerificar = "SELECT * FROM adestradores WHERE email = ?";
//         conexao.query(queryVerificar, [email], (err, results) => {
//             if (err) {
//                 console.error("Erro ao verificar email:", err);
//                 return res.render("pages/Cadastroadestrador", {
//                     listaErros: null,
//                     dadosNotificacao: {
//                         titulo: "Erro",
//                         mensagem: "Erro interno do servidor",
//                         tipo: "error"
//                     },
//                     valores: req.body
//                 });
//             }

//             if (results.length > 0) {
//                 return res.render("pages/Cadastroadestrador", {
//                     listaErros: [{ msg: "Este email já está cadastrado" }],
//                     dadosNotificacao: null,
//                     valores: req.body
//                 });
//             }

//             // Inserir novo adestrador
//             const queryInserir = `
//                 INSERT INTO adestradores (nome, email, telefone, senha, especialidade, status, created_at) 
//                 VALUES (?, ?, ?, ?, ?, 0, NOW())
//             `;
            
//             // Hash da senha (você deve usar bcrypt)
//             const bcrypt = require('bcryptjs');
//             const senhaHash = bcrypt.hashSync(senha, 10);

//             conexao.query(queryInserir, [nome, email, telefone, senhaHash, especialidade], (err, result) => {
//                 if (err) {
//                     console.error("Erro ao cadastrar adestrador:", err);
//                     return res.render("pages/Cadastroadestrador", {
//                         listaErros: null,
//                         dadosNotificacao: {
//                             titulo: "Erro",
//                             mensagem: "Erro ao cadastrar. Tente novamente.",
//                             tipo: "error"
//                         },
//                         valores: req.body
//                     });
//                 }

//                 res.render("pages/Cadastroadestrador", {
//                     listaErros: null,
//                     dadosNotificacao: {
//                         titulo: "Sucesso!",
//                         mensagem: "Adestrador cadastrado com sucesso! Aguarde aprovação.",
//                         tipo: "success"
//                     },
//                     valores: null
//                 });
//             });
//         });

//     } catch (error) {
//         console.error("Erro no cadastro:", error);
//         res.render("pages/Cadastroadestrador", {
//             listaErros: null,
//             dadosNotificacao: {
//                 titulo: "Erro",
//                 mensagem: "Erro interno do servidor",
//                 tipo: "error"
//             },
//             valores: req.body
//         });
//     }
// });

// // Cadastro de cliente
// router.post("/cadastrar-cliente", async (req, res) => {
//     try {
//         const { nome, email, telefone, senha, endereco } = req.body;
        
//         if (!nome || !email || !senha) {
//             return res.render("pages/cliente", {
//                 listaErros: [{ msg: "Nome, email e senha são obrigatórios" }],
//                 dadosNotificacao: null,
//                 valores: req.body
//             });
//         }

//         // Verificar se email já existe
//         const queryVerificar = "SELECT * FROM clientes WHERE email = ?";
//         conexao.query(queryVerificar, [email], (err, results) => {
//             if (err) {
//                 console.error("Erro ao verificar email:", err);
//                 return res.render("pages/cliente", {
//                     listaErros: null,
//                     dadosNotificacao: {
//                         titulo: "Erro",
//                         mensagem: "Erro interno do servidor",
//                         tipo: "error"
//                     },
//                     valores: req.body
//                 });
//             }

//             if (results.length > 0) {
//                 return res.render("pages/cliente", {
//                     listaErros: [{ msg: "Este email já está cadastrado" }],
//                     dadosNotificacao: null,
//                     valores: req.body
//                 });
//             }

//             // Inserir novo cliente
//             const queryInserir = `
//                 INSERT INTO clientes (nome, email, telefone, senha, endereco, status, created_at) 
//                 VALUES (?, ?, ?, ?, ?, 1, NOW())
//             `;
            
//             const bcrypt = require('bcryptjs');
//             const senhaHash = bcrypt.hashSync(senha, 10);

//             conexao.query(queryInserir, [nome, email, telefone, senhaHash, endereco], (err, result) => {
//                 if (err) {
//                     console.error("Erro ao cadastrar cliente:", err);
//                     return res.render("pages/cliente", {
//                         listaErros: null,
//                         dadosNotificacao: {
//                             titulo: "Erro",
//                             mensagem: "Erro ao cadastrar. Tente novamente.",
//                             tipo: "error"
//                         },
//                         valores: req.body
//                     });
//                 }

//                 res.render("pages/cliente", {
//                     listaErros: null,
//                     dadosNotificacao: {
//                         titulo: "Sucesso!",
//                         mensagem: "Cliente cadastrado com sucesso!",
//                         tipo: "success"
//                     },
//                     valores: null
//                 });
//             });
//         });

//     } catch (error) {
//         console.error("Erro no cadastro:", error);
//         res.render("pages/cliente", {
//             listaErros: null,
//             dadosNotificacao: {
//                 titulo: "Erro",
//                 mensagem: "Erro interno do servidor",
//                 tipo: "error"
//             },
//             valores: req.body
//         });
//     }
// });

// // Login
// router.post("/login", async (req, res) => {
//     try {
//         const { email, senha, tipo_usuario } = req.body;

//         if (!email || !senha || !tipo_usuario) {
//             return res.render("pages/Login", {
//                 listaErros: [{ msg: "Todos os campos são obrigatórios" }],
//                 dadosNotificacao: null,
//                 valores: req.body
//             });
//         }

//         const tabela = tipo_usuario === 'adestrador' ? 'adestradores' : 'clientes';
//         const queryLogin = `SELECT * FROM ${tabela} WHERE email = ? AND status = 1`;

//         conexao.query(queryLogin, [email], (err, results) => {
//             if (err) {
//                 console.error("Erro no login:", err);
//                 return res.render("pages/Login", {
//                     listaErros: null,
//                     dadosNotificacao: {
//                         titulo: "Erro",
//                         mensagem: "Erro interno do servidor",
//                         tipo: "error"
//                     },
//                     valores: req.body
//                 });
//             }

//             if (results.length === 0) {
//                 return res.render("pages/Login", {
//                     listaErros: [{ msg: "Email ou senha incorretos, ou conta não ativada" }],
//                     dadosNotificacao: null,
//                     valores: req.body
//                 });
//             }

//             const usuario = results[0];
//             const bcrypt = require('bcryptjs');
            
//             if (!bcrypt.compareSync(senha, usuario.senha)) {
//                 return res.render("pages/Login", {
//                     listaErros: [{ msg: "Email ou senha incorretos" }],
//                     dadosNotificacao: null,
//                     valores: req.body
//                 });
//             }

//             // Login bem-sucedido
//             req.session.autenticado = {
//                 id: usuario.id,
//                 nome: usuario.nome,
//                 email: usuario.email,
//                 tipo: tipo_usuario
//             };

//             // Redirecionar baseado no tipo de usuário
//             if (tipo_usuario === 'adestrador') {
//                 res.redirect('/paineladestrador.ejs');
//             } else {
//                 res.redirect('/'); // ou dashboard do cliente
//             }
//         });

//     } catch (error) {
//         console.error("Erro no login:", error);
//         res.render("pages/Login", {
//             listaErros: null,
//             dadosNotificacao: {
//                 titulo: "Erro",
//                 mensagem: "Erro interno do servidor",
//                 tipo: "error"
//             },
//             valores: req.body
//         });
//     }
// });

// // Rota para aprovar adestrador
// router.post("/aprovar-adestrador/:id", verificarUsuAutenticado, async (req, res) => {
//     try {
//         const adestradorId = req.params.id;

//         // Verifica se o usuário logado tem permissão
//         if (!req.session.autenticado || req.session.autenticado.tipo !== 'adestrador') {
//             return res.status(403).json({ 
//                 sucesso: false, 
//                 mensagem: "Acesso negado" 
//             });
//         }

//         // Verifica se o adestrador existe e está pendente
//         const queryVerificar = "SELECT * FROM adestradores WHERE id = ? AND status = 0";
//         conexao.query(queryVerificar, [adestradorId], (err, results) => {
//             if (err) {
//                 console.error("Erro ao verificar adestrador:", err);
//                 return res.status(500).json({ 
//                     sucesso: false, 
//                     mensagem: "Erro interno do servidor" 
//                 });
//             }

//             if (results.length === 0) {
//                 return res.status(404).json({ 
//                     sucesso: false, 
//                     mensagem: "Adestrador não encontrado ou já processado" 
//                 });
//             }

//             // Atualiza o status para aprovado (1)
//             const queryAprovar = "UPDATE adestradores SET status = 1, approved_at = NOW() WHERE id = ?";
//             conexao.query(queryAprovar, [adestradorId], (err, result) => {
//                 if (err) {
//                     console.error("Erro ao aprovar adestrador:", err);
//                     return res.status(500).json({ 
//                         sucesso: false, 
//                         mensagem: "Erro ao aprovar adestrador" 
//                     });
//                 }

//                 res.json({ 
//                     sucesso: true, 
//                     mensagem: "Adestrador aprovado com sucesso!" 
//                 });
//             });
//         });

//     } catch (error) {
//         console.error("Erro ao aprovar adestrador:", error);
//         res.status(500).json({ 
//             sucesso: false, 
//             mensagem: "Erro interno do servidor" 
//         });
//     }
// });

// // Rota para rejeitar adestrador
// router.post("/rejeitar-adestrador/:id", verificarUsuAutenticado, async (req, res) => {
//     try {
//         const adestradorId = req.params.id;
//         const { motivo } = req.body;

//         // Verifica se o usuário logado tem permissão
//         if (!req.session.autenticado || req.session.autenticado.tipo !== 'adestrador') {
//             return res.status(403).json({ 
//                 sucesso: false, 
//                 mensagem: "Acesso negado" 
//             });
//         }

//         // Verifica se o adestrador existe e está pendente
//         const queryVerificar = "SELECT * FROM adestradores WHERE id = ? AND status = 0";
//         conexao.query(queryVerificar, [adestradorId], (err, results) => {
//             if (err) {
//                 console.error("Erro ao verificar adestrador:", err);
//                 return res.status(500).json({ 
//                     sucesso: false, 
//                     mensagem: "Erro interno do servidor" 
//                 });
//             }

//             if (results.length === 0) {
//                 return res.status(404).json({ 
//                     sucesso: false, 
//                     mensagem: "Adestrador não encontrado ou já processado" 
//                 });
//             }

//             // Atualiza o status para rejeitado (2) e adiciona motivo
//             const queryRejeitar = `
//                 UPDATE adestradores 
//                 SET status = 2, rejected_at = NOW(), rejection_reason = ? 
//                 WHERE id = ?
//             `;
//             conexao.query(queryRejeitar, [motivo || 'Não especificado', adestradorId], (err, result) => {
//                 if (err) {
//                     console.error("Erro ao rejeitar adestrador:", err);
//                     return res.status(500).json({ 
//                         sucesso: false, 
//                         mensagem: "Erro ao rejeitar adestrador" 
//                     });
//                 }

//                 res.json({ 
//                     sucesso: true, 
//                     mensagem: "Adestrador rejeitado com sucesso!" 
//                 });
//             });
//         });

//     } catch (error) {
//         console.error("Erro ao rejeitar adestrador:", error);
//         res.status(500).json({ 
//             sucesso: false, 
//             mensagem: "Erro interno do servidor" 
//         });
//     }
// });

// // Logout
// router.get("/logout", (req, res) => {
//     req.session.destroy((err) => {
//         if (err) {
//             console.error("Erro ao fazer logout:", err);
//         }
//         res.redirect('/');
//     });
// });

// // ==========================================
// // ROTAS CRUD PARA TAREFAS
// // ==========================================

// // SELECT - Listar todas as tarefas
// router.get("/select", function (req, res) {
//     conexao.query("SELECT * FROM tarefas", function (error, results) {
//         console.log(results);
//         console.log(error);
//         if (error) {
//             return res.json({ erro: error });
//         }
//         res.json({ tarefas: results });
//     });
// });

// // INSERT - Criar nova tarefa
// router.get("/insert", function (req, res) {
//     const dadosParaInserir = {
//         "nome_tarefa": "Formatar PC do Cliente 3",
//         "prazo_tarefa": "2022-06-25",
//         "situacao_tarefa": 1
//     };
    
//     conexao.query("INSERT INTO tarefas SET ?", [dadosParaInserir], function (error, results) {
//         console.log(results);
//         console.log(error);
//         if (error) {
//             return res.json({ erro: error });
//         }
//         res.json({ tarefas: results });
//     });
// });

// // UPDATE - Atualizar tarefa
// router.get("/update", function (req, res) {
//     const dadosParaAlterar = {
//         "nome_tarefa": "Formatar PC do Cliente 3.1",
//         "prazo_tarefa": "2023-12-25",
//         "situacao_tarefa": 0
//     };
    
//     const id_tarefa = 5;
//     conexao.query("UPDATE tarefas SET ? WHERE id_tarefa = ?", [dadosParaAlterar, id_tarefa], function (error, results) {
//         console.log(results);
//         console.log(error);
//         if (error) {
//             return res.json({ erro: error });
//         }
//         res.json({ tarefas: results });
//     });
// });

// // DELETE - Deletar tarefa por ID
// router.get("/delete-1", function (req, res) {
//     const id_tarefa = 3;
//     conexao.query("UPDATE tarefas SET status_tarefa = 0 WHERE id_tarefa = ?", [id_tarefa], function (error, results) {
//         console.log(results);
//         console.log(error);
//         if (error) {
//             return res.json({ erro: error });
//         }
//         res.json({ tarefas: results });
//     });
// });

// // DELETE - Deletar tarefa permanentemente
// router.get("/delete-f", function (req, res) {
//     const id_tarefa = 6;
//     conexao.query("DELETE FROM tarefas WHERE id_tarefa = ?", [id_tarefa], function (error, results) {
//         console.log(results);
//         console.log(error);
//         if (error) {
//             return res.json({ erro: error });
//         }
//         res.json({ tarefas: results });
//     });
// });

// // ==========================================
// // ROTAS EXISTENTES (mantidas)
// // ==========================================

// router.post("/exibir", 
//     function (req, res) {
//         var nome = req.body.nome;
//         var email = req.body.email;
//         res.json({
//             "nomeusuario": nome, 
//             "emailusuario": email
//         });
//     }
// );

// router.post("/", (req, res) => {
//     let objJson = { nome: req.body.nome, email: req.body.email };
//     res.render("pages/mostrar", { dadosEnviados: objJson });
// });

// module.exports = router;

// /*
// ==========================================
// ALTERAÇÕES NECESSÁRIAS NO BANCO DE DADOS
// ==========================================

// Para implementar completamente este sistema, você precisa executar os seguintes comandos SQL:

// -- Adicionar colunas na tabela 'adestradores':
// ALTER TABLE adestradores ADD COLUMN approved_at TIMESTAMP NULL;
// ALTER TABLE adestradores ADD COLUMN rejected_at TIMESTAMP NULL;
// ALTER TABLE adestradores ADD COLUMN rejection_reason TEXT NULL;

// -- Verificar se as colunas 'status' e 'created_at' existem:
// -- Se não existirem, adicione:
// ALTER TABLE adestradores ADD COLUMN status INT DEFAULT 0;
// ALTER TABLE adestradores ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

// -- Também para a tabela 'clientes':
// ALTER TABLE clientes ADD COLUMN status INT DEFAULT 1;
// ALTER TABLE clientes ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

// Status do adestrador:
// - 0: Pendente de aprovação
// - 1: Aprovado
// - 2: Rejeitado

// Status do cliente:
// - 1: Ativo (aprovado automaticamente)
// - 0: Inativo

// ==========================================
// DEPENDÊNCIAS NECESSÁRIAS
// ==========================================

// Certifique-se de ter instalado:
// npm install bcryptjs express express-session

// ==========================================
// ESTRUTURA DE ARQUIVOS NECESSÁRIA
// ==========================================

// views/pages/
// ├── adestradores-pendentes.ejs
// ├── gerenciar-adestradores.ejs
// ├── Cadastroadestrador.ejs
// ├── cliente.ejs
// ├── Login.ejs
// ├── tipodeusuario.ejs
// ├── index.ejs
// ├── agendamentoadestrador.ejs
// ├── clienteadestrador.ejs
// ├── mensagensadestrador.ejs
// ├── paineladestrador.ejs
// ├── perfiladestrador.ejs
// ├── planosadestrador.ejs
// ├── clientesadestrador.ejs
// └── mostrar.ejs
// */


