// Script para página de agendamentos do adestrador
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos do DOM
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    const novoAgendamentoBtn = document.getElementById('novoAgendamento');
    const modal = document.getElementById('novoAgendamentoModal');
    const closeModal = document.querySelector('.close-modal');
    const form = document.getElementById('novoAgendamentoForm');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const aplicarFiltrosBtn = document.getElementById('aplicarFiltros');
    const schedulingList = document.querySelector('.scheduling-list');
    const notificationFloat = document.querySelector('.notification-float');

    // Menu mobile
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Abrir modal de novo agendamento
    if (novoAgendamentoBtn && modal) {
        novoAgendamentoBtn.addEventListener('click', function() {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    // Fechar modal
    if (closeModal && modal) {
        closeModal.addEventListener('click', function() {
            fecharModal();
        });
    }

    // Fechar modal clicando fora
    if (modal) {
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                fecharModal();
            }
        });
    }

    // Função para fechar modal
    function fecharModal() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (form) {
            form.reset();
        }
    }

    // Submeter formulário de novo agendamento
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const cliente = document.getElementById('cliente').value;
            const data = document.getElementById('data').value;
            const horario = document.getElementById('horario').value;
            const tipoSessao = document.getElementById('tipoSessao').value;
            const local = document.getElementById('local').value;

            if (!cliente || !data || !horario || !tipoSessao || !local) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            // Criar novo agendamento
            criarNovoAgendamento({
                cliente: cliente,
                data: data,
                horario: horario,
                tipoSessao: tipoSessao,
                local: local
            });

            // Fechar modal e resetar form
            fecharModal();
            alert('Agendamento criado com sucesso!');
        });
    }

    // Função para criar novo agendamento na lista
    function criarNovoAgendamento(dados) {
        if (!schedulingList) return;

        const dataObj = new Date(dados.data + 'T00:00:00');
        const dia = dataObj.getDate().toString().padStart(2, '0');
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const mes = meses[dataObj.getMonth()];
        
        const horarioFim = calcularHorarioFim(dados.horario);
        
        const novoItem = document.createElement('section');
        novoItem.className = 'scheduling-item';
        novoItem.innerHTML = 
            '<section class="scheduling-date">' +
                '<span class="day">' + dia + '</span>' +
                '<span class="month">' + mes + '</span>' +
            '</section>' +
            '<section class="scheduling-details">' +
                '<h4>' + dados.cliente + ' <span class="dog-type">A definir</span></h4>' +
                '<p><i class="fas fa-clock"></i> ' + dados.horario + ' - ' + horarioFim + ' · <i class="fas fa-map-marker-alt"></i> ' + dados.local + '</p>' +
                '<p class="scheduling-type">' + dados.tipoSessao + ' · 1ª Sessão</p>' +
            '</section>' +
            '<section class="scheduling-status pendente">Pendente</section>' +
            '<section class="scheduling-actions">' +
                '<button class="btn btn-small edit-btn"><i class="fas fa-edit"></i></button>' +
                '<button class="btn btn-small btn-secondary delete-btn"><i class="fas fa-trash"></i></button>' +
            '</section>';
        
        schedulingList.insertBefore(novoItem, schedulingList.firstChild);
        adicionarEventListeners(novoItem);
    }

    // Função auxiliar para calcular horário de fim (1h30 depois)
    function calcularHorarioFim(horarioInicio) {
        const partes = horarioInicio.split(':');
        const horas = parseInt(partes[0]);
        const minutos = parseInt(partes[1]);
        
        const totalMinutos = (horas * 60) + minutos + 90; // adiciona 90 minutos
        const novasHoras = Math.floor(totalMinutos / 60);
        const novosMinutos = totalMinutos % 60;
        
        return novasHoras.toString().padStart(2, '0') + ':' + novosMinutos.toString().padStart(2, '0');
    }

    // Aplicar filtros
    if (aplicarFiltrosBtn) {
        aplicarFiltrosBtn.addEventListener('click', function() {
            const statusSelecionado = statusFilter ? statusFilter.value : 'todos';
            const dataSelecionada = dateFilter ? dateFilter.value : '';
            
            filtrarAgendamentos(statusSelecionado, dataSelecionada);
        });
    }

    // Auto-aplicar filtro quando mudar o select de status
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            const dataSelecionada = dateFilter ? dateFilter.value : '';
            filtrarAgendamentos(this.value, dataSelecionada);
        });
    }

    // Auto-aplicar filtro quando mudar a data
    if (dateFilter) {
        dateFilter.addEventListener('change', function() {
            const statusSelecionado = statusFilter ? statusFilter.value : 'todos';
            filtrarAgendamentos(statusSelecionado, this.value);
        });
    }

    // Função para filtrar agendamentos
    function filtrarAgendamentos(status, data) {
        const items = document.querySelectorAll('.scheduling-item');
        let itemsVisiveis = 0;
        
        items.forEach(function(item) {
            let mostrar = true;
            
            // Filtro por status
            if (status !== 'todos') {
                const statusElement = item.querySelector('.scheduling-status');
                if (statusElement && !statusElement.classList.contains(status)) {
                    mostrar = false;
                }
            }
            
            // Filtro por data
            if (data) {
                const dataObj = new Date(data + 'T00:00:00');
                const diaFiltro = dataObj.getDate().toString().padStart(2, '0');
                const diaElement = item.querySelector('.day');
                const diaItem = diaElement ? diaElement.textContent : '';
                
                if (diaItem !== diaFiltro) {
                    mostrar = false;
                }
            }
            
            item.style.display = mostrar ? 'flex' : 'none';
            if (mostrar) itemsVisiveis++;
        });
        
        // Mostrar mensagem se não houver resultados
        if (itemsVisiveis === 0) {
            mostrarMensagemSemResultados();
        } else {
            removerMensagemSemResultados();
        }
    }

    // Função para mostrar mensagem quando não há resultados
    function mostrarMensagemSemResultados() {
        if (!schedulingList) return;
        
        removerMensagemSemResultados();
        
        const mensagem = document.createElement('section');
        mensagem.className = 'sem-resultados';
        mensagem.style.textAlign = 'center';
        mensagem.style.padding = '2rem';
        mensagem.style.color = '#666';
        mensagem.innerHTML = 
            '<i class="fas fa-calendar-times" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>' +
            'Nenhum agendamento encontrado com os filtros selecionados.';
        
        schedulingList.appendChild(mensagem);
    }

    // Função para remover mensagem de sem resultados
    function removerMensagemSemResultados() {
        const mensagem = document.querySelector('.sem-resultados');
        if (mensagem) {
            mensagem.remove();
        }
    }

    // Adicionar event listeners para botões de ação
    function adicionarEventListeners(item) {
        const editBtn = item.querySelector('.edit-btn');
        const deleteBtn = item.querySelector('.delete-btn');
        
        if (editBtn) {
            editBtn.addEventListener('click', function() {
                editarAgendamento(item);
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                excluirAgendamento(item);
            });
        }
    }

    // Função para editar agendamento
    function editarAgendamento(item) {
        const statusElement = item.querySelector('.scheduling-status');
        if (!statusElement) return;
        
        const statusAtual = statusElement.textContent.toLowerCase();
        const novoStatus = prompt('Digite o novo status (confirmado, pendente, cancelado):', statusAtual);
        
        if (novoStatus && ['confirmado', 'pendente', 'cancelado'].includes(novoStatus.toLowerCase())) {
            // Remover classes de status anteriores
            statusElement.classList.remove('confirmado', 'pendente', 'cancelado');
            
            // Adicionar nova classe e texto
            statusElement.classList.add(novoStatus.toLowerCase());
            statusElement.textContent = novoStatus.charAt(0).toUpperCase() + novoStatus.slice(1);
            
            alert('Status atualizado com sucesso!');
        } else if (novoStatus !== null) {
            alert('Status inválido. Use: confirmado, pendente ou cancelado');
        }
    }

    // Função para excluir agendamento
    function excluirAgendamento(item) {
        const clienteElement = item.querySelector('h4');
        const cliente = clienteElement ? clienteElement.textContent : 'este agendamento';
        
        if (confirm('Tem certeza que deseja excluir o agendamento de ' + cliente + '?')) {
            item.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(function() {
                item.remove();
                alert('Agendamento excluído com sucesso!');
            }, 300);
        }
    }

    // Inicializar event listeners para itens existentes
    document.querySelectorAll('.scheduling-item').forEach(function(item) {
        adicionarEventListeners(item);
    });

    // Notificação flutuante
    if (notificationFloat) {
        notificationFloat.addEventListener('click', function() {
            alert('Você tem 3 notificações:\n\n• Novo agendamento pendente\n• Confirmação de sessão\n• Lembrete de sessão amanhã');
        });
    }

    // Limpar filtros quando a página carrega
    if (statusFilter) statusFilter.value = 'todos';
    if (dateFilter) dateFilter.value = '';

    // Adicionar estilos CSS necessários
    const style = document.createElement('style');
    style.textContent = 
        '.modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); }' +
        '.nav-links.active { display: flex !important; }' +
        '@media (max-width: 768px) { .nav-links { display: none; position: absolute; top: 100%; left: 0; width: 100%; background: #fff; flex-direction: column; box-shadow: 0 2px 10px rgba(0,0,0,0.1); } }';
    
    document.head.appendChild(style);
});

