document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('trainerForm');

  // Inputs
  const nameInput = form.querySelector('#name');
  const cpfInput = form.querySelector('#cpf');
  const emailInput = form.querySelector('#email');
  const phoneInput = form.querySelector('#phone');
  const cityInput = form.querySelector('#city');
  const stateSelect = form.querySelector('#state');
  const experienceInput = form.querySelector('#experience');
  const specialtyCheckboxes = form.querySelectorAll('input[name="specialty"]');
  const priceInput = form.querySelector('#price');
  const aboutInput = form.querySelector('#about');
  const passwordInput = form.querySelector('#password');
  const confirmPasswordInput = form.querySelector('#confirmPassword');
  const termsCheckbox = form.querySelector('#terms');
  
  // Error messages (assumindo que são os elementos imediatamente após os inputs)
  function showError(input, show) {
    const errorMsg = input.parentElement.querySelector('.error-message');
    if (errorMsg) errorMsg.style.display = show ? 'block' : 'none';
    input.style.borderColor = show ? '#e74c3c' : '#ddd';
  }

  function showErrorCheckboxGroup(container, show) {
    const errorMsg = container.querySelector('.error-message');
    if (errorMsg) errorMsg.style.display = show ? 'block' : 'none';
  }

  // Funções de validação específicas
  function isValidCPF(cpf) {
    // Exemplo simples: validar formato ###.###.###-##
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(cpf);
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhone(phone) {
    // Formato (00) 00000-0000
    const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
    return phoneRegex.test(phone);
  }

  function hasSpecialtyChecked() {
    return Array.from(specialtyCheckboxes).some(cb => cb.checked);
  }

  function isValidPassword(pw) {
    // mínimo 8 caracteres, letras e números
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pw);
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;

    // Nome
    if (!nameInput.value.trim()) {
      showError(nameInput, true);
      isValid = false;
    } else {
      showError(nameInput, false);
    }

    // CPF
    if (!cpfInput.value.trim() || !isValidCPF(cpfInput.value.trim())) {
      showError(cpfInput, true);
      isValid = false;
    } else {
      showError(cpfInput, false);
    }

    // Email
    if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
      showError(emailInput, true);
      isValid = false;
    } else {
      showError(emailInput, false);
    }

    // Telefone
    if (!phoneInput.value.trim() || !isValidPhone(phoneInput.value.trim())) {
      showError(phoneInput, true);
      isValid = false;
    } else {
      showError(phoneInput, false);
    }

    // Cidade
    if (!cityInput.value.trim()) {
      showError(cityInput, true);
      isValid = false;
    } else {
      showError(cityInput, false);
    }

    // Estado
    if (!stateSelect.value) {
      showError(stateSelect, true);
      isValid = false;
    } else {
      showError(stateSelect, false);
    }

    // Experiência
    if (!experienceInput.value || experienceInput.value < 0 || experienceInput.value > 50) {
      showError(experienceInput, true);
      isValid = false;
    } else {
      showError(experienceInput, false);
    }

    // Especialidades (checkbox group)
    const specialtyContainer = form.querySelector('section.form-group:nth-child(7) .checkbox-group');
    if (!hasSpecialtyChecked()) {
      showErrorCheckboxGroup(specialtyContainer, true);
      isValid = false;
    } else {
      showErrorCheckboxGroup(specialtyContainer, false);
    }

    // Preço
    if (!priceInput.value || priceInput.value < 50) {
      showError(priceInput, true);
      isValid = false;
    } else {
      showError(priceInput, false);
    }

    // Sobre você
    if (!aboutInput.value.trim()) {
      showError(aboutInput, true);
      isValid = false;
    } else {
      showError(aboutInput, false);
    }

    // Senha
    if (!passwordInput.value || !isValidPassword(passwordInput.value)) {
      showError(passwordInput, true);
      isValid = false;
    } else {
      showError(passwordInput, false);
    }

    // Confirmar senha
    if (confirmPasswordInput.value !== passwordInput.value) {
      showError(confirmPasswordInput, true);
      isValid = false;
    } else {
      showError(confirmPasswordInput, false);
    }

    // Termos
    if (!termsCheckbox.checked) {
      const termsError = termsCheckbox.parentElement.querySelector('.error-message');
      termsError.style.display = 'block';
      isValid = false;
    } else {
      const termsError = termsCheckbox.parentElement.querySelector('.error-message');
      termsError.style.display = 'none';
    }

    if (isValid) {
      // Mostrar mensagem de sucesso
      const successMsg = document.getElementById('successMessage');
      successMsg.style.display = 'block';

      // Limpar form (opcional)
      form.reset();

      // Pode fazer envio via fetch/AJAX aqui ou redirecionar se quiser
    }
  });
});
