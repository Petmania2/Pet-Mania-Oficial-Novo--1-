// var express = require("express");
// var router = express.Router();


// router.get("/", 
//     function (req, res) {
//     res.render("pages/index");    
// });

// router.get("/Cadastroadestrador.ejs", 
//     function (req, res) {
//     res.render("pages/Cadastroadestrador.ejs");    
// });

// // Nova rota para cadastro de cliente (caso precise)
// router.get("/cliente.ejs", 
//     function (req, res) {
//     res.render("pages/cliente.ejs");    
// });

// router.get("/agendamentoadestrador.ejs", 
//     function (req, res) {
//     res.render("pages/agendamentoadestrador.ejs");    
// });

// router.get("/clienteadestrador.ejs", 
//     function (req, res) {
//     res.render("pages/clienteadestrador.ejs");    
// });

// router.get("/Login.ejs", 
//     function (req, res) {
//     res.render("pages/Login.ejs");    
// });

// router.get("/mensagensadestrador.ejs", 
//     function (req, res) {
//     res.render("pages/mensagensadestrador.ejs");    
// });

// router.get("/paineladestrador.ejs", 
//     function (req, res) {
//     res.render("pages/paineladestrador.ejs");    
// });

// router.get("/perfiladestrador.ejs", 
//     function (req, res) {
//     res.render("pages/perfiladestrador.ejs");    
// });

// router.get("/planosadestrador.ejs", 
//     function (req, res) {
//     res.render("pages/planosadestrador.ejs");    
// });

// router.get("/tipodeusuario.ejs", 
//     function (req, res) {
//     res.render("pages/tipodeusuario.ejs");    
// });

// router.get("/clientesadestrador.ejs", 
//     function (req, res) {
//     res.render("pages/clientesadestrador.ejs");    
// });

// router.get("/index.ejs", 
//     function (req, res) {
//     res.render("pages/index.ejs");    
// });











// router.post("/exibir", 
//     function (req, res) {

//     var nome = req.body.nome;
//     var email = req.body.email;

//     res.json({"nomeusuario":nome, 
//         "emailusuario":email
//     })

// });

// router.post("/", (req, res)=>{
//     let objJson = {nome:req.body.nome, email:req.body.email} 

//     res.render("pages/mostrar", {dadosEnviados:objJson});
// })


// module.exports = router;

var express = require("express");
var router = express.Router();

// Importar conexão com banco de dados
var fabricaDeConexao = require("../database/connection"); // Ajuste o caminho conforme sua estrutura
var conexao = fabricaDeConexao();

// Importar controllers (se você tiver)
// const usuarioController = require('../controllers/usuarioController');

// Middleware para verificar se usuário está autenticado
const verificarUsuAutenticado = (req, res, next) => {
    if (req.session && req.session.autenticado) {
        return next();
    }
    res.redirect('/Login.ejs');
};

// Middleware para verificar se usuário NÃO está autenticado
const verificarUsuNaoAutenticado = (req, res, next) => {
    if (req.session && req.session.autenticado) {
        return res.redirect('/paineladestrador.ejs');
    }
    next();
};

// Rota principal
router.get("/", 
    function (req, res) {
        res.render("pages/index", {
            autenticado: req.session.autenticado || null
        });    
    }
);

// Rotas para páginas estáticas (GET)
router.get("/Cadastroadestrador.ejs", verificarUsuNaoAutenticado,
    function (req, res) {
        res.render("pages/Cadastroadestrador", {
            listaErros: null,
            dadosNotificacao: null,
            valores: null
        });    
    }
);

router.get("/cliente.ejs", verificarUsuNaoAutenticado,
    function (req, res) {
        res.render("pages/cliente", {
            listaErros: null,
            dadosNotificacao: null,
            valores: null
        });    
    }
);

router.get("/Login.ejs", verificarUsuNaoAutenticado,
    function (req, res) {
        res.render("pages/Login", {
            listaErros: null,
            dadosNotificacao: null,
            valores: null
        });    
    }
);

