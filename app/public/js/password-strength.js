// Função para calcular força da senha
function calculatePasswordStrength(password) {
    let score = 0;
    let feedback = [];

    // Critérios de força
    if (password.length >= 8) {
        score += 25;
    } else {
        feedback.push('Mínimo 8 caracteres');
    }

    if (password.length >= 12) {
        score += 10;
    }

    if (/[a-z]/.test(password)) {
        score += 15;
    } else {
        feedback.push('Adicione letras minúsculas');
    }

    if (/[A-Z]/.test(password)) {
        score += 15;
    } else {
        feedback.push('Adicione letras maiúsculas');
    }

    if (/[0-9]/.test(password)) {
        score += 15;
    } else {
        feedback.push('Adicione números');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        score += 20;
    } else {
        feedback.push('Adicione símbolos (!@#$%...)');
    }

    // Penalizar padrões comuns
    if (/(.)\1{2,}/.test(password)) {
        score -= 10;
        feedback.push('Evite repetir caracteres');
    }

    if (/123|abc|qwe|password|senha/i.test(password)) {
        score -= 20;
        feedback.push('Evite sequências óbvias');
    }

    return {
        score: Math.max(0, Math.min(100, score)),
        feedback: feedback
    };
}

// Função para atualizar indicador visual
function updatePasswordStrength(password, fillElement, textElement) {
    const result = calculatePasswordStrength(password);
    const container = fillElement.closest('.password-strength');
    
    // Remover classes anteriores
    container.classList.remove('strength-weak', 'strength-fair', 'strength-good', 'strength-strong');
    
    let strengthClass = '';
    let strengthText = '';
    
    if (password.length === 0) {
        strengthText = 'Digite uma senha forte';
        fillElement.style.width = '0%';
    } else if (result.score < 30) {
        strengthClass = 'strength-weak';
        strengthText = 'Senha fraca';
        fillElement.style.width = '25%';
    } else if (result.score < 60) {
        strengthClass = 'strength-fair';
        strengthText = 'Senha razoável';
        fillElement.style.width = '50%';
    } else if (result.score < 80) {
        strengthClass = 'strength-good';
        strengthText = 'Senha boa';
        fillElement.style.width = '75%';
    } else {
        strengthClass = 'strength-strong';
        strengthText = 'Senha forte! ✓';
        fillElement.style.width = '100%';
    }
    
    if (strengthClass) {
        container.classList.add(strengthClass);
    }
    
    // Mostrar feedback se houver
    if (result.feedback.length > 0 && password.length > 0) {
        strengthText += ` (${result.feedback[0]})`;
    }
    
    textElement.textContent = strengthText;
}

// Função para validar confirmação de senha
function updatePasswordMatch(password, confirmPassword, matchElement, iconElement, textElement) {
    if (confirmPassword.length === 0) {
        matchElement.classList.remove('show', 'match', 'no-match');
        return;
    }
    
    matchElement.classList.add('show');
    
    if (password === confirmPassword && password.length > 0) {
        matchElement.classList.remove('no-match');
        matchElement.classList.add('match');
        iconElement.textContent = '✓';
        textElement.textContent = 'Senhas coincidem';
    } else {
        matchElement.classList.remove('match');
        matchElement.classList.add('no-match');
        iconElement.textContent = '✗';
        textElement.textContent = 'Senhas não coincidem';
    }
}

// Inicializar para página de adestrador
function initPasswordStrengthAdestrador() {
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');
    const fillElement = document.getElementById('strengthFill');
    const textElement = document.getElementById('strengthText');
    const matchElement = document.getElementById('passwordMatch');
    const iconElement = document.getElementById('matchIcon');
    const matchTextElement = document.getElementById('matchText');
    
    if (passwordInput && fillElement && textElement) {
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value, fillElement, textElement);
            if (confirmInput && matchElement) {
                updatePasswordMatch(this.value, confirmInput.value, matchElement, iconElement, matchTextElement);
            }
        });
    }
    
    if (confirmInput && matchElement) {
        confirmInput.addEventListener('input', function() {
            updatePasswordMatch(passwordInput.value, this.value, matchElement, iconElement, matchTextElement);
        });
    }
}

// Inicializar para página de cliente
function initPasswordStrengthCliente() {
    const passwordInput = document.getElementById('senha');
    const confirmInput = document.getElementById('confirmarSenha');
    const fillElement = document.getElementById('strengthFillCliente');
    const textElement = document.getElementById('strengthTextCliente');
    const matchElement = document.getElementById('passwordMatchCliente');
    const iconElement = document.getElementById('matchIconCliente');
    const matchTextElement = document.getElementById('matchTextCliente');
    
    if (passwordInput && fillElement && textElement) {
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value, fillElement, textElement);
            if (confirmInput && matchElement) {
                updatePasswordMatch(this.value, confirmInput.value, matchElement, iconElement, matchTextElement);
            }
        });
    }
    
    if (confirmInput && matchElement) {
        confirmInput.addEventListener('input', function() {
            updatePasswordMatch(passwordInput.value, this.value, matchElement, iconElement, matchTextElement);
        });
    }
}

// Inicializar quando DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    // Tentar inicializar para ambas as páginas
    initPasswordStrengthAdestrador();
    initPasswordStrengthCliente();
});