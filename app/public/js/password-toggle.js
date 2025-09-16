// Função para alternar visibilidade de todas as senhas
function toggleAllPasswords(button) {
    const senhaInput = document.getElementById('senha');
    const confirmarSenhaInput = document.getElementById('confirmarSenha');
    const icon = button.querySelector('i');
    const text = button.querySelector('span');
    
    if (senhaInput && confirmarSenhaInput) {
        if (senhaInput.type === 'password') {
            // Mostrar senhas
            senhaInput.type = 'text';
            confirmarSenhaInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
            text.textContent = 'Ocultar senhas';
            button.classList.add('active');
        } else {
            // Ocultar senhas
            senhaInput.type = 'password';
            confirmarSenhaInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
            text.textContent = 'Mostrar senhas';
            button.classList.remove('active');
        }
    }
}

// Função para alternar visibilidade da senha (compatibilidade)
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
        button.classList.add('active');
        button.title = 'Ocultar senha';
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
        button.classList.remove('active');
        button.title = 'Mostrar senha';
    }
}