router.get("/tipodeusuario.ejs", verificarUsuNaoAutenticado,
    function (req, res) {
        res.render("pages/tipodeusuario");    
    }
);

router.get("/index.ejs", 
    function (req, res) {
        res.render("pages/index", {
            autenticado: req.session.autenticado || null
        });    
    }
);

// Rotas protegidas (precisam de autenticação)
router.get("/agendamentoadestrador.ejs", verificarUsuAutenticado,
    function (req, res) {
        res.render("pages/agendamentoadestrador", {
            autenticado: req.session.autenticado
        });    
    }
);

router.get("/clienteadestrador.ejs", verificarUsuAutenticado,
    function (req, res) {
        res.render("pages/clienteadestrador", {
            autenticado: req.session.autenticado
        });    
    }
);

router.get("/mensagensadestrador.ejs", verificarUsuAutenticado,
    function (req, res) {
        res.render("pages/mensagensadestrador", {
            autenticado: req.session.autenticado
        });    
    }
);

router.get("/paineladestrador.ejs", verificarUsuAutenticado,
    function (req, res) {
        res.render("pages/paineladestrador", {
            autenticado: req.session.autenticado,
            dadosNotificacao: null
        });    
    }
);

router.get("/perfiladestrador.ejs", verificarUsuAutenticado,
    function (req, res) {
        res.render("pages/perfiladestrador", {
            autenticado: req.session.autenticado
        });    
    }
);

router.get("/planosadestrador.ejs", verificarUsuAutenticado,
    function (req, res) {
        res.render("pages/planosadestrador", {
            autenticado: req.session.autenticado
        });    
    }
);

router.get("/clientesadestrador.ejs", verificarUsuAutenticado,
    function (req, res) {
        res.render("pages/clientesadestrador", {
            autenticado: req.session.autenticado
        });    
    }
);

// Rotas POST para processar formulários

// Cadastro de adestrador
router.post("/cadastrar-adestrador", async (req, res) => {
    try {
        const { nome, email, telefone, senha, especialidade } = req.body;
        
        // Validação básica
        if (!nome || !email || !senha) {
            return res.render("pages/Cadastroadestrador", {
                listaErros: [{ msg: "Nome, email e senha são obrigatórios" }],
                dadosNotificacao: null,
                valores: req.body
            });
        }

        // Verificar se email já existe
        const queryVerificar = "SELECT * FROM adestradores WHERE email = ?";
        conexao.query(queryVerificar, [email], (err, results) => {
            if (err) {
                console.error("Erro ao verificar email:", err);
                return res.render("pages/Cadastroadestrador", {
                    listaErros: null,
                    dadosNotificacao: {
                        titulo: "Erro",
                        mensagem: "Erro interno do servidor",
                        tipo: "error"
                    },
                    valores: req.body
                });
            }

            if (results.length > 0) {
                return res.render("pages/Cadastroadestrador", {
                    listaErros: [{ msg: "Este email já está cadastrado" }],
                    dadosNotificacao: null,
                    valores: req.body
                });
            }

            // Inserir novo adestrador
            const queryInserir = `
                INSERT INTO adestradores (nome, email, telefone, senha, especialidade, status, created_at) 
                VALUES (?, ?, ?, ?, ?, 0, NOW())
            `;
            
            // Hash da senha (você deve usar bcrypt)
            const bcrypt = require('bcryptjs');
            const senhaHash = bcrypt.hashSync(senha, 10);

            conexao.query(queryInserir, [nome, email, telefone, senhaHash, especialidade], (err, result) => {
                if (err) {
                    console.error("Erro ao cadastrar adestrador:", err);
                    return res.render("pages/Cadastroadestrador", {
                        listaErros: null,
                        dadosNotificacao: {
                            titulo: "Erro",
                            mensagem: "Erro ao cadastrar. Tente novamente.",
                            tipo: "error"
                        },
                        valores: req.body
                    });
                }

                res.render("pages/Cadastroadestrador", {
                    listaErros: null,
                    dadosNotificacao: {
                        titulo: "Sucesso!",
                        mensagem: "Adestrador cadastrado com sucesso! Aguarde aprovação.",
                        tipo: "success"
                    },
                    valores: null
                });
            });
        });

    } catch (error) {
        console.error("Erro no cadastro:", error);
        res.render("pages/Cadastroadestrador", {
            listaErros: null,
            dadosNotificacao: {
                titulo: "Erro",
                mensagem: "Erro interno do servidor",
                tipo: "error"
            },
            valores: req.body
        });
    }
});

