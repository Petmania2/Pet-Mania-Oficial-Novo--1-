// Formatação automática de campos
document.addEventListener('DOMContentLoaded', function() {
    // Formatação do CPF
    const cpfInput = document.getElementById('cpf');
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    });

    // Formatação do telefone
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        e.target.value = value;
    });

  // Formatação do preço
const priceInput = document.getElementById('price');
priceInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    
    if (value.length === 0) {
        e.target.value = '';
        return;
    }
    
    // Converte para centavos para facilitar a formatação
    let numValue = parseInt(value);
    
    // Formata como moeda (divide por 100 para casas decimais)
    let formatted = (numValue / 100).toFixed(2);
    
    // Remove zeros desnecessários à esquerda da parte inteira
    formatted = formatted.replace(/^0+/, '') || '0.00';
    
    // Se começar com ponto, adiciona zero
    if (formatted.startsWith('.')) {
        formatted = '0' + formatted;
    }
    
    e.target.value = formatted;
});

// Opcional: Formatação com máscara de moeda brasileira
const priceInputBR = document.getElementById('price-br'); // Se quiser usar formato brasileiro
if (priceInputBR) {
    priceInputBR.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length === 0) {
            e.target.value = '';
            return;
        }
        
        let numValue = parseInt(value);
        let formatted = (numValue / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        
        e.target.value = formatted;
    });
}
    
});





// Validação de CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;
    
    return true;
}

// Validação de email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validação de senha
function validarSenha(senha) {
    return senha.length >= 8 && /[a-zA-Z]/.test(senha) && /\d/.test(senha);
}

// Validação de telefone
function validarTelefone(telefone) {
    const regex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return regex.test(telefone);
}

// Mostrar/esconder mensagens de erro
function mostrarErro(campo, mostrar = true) {
    const formGroup = campo.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    if (mostrar) {
        campo.classList.add('error');
        errorMessage.style.display = 'block';
    } else {
        campo.classList.remove('error');
        errorMessage.style.display = 'none';
    }
}

// Validar campo individual
function validarCampo(campo) {
    const valor = campo.value.trim();
    const nome = campo.name;
    let valido = true;

    switch (nome) {
        case 'name':
            valido = valor.length >= 2;
            break;
        case 'cpf':
            valido = validarCPF(valor);
            break;
        case 'email':
            valido = validarEmail(valor);
            break;
        case 'phone':
            valido = validarTelefone(valor);
            break;
        case 'city':
            valido = valor.length >= 2;
            break;
        case 'state':
            valido = valor !== '';
            break;
        case 'experience':
            valido = parseInt(valor) >= 0;
            break;
        case 'price':
            valido = parseFloat(valor) >= 50;
            break;
        case 'about':
            valido = valor.length >= 50;
            break;
        case 'password':
            valido = validarSenha(valor);
            break;
        case 'confirmPassword':
            const senha = document.getElementById('password').value;
            valido = valor === senha;
            break;
    }

    mostrarErro(campo, !valido);
    return valido;
}

// Validar especialidades
function validarEspecialidades() {
    const checkboxes = document.querySelectorAll('input[name="specialty"]:checked');
    const container = document.querySelector('.checkbox-group').closest('.form-group');
    const errorMessage = container.querySelector('.error-message');
    
    if (checkboxes.length === 0) {
        errorMessage.style.display = 'block';
        return false;
    } else {
        errorMessage.style.display = 'none';
        return true;
    }
}

// Validar termos
function validarTermos() {
    const termsCheckbox = document.getElementById('terms');
    const container = termsCheckbox.closest('.form-group');
    const errorMessage = container.querySelector('.error-message');
    
    if (!termsCheckbox.checked) {
        errorMessage.style.display = 'block';
        return false;
    } else {
        errorMessage.style.display = 'none';
        return true;
    }
}

// Mostrar mensagem de sucesso
function mostrarSucesso(mensagem) {
    const successSection = document.getElementById('successMessage');
    successSection.textContent = mensagem;
    successSection.style.display = 'block';
    successSection.scrollIntoView({ behavior: 'smooth' });
}

