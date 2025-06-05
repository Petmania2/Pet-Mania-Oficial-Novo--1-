// Menu mobile
document.getElementById('menuBtn').addEventListener('click', function() {
    document.getElementById('navLinks').classList.toggle('active');
});

// Validação do formulário
const form = document.getElementById('trainerForm');

// Formatação de CPF
const cpfInput = document.getElementById('cpf');
cpfInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    
    if (value.length > 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    
    e.target.value = value;
});

// Formatação de telefone
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    
    if (value.length > 10) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length > 6) {
        value = value.replace(/(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length > 2) {
        value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    }
    
    e.target.value = value;
});

// Validação do CPF
function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    
    let sum = 0;
    let remainder;
    
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }
    
    if (remainder !== parseInt(cpf.substring(9, 10))) {
        return false;
    }
    
    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }
    
    return remainder === parseInt(cpf.substring(10, 11));
}

// Validar e-mail
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}

// Validar senha
function validatePassword(password) {
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
}

// Exibir erro
function showError(input, message) {
    const formGroup = input.parentElement;
    formGroup.classList.add('error');
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.textContent = message;
    }
}

// Limpar erro
function clearError(input) {
    const formGroup = input.parentElement;
    formGroup.classList.remove('error');
}

// Verificar se alguma especialidade foi selecionada
function validateSpecialties() {
    const checkboxes = document.querySelectorAll('input[name="specialty"]');
    const checked = Array.from(checkboxes).some(checkbox => checkbox.checked);
    
    if (!checked) {
        const formGroup = checkboxes[0].closest('.form-group');
        formGroup.classList.add('error');
        return false;
    } else {
        const formGroup = checkboxes[0].closest('.form-group');
        formGroup.classList.remove('error');
        return true;
    }
}

// Evento de submissão do formulário
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    
    // Validar nome
    const nameInput = document.getElementById('name');
    if (nameInput.value.trim().length < 3) {
        showError(nameInput, 'Por favor, informe seu nome completo');
        isValid = false;
    } else {
        clearError(nameInput);
    }
    
    // Validar CPF
    if (!validateCPF(cpfInput.value)) {
        showError(cpfInput, 'Por favor, informe um CPF válido');
        isValid = false;
    } else {
        clearError(cpfInput);
    }
    
    // Validar email
    const emailInput = document.getElementById('email');
    if (!validateEmail(emailInput.value)) {
        showError(emailInput, 'Por favor, informe um email válido');
        isValid = false;
    } else {
        clearError(emailInput);
    }
    
    // Validar telefone
    if (phoneInput.value.replace(/\D/g, '').length < 10) {
        showError(phoneInput, 'Por favor, informe um telefone válido');
        isValid = false;
    } else {
        clearError(phoneInput);
    }
    
    // Validar cidade
    const cityInput = document.getElementById('city');
    if (cityInput.value.trim() === '') {
        showError(cityInput, 'Por favor, informe sua cidade');
        isValid = false;
    } else {
        clearError(cityInput);
    }
    
    // Validar estado
    const stateInput = document.getElementById('state');
    if (stateInput.value === '') {
        showError(stateInput, 'Por favor, selecione seu estado');
        isValid = false;
    } else {
        clearError(stateInput);
    }
    
    // Validar experiência
    const experienceInput = document.getElementById('experience');
    if (experienceInput.value === '' || experienceInput.value < 0) {
        showError(experienceInput, 'Por favor, informe seus anos de experiência');
        isValid = false;
    } else {
        clearError(experienceInput);
    }
    
    // Validar especialidades
    if (!validateSpecialties()) {
        isValid = false;
    }
    
    // Validar preço
    const priceInput = document.getElementById('price');
    if (priceInput.value === '' || priceInput.value < 50) {
        showError(priceInput, 'Por favor, informe o valor da sessão (mínimo R$ 50)');
        isValid = false;
    } else {
        clearError(priceInput);
    }
    
    // Validar sobre
    const aboutInput = document.getElementById('about');
    if (aboutInput.value.trim().length < 50) {
        showError(aboutInput, 'Por favor, escreva pelo menos 50 caracteres sobre você e sua experiência');
        isValid = false;
    } else {
        clearError(aboutInput);
    }
    
    // Validar senha
    const passwordInput = document.getElementById('password');
    if (!validatePassword(passwordInput.value)) {
        showError(passwordInput, 'A senha deve ter pelo menos 8 caracteres, incluindo letras e números');
        isValid = false;
    } else {
        clearError(passwordInput);
    }
    
    // Validar confirmação de senha
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (passwordInput.value !== confirmPasswordInput.value) {
        showError(confirmPasswordInput, 'As senhas não conferem');
        isValid = false;
    } else {
        clearError(confirmPasswordInput);
    }
    
    // Validar termos
    const termsInput = document.getElementById('terms');
    if (!termsInput.checked) {
        showError(termsInput, 'Você precisa concordar com os termos para continuar');
        isValid = false;
    } else {
        clearError(termsInput);
    }
    
    // Se todos os campos estiverem válidos, redirecionar para o painel do adestrador
    if (isValid) {
        // Mostrar mensagem de sucesso brevemente antes de redirecionar
        document.getElementById('successMessage').style.display = 'block';
        
        // Redirecionar para a página do painel do adestrador após um curto delay
        setTimeout(() => {
            window.location.href = 'paineladestrador.ejs';
        }, 1500); // Redireciona após 1.5 segundos
    } else {
        // Se houver erros, rolar até o primeiro erro
        const firstError = document.querySelector('.form-group.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});    

// Desabilitar o copiar e colar nos campos de senha
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

// Prevenir copiar no campo de senha
passwordInput.addEventListener('copy', function(e) {
    e.preventDefault();
    alert('Por questões de segurança, não é permitido copiar a senha');
});

// Prevenir colar no campo de senha
passwordInput.addEventListener('paste', function(e) {
    e.preventDefault();
    alert('Por questões de segurança, não é permitido colar no campo de senha');
});

// Prevenir colar no campo de confirmação de senha
confirmPasswordInput.addEventListener('paste', function(e) {
    e.preventDefault();
    alert('Por questões de segurança, não é permitido colar no campo de confirmação de senha');
});


// Máscaras para formatação
function aplicarMascaras() {
    // Máscara CPF
    const cpfInput = document.getElementById('cpf');
    cpfInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        this.value = value;
    });

    // Máscara Telefone
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
        this.value = value;
    });
}