// Adicione este código no final do seu script, dentro do DOMContentLoaded

// Inicializar event listeners para itens existentes (CORRIGIDO)
function inicializarBotoesExistentes() {
    const items = document.querySelectorAll('.scheduling-item');
    items.forEach(function(item) {
        // Remove listeners antigos se existirem
        const editBtn = item.querySelector('.scheduling-actions .btn:first-child');
        const deleteBtn = item.querySelector('.scheduling-actions .btn:last-child');
        
        if (editBtn) {
            // Remove o listener antigo clonando o elemento
            const novoEditBtn = editBtn.cloneNode(true);
            editBtn.parentNode.replaceChild(novoEditBtn, editBtn);
            
            novoEditBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                editarAgendamento(item);
            });
        }
        
        if (deleteBtn) {
            // Remove o listener antigo clonando o elemento
            const novoDeleteBtn = deleteBtn.cloneNode(true);
            deleteBtn.parentNode.replaceChild(novoDeleteBtn, deleteBtn);
            
            novoDeleteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                excluirAgendamento(item);
            });
        }
    });
}

// Função melhorada para editar agendamento
function editarAgendamento(item) {
    const statusElement = item.querySelector('.scheduling-status');
    if (!statusElement) {
        alert('Erro: Status não encontrado');
        return;
    }
    
    const statusAtual = statusElement.textContent.trim().toLowerCase();
    const opcoes = ['confirmado', 'pendente', 'cancelado'];
    
    let mensagem = 'Selecione o novo status:\n\n';
    mensagem += '1 - Confirmado\n';
    mensagem += '2 - Pendente\n';
    mensagem += '3 - Cancelado\n\n';
    mensagem += 'Digite o número da opção (1, 2 ou 3):';
    
    const escolha = prompt(mensagem);
    
    if (escolha === '1' || escolha === '2' || escolha === '3') {
        const novoStatus = opcoes[parseInt(escolha) - 1];
        
        // Remover todas as classes de status
        statusElement.classList.remove('confirmado', 'pendente', 'cancelado');
        
        // Adicionar nova classe e texto
        statusElement.classList.add(novoStatus);
        statusElement.textContent = novoStatus.charAt(0).toUpperCase() + novoStatus.slice(1);
        
        // Feedback visual
        statusElement.style.transform = 'scale(1.1)';
        setTimeout(function() {
            statusElement.style.transform = 'scale(1)';
        }, 200);
        
        alert('Status atualizado para: ' + novoStatus.charAt(0).toUpperCase() + novoStatus.slice(1));
    } else if (escolha !== null) {
        alert('Opção inválida! Digite 1, 2 ou 3.');
    }
}