// Cadastro de cliente
router.post("/cadastrar-cliente", async (req, res) => {
    try {
        const { nome, email, telefone, senha, endereco } = req.body;
        
        if (!nome || !email || !senha) {
            return res.render("pages/cliente", {
                listaErros: [{ msg: "Nome, email e senha são obrigatórios" }],
                dadosNotificacao: null,
                valores: req.body
            });
        }

        // Verificar se email já existe
        const queryVerificar = "SELECT * FROM clientes WHERE email = ?";
        conexao.query(queryVerificar, [email], (err, results) => {
            if (err) {
                console.error("Erro ao verificar email:", err);
                return res.render("pages/cliente", {
                    listaErros: null,
                    dadosNotificacao: {
                        titulo: "Erro",
                        mensagem: "Erro interno do servidor",
                        tipo: "error"
                    },
                    valores: req.body
                });
            }

            if (results.length > 0) {
                return res.render("pages/cliente", {
                    listaErros: [{ msg: "Este email já está cadastrado" }],
                    dadosNotificacao: null,
                    valores: req.body
                });
            }

            // Inserir novo cliente
            const queryInserir = `
                INSERT INTO clientes (nome, email, telefone, senha, endereco, status, created_at) 
                VALUES (?, ?, ?, ?, ?, 1, NOW())
            `;
            
            const bcrypt = require('bcryptjs');
            const senhaHash = bcrypt.hashSync(senha, 10);

            conexao.query(queryInserir, [nome, email, telefone, senhaHash, endereco], (err, result) => {
                if (err) {
                    console.error("Erro ao cadastrar cliente:", err);
                    return res.render("pages/cliente", {
                        listaErros: null,
                        dadosNotificacao: {
                            titulo: "Erro",
                            mensagem: "Erro ao cadastrar. Tente novamente.",
                            tipo: "error"
                        },
                        valores: req.body
                    });
                }

                res.render("pages/cliente", {
                    listaErros: null,
                    dadosNotificacao: {
                        titulo: "Sucesso!",
                        mensagem: "Cliente cadastrado com sucesso!",
                        tipo: "success"
                    },
                    valores: null
                });
            });
        });

    } catch (error) {
        console.error("Erro no cadastro:", error);
        res.render("pages/cliente", {
            listaErros: null,
            dadosNotificacao: {
                titulo: "Erro",
                mensagem: "Erro interno do servidor",
                tipo: "error"
            },
            valores: req.body
        });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, senha, tipo_usuario } = req.body;

        if (!email || !senha || !tipo_usuario) {
            return res.render("pages/Login", {
                listaErros: [{ msg: "Todos os campos são obrigatórios" }],
                dadosNotificacao: null,
                valores: req.body
            });
        }

        const tabela = tipo_usuario === 'adestrador' ? 'adestradores' : 'clientes';
        const queryLogin = `SELECT * FROM ${tabela} WHERE email = ? AND status = 1`;

        conexao.query(queryLogin, [email], (err, results) => {
            if (err) {
                console.error("Erro no login:", err);
                return res.render("pages/Login", {
                    listaErros: null,
                    dadosNotificacao: {
                        titulo: "Erro",
                        mensagem: "Erro interno do servidor",
                        tipo: "error"
                    },
                    valores: req.body
                });
            }

            if (results.length === 0) {
                return res.render("pages/Login", {
                    listaErros: [{ msg: "Email ou senha incorretos, ou conta não ativada" }],
                    dadosNotificacao: null,
                    valores: req.body
                });
            }

            const usuario = results[0];
            const bcrypt = require('bcryptjs');
            
            if (!bcrypt.compareSync(senha, usuario.senha)) {
                return res.render("pages/Login", {
                    listaErros: [{ msg: "Email ou senha incorretos" }],
                    dadosNotificacao: null,
                    valores: req.body
                });
            }

            // Login bem-sucedido
            req.session.autenticado = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: tipo_usuario
            };

            // Redirecionar baseado no tipo de usuário
            if (tipo_usuario === 'adestrador') {
                res.redirect('/paineladestrador.ejs');
            } else {
                res.redirect('/'); // ou dashboard do cliente
            }
        });

    } catch (error) {
        console.error("Erro no login:", error);
        res.render("pages/Login", {
            listaErros: null,
            dadosNotificacao: {
                titulo: "Erro",
                mensagem: "Erro interno do servidor",
                tipo: "error"
            },
            valores: req.body
        });
    }
});

