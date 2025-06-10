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
  
  // Função para mostrar/ocultar erro
  function showError(input, show) {
    const errorMsg = input.parentElement.querySelector('.error-message');
    if (errorMsg) errorMsg.style.display = show ? 'block' : 'none';
    input.style.borderColor = show ? '#e74c3c' : '#ddd';
  }

  function showErrorCheckboxGroup(container, show) {
    const errorMsg = container.querySelector('.error-message');
    if (errorMsg) errorMsg.style.display = show ? 'block' : 'none';
  }

  // Máscara para CPF
  cpfInput.addEventListener('input', function() {
    let value = this.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      this.value = value;
    }
  });

  // Máscara para telefone
  phoneInput.addEventListener('input', function() {
    let value = this.value.replace(/\D/g, '');
    if (value.length <= 11) {
      if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
      this.value = value;
    }
  });

  // Permitir apenas números no campo experiência
  experienceInput.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '');
    if (parseInt(this.value) > 50) {
      this.value = '50';
    }
  });

  // Permitir apenas números e vírgula/ponto no preço
  priceInput.addEventListener('input', function() {
    let value = this.value.replace(/[^\d.,]/g, '');
    // Substituir vírgula por ponto
    value = value.replace(',', '.');
    // Permitir apenas um ponto decimal
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    // Limitar a 2 casas decimais
    if (parts[1] && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].substring(0, 2);
    }
    this.value = value;
  });

  // Permitir apenas letras e espaços no nome
  nameInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
  });

  // Permitir apenas letras e espaços na cidade
  cityInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
  });

  // Funções de validação específicas
  function isValidCPF(cpf) {
    // Remove formatação
    cpf = cpf.replace(/[^\d]/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;
    
    return true;
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhone(phone) {
    // Remove formatação
    const phoneNumbers = phone.replace(/\D/g, '');
    // Verifica se tem 10 ou 11 dígitos
    return phoneNumbers.length === 10 || phoneNumbers.length === 11;
  }

  function hasSpecialtyChecked() {
    return Array.from(specialtyCheckboxes).some(cb => cb.checked);
  }

  function isValidPassword(pw) {
    // Mínimo 8 caracteres, pelo menos uma letra, um número
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(pw);
  }

  function isValidName(name) {
    // Pelo menos 2 palavras, cada uma com pelo menos 2 caracteres
    const words = name.trim().split(/\s+/);
    return words.length >= 2 && words.every(word => word.length >= 2);
  }

  function isValidCity(city) {
    // Pelo menos 2 caracteres, apenas letras e espaços
    return city.trim().length >= 2 && /^[a-zA-ZÀ-ÿ\s]+$/.test(city.trim());
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    let isValid = true;

    // Nome
    if (!nameInput.value.trim() || !isValidName(nameInput.value.trim())) {
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
    if (!cityInput.value.trim() || !isValidCity(cityInput.value.trim())) {
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
    const experience = parseInt(experienceInput.value);
    if (!experienceInput.value || experience < 0 || experience > 50) {
      showError(experienceInput, true);
      isValid = false;
    } else {
      showError(experienceInput, false);
    }

    // Especialidades
    const specialtyContainer = form.querySelector('section.form-group:nth-child(7) .checkbox-group');
    if (!hasSpecialtyChecked()) {
      showErrorCheckboxGroup(specialtyContainer, true);
      isValid = false;
    } else {
      showErrorCheckboxGroup(specialtyContainer, false);
    }

    // Preço
    const price = parseFloat(priceInput.value);
    if (!priceInput.value || price < 50) {
      showError(priceInput, true);
      isValid = false;
    } else {
      showError(priceInput, false);
    }

    // Sobre você
    if (!aboutInput.value.trim() || aboutInput.value.trim().length < 50) {
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
      if (termsError) termsError.style.display = 'block';
      isValid = false;
    } else {
      const termsError = termsCheckbox.parentElement.querySelector('.error-message');
      if (termsError) termsError.style.display = 'none';
    }

    if (isValid) {
      try {
        // Mostrar loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Cadastrando...';
        submitBtn.disabled = true;

        // Coletar especialidades selecionadas
        const especialidades = Array.from(specialtyCheckboxes)
          .filter(cb => cb.checked)
          .map(cb => cb.value);

        // Preparar dados para envio
        const formData = new FormData(form);
        
        // Remover especialidades individuais e adicionar como array
        specialtyCheckboxes.forEach(cb => formData.delete('specialty'));
        especialidades.forEach(esp => formData.append('specialty', esp));

        // Enviar dados para o servidor
        const response = await fetch('/cadastrar-adestrador', {
          method: 'POST',
          body: formData
        });

        const resultado = await response.json();

        if (resultado.sucesso) {
          // Mostrar mensagem de sucesso
          const successMsg = document.getElementById('successMessage');
          successMsg.style.display = 'block';
          successMsg.textContent = resultado.mensagem;

          // Limpar form
          form.reset();

          // Redirecionar para login após 3 segundos
          setTimeout(() => {
            window.location.href = '/Login.ejs';
          }, 3000);

        } else {
          // Mostrar erro
          alert('Erro: ' + resultado.erro);
        }

      } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        alert('Erro ao processar cadastro. Verifique sua conexão e tente novamente.');
      } finally {
        // Restaurar botão
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    } else {
      // Scroll para o primeiro erro
      const firstError = form.querySelector('.error-message[style*="block"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  // Limpar erros quando o usuário começar a digitar
  [nameInput, cpfInput, emailInput, phoneInput, cityInput, experienceInput, priceInput, aboutInput, passwordInput, confirmPasswordInput].forEach(input => {
    input.addEventListener('input', function() {
      showError(this, false);
    });
  });

  stateSelect.addEventListener('change', function() {
    showError(this, false);
  });

  specialtyCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const specialtyContainer = form.querySelector('section.form-group:nth-child(7) .checkbox-group');
      if (hasSpecialtyChecked()) {
        showErrorCheckboxGroup(specialtyContainer, false);
      }
    });
  });

  termsCheckbox.addEventListener('change', function() {
    const termsError = this.parentElement.querySelector('.error-message');
    if (termsError) {
      termsError.style.display = this.checked ? 'none' : 'block';
    }
  });
});