// Função melhorada para excluir agendamento
function excluirAgendamento(item) {
    const detailsElement = item.querySelector('.scheduling-details h4');
    const nomeCompleto = detailsElement ? detailsElement.textContent.trim() : 'este agendamento';
    
    // Pega só o nome do cliente (antes do tipo do cão)
    const nomeCliente = nomeCompleto.split(' ')[0] + ' ' + (nomeCompleto.split(' ')[1] || '');
    
    const confirmacao = confirm('⚠️ ATENÇÃO!\n\nDeseja realmente excluir o agendamento de:\n' + nomeCliente + '?\n\nEsta ação não poderá ser desfeita.');
    
    if (confirmacao) {
        // Animação de saída
        item.style.transition = 'all 0.3s ease-out';
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px) scale(0.95)';
        item.style.backgroundColor = '#ffebee';
        
        setTimeout(function() {
            try {
                item.remove();
                
                // Verificar se ainda existem agendamentos
                const agendamentosRestantes = document.querySelectorAll('.scheduling-item').length;
                if (agendamentosRestantes === 0) {
                    mostrarMensagemSemAgendamentos();
                }
                
                alert('✅ Agendamento excluído com sucesso!');
            } catch (error) {
                alert('Erro ao excluir agendamento. Tente novamente.');
            }
        }, 300);
    }
}

// Função para mostrar mensagem quando não há agendamentos
function mostrarMensagemSemAgendamentos() {
    const schedulingList = document.querySelector('.scheduling-list');
    if (!schedulingList) return;
    
    const mensagem = document.createElement('section');
    mensagem.className = 'sem-agendamentos';
    mensagem.style.cssText = `
        text-align: center;
        padding: 3rem 2rem;
        color: #666;
        background: #f8f9fa;
        border-radius: 8px;
        border: 2px dashed #ddd;
        margin: 2rem 0;
    `;
    mensagem.innerHTML = `
        <i class="fas fa-calendar-plus" style="font-size: 4rem; margin-bottom: 1rem; display: block; color: #ccc;"></i>
        <h3 style="margin: 0 0 0.5rem 0; color: #888;">Nenhum agendamento encontrado</h3>
        <p style="margin: 0; font-size: 0.9rem;">Clique em "Novo Agendamento" para começar</p>
    `;
    
    schedulingList.appendChild(mensagem);
}

// Chamar a função para inicializar os botões existentes
inicializarBotoesExistentes();

// Também adicione este CSS para melhorar o visual
const extraStyle = document.createElement('style');
extraStyle.textContent = `
    .scheduling-status {
        transition: transform 0.2s ease;
    }
    
    .scheduling-item {
        transition: all 0.3s ease;
    }
    
    .scheduling-actions .btn:hover {
        transform: scale(1.1);
    }
    
    .sem-agendamentos {
        animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(extraStyle);