// Logout
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Erro ao fazer logout:", err);
        }
        res.redirect('/');
    });
});

// ==========================================
// ROTAS CRUD PARA TAREFAS
// ==========================================

// SELECT - Listar todas as tarefas
router.get("/select", function (req, res) {
    conexao.query("SELECT * FROM tarefas", function (error, results) {
        console.log(results);
        console.log(error);
        if (error) {
            return res.json({ erro: error });
        }
        res.json({ tarefas: results });
    });
});

// INSERT - Criar nova tarefa
router.get("/insert", function (req, res) {
    const dadosParaInserir = {
        "nome_tarefa": "Formatar PC do Cliente 3",
        "prazo_tarefa": "2022-06-25",
        "situacao_tarefa": 1
    };
    
    conexao.query("INSERT INTO tarefas SET ?", [dadosParaInserir], function (error, results) {
        console.log(results);
        console.log(error);
        if (error) {
            return res.json({ erro: error });
        }
        res.json({ tarefas: results });
    });
});

// UPDATE - Atualizar tarefa
router.get("/update", function (req, res) {
    const dadosParaAlterar = {
        "nome_tarefa": "Formatar PC do Cliente 3.1",
        "prazo_tarefa": "2023-12-25",
        "situacao_tarefa": 0
    };
    
    const id_tarefa = 5;
    conexao.query("UPDATE tarefas SET ? WHERE id_tarefa = ?", [dadosParaAlterar, id_tarefa], function (error, results) {
        console.log(results);
        console.log(error);
        if (error) {
            return res.json({ erro: error });
        }
        res.json({ tarefas: results });
    });
});

// DELETE - Deletar tarefa por ID
router.get("/delete-1", function (req, res) {
    const id_tarefa = 3;
    conexao.query("UPDATE tarefas SET status_tarefa = 0 WHERE id_tarefa = ?", [id_tarefa], function (error, results) {
        console.log(results);
        console.log(error);
        if (error) {
            return res.json({ erro: error });
        }
        res.json({ tarefas: results });
    });
});

// DELETE - Deletar tarefa permanentemente
router.get("/delete-f", function (req, res) {
    const id_tarefa = 6;
    conexao.query("DELETE FROM tarefas WHERE id_tarefa = ?", [id_tarefa], function (error, results) {
        console.log(results);
        console.log(error);
        if (error) {
            return res.json({ erro: error });
        }
        res.json({ tarefas: results });
    });
});

// ==========================================
// ROTAS EXISTENTES (mantidas)
// ==========================================

router.post("/exibir", 
    function (req, res) {
        var nome = req.body.nome;
        var email = req.body.email;
        res.json({
            "nomeusuario": nome, 
            "emailusuario": email
        });
    }
);

router.post("/", (req, res) => {
    let objJson = { nome: req.body.nome, email: req.body.email };
    res.render("pages/mostrar", { dadosEnviados: objJson });
});

module.exports = router;