// Mostrar mensagem de erro geral
function mostrarErroGeral(mensagem) {
    // Remover mensagem anterior se existir
    const erroAnterior = document.querySelector('.error-general');
    if (erroAnterior) {
        erroAnterior.remove();
    }

    // Criar nova mensagem de erro
    const errorSection = document.createElement('section');
    errorSection.className = 'error-general';
    errorSection.style.cssText = `
        background: #ff4444;
        color: white;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        text-align: center;
        font-weight: 500;
    `;
    errorSection.textContent = mensagem;

    // Inserir antes do formulário
    const form = document.getElementById('trainerForm');
    form.parentNode.insertBefore(errorSection, form);
    
    // Fazer scroll para a mensagem
    errorSection.scrollIntoView({ behavior: 'smooth' });
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (errorSection.parentNode) {
            errorSection.remove();
        }
    }, 5000);
}

// Desabilitar/habilitar botão de submit
function toggleSubmitButton(desabilitar = false) {
    const submitBtn = document.querySelector('button[type="submit"]');
    const textoOriginal = 'Cadastrar como Adestrador';
    const textoCarregando = 'Cadastrando...';
    
    if (desabilitar) {
        submitBtn.disabled = true;
        submitBtn.textContent = textoCarregando;
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = textoOriginal;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
    }
}

// Event listeners para validação em tempo real
document.addEventListener('DOMContentLoaded', function() {
    const campos = document.querySelectorAll('#trainerForm input, #trainerForm select, #trainerForm textarea');
    
    campos.forEach(campo => {
        campo.addEventListener('blur', function() {
            validarCampo(this);
        });
        
        campo.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validarCampo(this);
            }
        });
    });

    // Validação das especialidades
    const checkboxes = document.querySelectorAll('input[name="specialty"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', validarEspecialidades);
    });

    // Validação dos termos
    document.getElementById('terms').addEventListener('change', validarTermos);
});

// Submissão do formulário
document.getElementById('trainerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validar todos os campos
    const campos = document.querySelectorAll('#trainerForm input, #trainerForm select, #trainerForm textarea');
    let formularioValido = true;
    
    campos.forEach(campo => {
        if (!validarCampo(campo)) {
            formularioValido = false;
        }
    });
    
    // Validar especialidades e termos
    if (!validarEspecialidades()) formularioValido = false;
    if (!validarTermos()) formularioValido = false;
    
    if (!formularioValido) {
        mostrarErroGeral('Por favor, corrija os erros no formulário antes de continuar.');
        return;
    }
    
    // Desabilitar botão e mostrar loading
    toggleSubmitButton(true);
    
    try {
        // Coletar dados do formulário
        const formData = new FormData(this);
        
        // Coletar especialidades marcadas
        const especialidades = [];
        document.querySelectorAll('input[name="specialty"]:checked').forEach(checkbox => {
            especialidades.push(checkbox.value);
        });
        
        // Preparar dados para envio
        const dadosParaEnvio = {
            name: formData.get('name'),
            cpf: formData.get('cpf'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            city: formData.get('city'),
            state: formData.get('state'),
            experience: formData.get('experience'),
            specialty: especialidades,
            price: formData.get('price'),
            about: formData.get('about'),
            password: formData.get('password')
        };
        
        // Enviar dados
        const response = await fetch('/cadastrar-adestrador', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosParaEnvio)
        });
        
        const resultado = await response.json();
        
        if (resultado.sucesso) {
            mostrarSucesso(resultado.mensagem);
            
            // Limpar formulário
            this.reset();
            
            // Redirecionar para login após 2 segundos
            setTimeout(() => {
                window.location.href = '/Login.ejs';
            }, 2000);
            
        } else {
            mostrarErroGeral(resultado.erro || 'Erro ao realizar cadastro. Tente novamente.');
        }
        
    } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        mostrarErroGeral('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
        // Reabilitar botão
        toggleSubmitButton(false);
    }
});