// Validações
function validarFormulario(dados) {
    const erros = [];

    // Validar nome
    if (!dados.name || dados.name.trim().length < 3) {
        erros.push('Nome deve ter pelo menos 3 caracteres');
    }

    // Validar CPF
    const cpfLimpo = dados.cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
        erros.push('CPF deve ter 11 dígitos');
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dados.email)) {
        erros.push('Email inválido');
    }

    // Validar telefone
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (!phoneRegex.test(dados.phone)) {
        erros.push('Telefone inválido');
    }

    // Validar especialidades
    const especialidades = document.querySelectorAll('input[name="specialty"]:checked');
    if (especialidades.length === 0) {
        erros.push('Selecione pelo menos uma especialidade');
    }

    // Validar senha
    if (dados.password.length < 8) {
        erros.push('Senha deve ter pelo menos 8 caracteres');
    }

    // Validar confirmação de senha
    if (dados.password !== dados.confirmPassword) {
        erros.push('Senhas não conferem');
    }

    // Validar termos
    if (!document.getElementById('terms').checked) {
        erros.push('Você deve aceitar os termos');
    }

    return erros;
}

// Mostrar mensagens de erro
function mostrarErros(erros) {
    // Limpar erros anteriores
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
    });

    if (erros.length > 0) {
        alert('Erros encontrados:\n' + erros.join('\n'));
        return false;
    }
    return true;
}

// Mostrar loading
function mostrarLoading(show) {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (show) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Cadastrando...';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Cadastrar como Adestrador';
    }
}

// Enviar dados para o servidor
async function enviarCadastro(dados) {
    try {
        mostrarLoading(true);

        const response = await fetch('/api/adestrador/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados)
        });

        const resultado = await response.json();

        if (response.ok && resultado.success) {
            // Sucesso
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('trainerForm').style.display = 'none';
            
            // Scroll para o topo
            window.scrollTo(0, 0);
            
            console.log('Cadastro realizado com sucesso!');
        } else {
            // Erro do servidor
            const errorMessage = resultado.message || 'Erro ao realizar cadastro';
            
            if (resultado.errors && resultado.errors.length > 0) {
                const errosDetalhados = resultado.errors.map(erro => erro.msg).join('\n');
                alert(`Erro no cadastro:\n${errorMessage}\n\nDetalhes:\n${errosDetalhados}`);
            } else {
                alert(`Erro no cadastro: ${errorMessage}`);
            }
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
        mostrarLoading(false);
    }
}

// Event listener principal
document.addEventListener('DOMContentLoaded', function() {
    // Aplicar máscaras
    aplicarMascaras();

    // Menu mobile
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Formulário
    const form = document.getElementById('trainerForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Coletar dados do formulário
        const formData = new FormData(form);
        const dados = {};
        
        // Campos normais
        for (let [key, value] of formData.entries()) {
            if (key !== 'specialty') {
                dados[key] = value;
            }
        }

        // Especialidades (múltiplas)
        const especialidades = [];
        document.querySelectorAll('input[name="specialty"]:checked').forEach(checkbox => {
            especialidades.push(checkbox.value);
        });
        dados.specialty = especialidades;

        // Termos
        dados.terms = document.getElementById('terms').checked;

        console.log('Dados coletados:', dados);

        // Validar
        const erros = validarFormulario(dados);
        if (!mostrarErros(erros)) {
            return;
        }

        // Enviar
        await enviarCadastro(dados);
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});
