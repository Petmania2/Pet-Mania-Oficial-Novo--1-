// Menu Mobile Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Form Validation
    const cadastroForm = document.getElementById('cadastroForm');
    
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                // Coletar dados do formulário
                const formData = {
                    nome: document.getElementById('nome').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    telefone: document.getElementById('telefone').value,
                    cpf: document.getElementById('cpf').value.replace(/\D/g, ''),
                    cidade: document.getElementById('cidade').value,
                    endereco: document.getElementById('endereco').value.trim(),
                    nomePet: document.getElementById('nomePet').value.trim(),
                    racaPet: document.getElementById('racaPet').value.trim(),
                    idadePet: document.getElementById('idadePet').value,
                    sexoPet: document.getElementById('sexoPet').value,
                    tipoCadastro: document.getElementById('tipoCadastro').value,
                    descricao: document.getElementById('descricao').value.trim(),
                    senha: document.getElementById('senha').value,
                    newsletter: document.getElementById('newsletter').checked
                };

                // Desabilitar botão enquanto envia
                const submitBtn = document.querySelector('.submit-btn');
                const textoOriginal = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Cadastrando...';

                try {
                    // Enviar dados para o servidor
                    const response = await fetch('/cadastrar-cliente', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData)
                    });

                    const resultado = await response.json();

                    if (resultado.sucesso) {
                        // Mostrar mensagem de sucesso
                        document.getElementById('successMessage').style.display = 'block';
                        
                        // Resetar o formulário
                        cadastroForm.reset();
                        
                        // Redirecionar para login após 3 segundos
                        setTimeout(function() {
                            window.location.href = '/Login.ejs';
                        }, 3000);
                    } else {
                        // Mostrar erro
                        alert(resultado.erro || 'Erro ao realizar cadastro. Tente novamente.');
                    }

                } catch (error) {
                    console.error('Erro ao cadastrar:', error);
                    alert('Erro de conexão. Verifique sua internet e tente novamente.');
                } finally {
                    // Reabilitar botão
                    submitBtn.disabled = false;
                    submitBtn.textContent = textoOriginal;
                }
            }
        });
    }
    
    // Formatação de telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                if (value.length > 2) {
                    value = '(' + value.substring(0, 2) + ') ' + value.substring(2);
                }
                if (value.length > 9) {
                    value = value.substring(0, 10) + '-' + value.substring(10);
                }
                e.target.value = value;
            }
        });
    }
    
    // Formatação de CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                if (value.length > 3) {
                    value = value.substring(0, 3) + '.' + value.substring(3);
                }
                if (value.length > 7) {
                    value = value.substring(0, 7) + '.' + value.substring(7);
                }
                if (value.length > 11) {
                    value = value.substring(0, 11) + '-' + value.substring(11);
                }
                e.target.value = value;
            }
        });
    }
});

function validateForm() {
    let isValid = true;
    
    // Nome validação
    const nome = document.getElementById('nome');
    const nomeError = document.getElementById('nomeError');
    if (!nome.value.trim() || nome.value.trim().split(' ').length < 2) {
        nome.classList.add('error');
        nomeError.style.display = 'block';
        isValid = false;
    } else {
        nome.classList.remove('error');
        nomeError.style.display = 'none';
    }
    
    // Email validação
    const email = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        email.classList.add('error');
        emailError.style.display = 'block';
        isValid = false;
    } else {
        email.classList.remove('error');
        emailError.style.display = 'none';
    }
    
    // Telefone validação
    const telefone = document.getElementById('telefone');
    const telefoneError = document.getElementById('telefoneError');
    const telefoneClean = telefone.value.replace(/\D/g, '');
    if (telefoneClean.length < 10) {
        telefone.classList.add('error');
        telefoneError.style.display = 'block';
        isValid = false;
    } else {
        telefone.classList.remove('error');
        telefoneError.style.display = 'none';
    }
    
    // CPF validação
    const cpf = document.getElementById('cpf');
    const cpfError = document.getElementById('cpfError');
    const cpfClean = cpf.value.replace(/\D/g, '');
    if (cpfClean.length !== 11) {
        cpf.classList.add('error');
        cpfError.style.display = 'block';
        isValid = false;
    } else {
        cpf.classList.remove('error');
        cpfError.style.display = 'none';
    }
    
    // Cidade validação
    const cidade = document.getElementById('cidade');
    const cidadeError = document.getElementById('cidadeError');
    if (!cidade.value) {
        cidade.classList.add('error');
        cidadeError.style.display = 'block';
        isValid = false;
    } else {
        cidade.classList.remove('error');
        cidadeError.style.display = 'none';
    }
    
    // Endereço validação
    const endereco = document.getElementById('endereco');
    const enderecoError = document.getElementById('enderecoError');
    if (!endereco.value.trim()) {
        endereco.classList.add('error');
        enderecoError.style.display = 'block';
        isValid = false;
    } else {
        endereco.classList.remove('error');
        enderecoError.style.display = 'none';
    }
    
    // Nome do Pet validação
    const nomePet = document.getElementById('nomePet');
    const nomePetError = document.getElementById('nomePetError');
    if (!nomePet.value.trim()) {
        nomePet.classList.add('error');
        nomePetError.style.display = 'block';
        isValid = false;
    } else {
        nomePet.classList.remove('error');
        nomePetError.style.display = 'none';
    }
    
    // Raça do Pet validação
    const racaPet = document.getElementById('racaPet');
    const racaPetError = document.getElementById('racaPetError');
    if (!racaPet.value.trim()) {
        racaPet.classList.add('error');
        racaPetError.style.display = 'block';
        isValid = false;
    } else {
        racaPet.classList.remove('error');
        racaPetError.style.display = 'none';
    }
    
    // Idade do Pet validação
    const idadePet = document.getElementById('idadePet');
    const idadePetError = document.getElementById('idadePetError');
    if (!idadePet.value || idadePet.value < 0 || idadePet.value > 30) {
        idadePet.classList.add('error');
        idadePetError.style.display = 'block';
        isValid = false;
    } else {
        idadePet.classList.remove('error');
        idadePetError.style.display = 'none';
    }
    
    // Tipo de Adestramento validação
    const tipoCadastro = document.getElementById('tipoCadastro');
    const tipoCadastroError = document.getElementById('tipoCadastroError');
    if (!tipoCadastro.value) {
        tipoCadastro.classList.add('error');
        tipoCadastroError.style.display = 'block';
        isValid = false;
    } else {
        tipoCadastro.classList.remove('error');
        tipoCadastroError.style.display = 'none';
    }
    
    // Senha validação
    const senha = document.getElementById('senha');
    const senhaError = document.getElementById('senhaError');
    if (senha.value.length < 8) {
        senha.classList.add('error');
        senhaError.style.display = 'block';
        isValid = false;
    } else {
        senha.classList.remove('error');
        senhaError.style.display = 'none';
    }
    
    // Confirmar Senha validação
    const confirmarSenha = document.getElementById('confirmarSenha');
    const confirmarSenhaError = document.getElementById('confirmarSenhaError');
    if (confirmarSenha.value !== senha.value) {
        confirmarSenha.classList.add('error');
        confirmarSenhaError.style.display = 'block';
        isValid = false;
    } else {
        confirmarSenha.classList.remove('error');
        confirmarSenhaError.style.display = 'none';
    }
    
    // Termos validação
    const termos = document.getElementById('termos');
    if (!termos.checked) {
        isValid = false;
        alert('Você deve aceitar os termos e condições para continuar.');
    }
    
    return isValid;
}
