const adestrador = require("../models/adestradorModel");
const usuario = require("../models/usuarioModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(12);

const adestradorController = {

    regrasValidacaoCadastro: [
        body("name")
            .isLength({ min: 3, max: 100 })
            .withMessage("Nome deve ter de 3 a 100 caracteres!"),
        body("cpf")
            .isLength({ min: 11, max: 14 })
            .withMessage("CPF deve ser válido!")
            .custom(async value => {
                // Remove formatação do CPF
                const cpfLimpo = value.replace(/[^\d]/g, '');
                const adestradorExistente = await adestrador.findAll();
                const cpfExiste = adestradorExistente.some(a => a.cpf_adestrador === cpfLimpo);
                if (cpfExiste) {
                    throw new Error('CPF já cadastrado!');
                }
            }),
        body("email")
            .isEmail()
            .withMessage("Digite um e-mail válido!")
            .custom(async value => {
                const emailExistente = await usuario.findUserEmail({ user_usuario: value });
                if (emailExistente.length > 0) {
                    throw new Error('E-mail já está em uso!');
                }
            }),
        body("phone")
            .isLength({ min: 10, max: 15 })
            .withMessage("Digite um telefone válido!"),
        body("city")
            .isLength({ min: 2, max: 100 })
            .withMessage("Cidade deve ter de 2 a 100 caracteres!"),
        body("state")
            .isLength({ min: 2, max: 2 })
            .withMessage("Selecione um estado válido!"),
        body("experience")
            .isInt({ min: 0, max: 50 })
            .withMessage("Anos de experiência deve ser um número válido!"),
        body("price")
            .isFloat({ min: 50 })
            .withMessage("Valor da sessão deve ser no mínimo R$ 50!"),
        body("about")
            .isLength({ min: 50, max: 1000 })
            .withMessage("Descrição deve ter entre 50 e 1000 caracteres!"),
        body("password")
            .isStrongPassword()
            .withMessage("A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)")
    ],

    cadastrar: async (req, res) => {
        const erros = validationResult(req);
        
        if (!erros.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Dados inválidos",
                errors: erros.array()
            });
        }

        // Verificar se especialidades foram selecionadas
        if (!req.body.specialty || req.body.specialty.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Selecione pelo menos uma especialidade"
            });
        }

        // Verificar se os termos foram aceitos
        if (!req.body.terms) {
            return res.status(400).json({
                success: false,
                message: "Você deve aceitar os termos de serviço"
            });
        }

        try {
            // Preparar dados do usuário
            const dadosUsuario = {
                user_usuario: req.body.email, // usando email como username
                senha_usuario: bcrypt.hashSync(req.body.password, salt),
                nome_usuario: req.body.name,
                email_usuario: req.body.email,
                fone_usuario: req.body.phone.replace(/[^\d]/g, ''), // remove formatação
                tipo_usuario: 2, // tipo 2 para adestrador (assumindo que existe na tabela tipo_usuario)
                status_usuario: 1
            };

            // Criar usuário
            const resultUsuario = await usuario.create(dadosUsuario);
            
            if (!resultUsuario.insertId) {
                throw new Error("Erro ao criar usuário");
            }

            // Preparar dados do adestrador
            const especialidades = Array.isArray(req.body.specialty) 
                ? req.body.specialty.join(',') 
                : req.body.specialty;

            const dadosAdestrador = {
                id_usuario: resultUsuario.insertId,
                cpf_adestrador: req.body.cpf.replace(/[^\d]/g, ''), // remove formatação
                cidade_adestrador: req.body.city,
                estado_adestrador: req.body.state,
                anos_experiencia: parseInt(req.body.experience),
                especialidades_adestrador: especialidades,
                valor_sessao: parseFloat(req.body.price),
                descricao_adestrador: req.body.about,
                status_adestrador: 1, // ativo, mas pode precisar de aprovação
                aprovado_adestrador: 0 // aguardando aprovação
            };

            // Criar adestrador
            const resultAdestrador = await adestrador.create(dadosAdestrador);

            if (resultAdestrador.insertId) {
                res.status(201).json({
                    success: true,
                    message: "Cadastro realizado com sucesso! Aguarde a aprovação para começar a atender.",
                    adestradorId: resultAdestrador.insertId
                });
            } else {
                throw new Error("Erro ao criar perfil de adestrador");
            }

        } catch (error) {
            console.log("Erro no cadastro de adestrador:", error);
            
            res.status(500).json({
                success: false,
                message: "Erro interno do servidor. Tente novamente mais tarde.",
                error: error.message
            });
        }
    },

    listarTodos: async (req, res) => {
        try {
            const adestradores = await adestrador.findAll();
            res.status(200).json({
                success: true,
                data: adestradores
            });
        } catch (error) {
            console.log("Erro ao listar adestradores:", error);
            res.status(500).json({
                success: false,
                message: "Erro ao carregar adestradores"
            });
        }
    },

    buscarPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const adestradorEncontrado = await adestrador.findById(id);
            
            if (adestradorEncontrado.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Adestrador não encontrado"
                });
            }

            res.status(200).json({
                success: true,
                data: adestradorEncontrado[0]
            });
        } catch (error) {
            console.log("Erro ao buscar adestrador:", error);
            res.status(500).json({
                success: false,
                message: "Erro ao buscar adestrador"
            });
        }
    },

    buscarPorCidade: async (req, res) => {
        try {
            const { cidade } = req.params;
            const adestradores = await adestrador.findByCity(cidade);
            
            res.status(200).json({
                success: true,
                data: adestradores
            });
        } catch (error) {
            console.log("Erro ao buscar por cidade:", error);
            res.status(500).json({
                success: false,
                message: "Erro ao buscar adestradores por cidade"
            });
        }
    },

    buscarPorEspecialidade: async (req, res) => {
        try {
            const { especialidade } = req.params;
            const adestradores = await adestrador.findBySpecialty(especialidade);
            
            res.status(200).json({
                success: true,
                data: adestradores
            });
        } catch (error) {
            console.log("Erro ao buscar por especialidade:", error);
            res.status(500).json({
                success: false,
                message: "Erro ao buscar adestradores por especialidade"
            });
        }
    }
};

module.exports = adestradorController;