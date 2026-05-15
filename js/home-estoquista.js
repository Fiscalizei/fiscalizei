// ─── Dados das tarefas ────────────────────────────────────────────
// status possíveis: 'pendente' | 'progresso' | 'concluida'

async function todasTarefas() {
    var token = localStorage.getItem('token') || '';
    var userData = JSON.parse(localStorage.getItem('user') || '{}');

    var resposta = await fetch(`http://localhost:8080/api/tarefa/colaborador/${userData.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });

    if (!resposta.ok) {
        throw new Error('Tarefa não encontrada (status ' + resposta.status + ')');
    }

    console.log(resposta.json())

    return await resposta.json();
}


var tasks = todasTarefas();

// ─── Mapa de status (Ajustado para o retorno em Maiúsculas do Java) ──────
var STATUS_CONFIG = {
    'PENDENTE':  { label: 'Pendente',  classe: 'status-pendente'  },
    'PROGRESSO': { label: 'Progresso', classe: 'status-progresso' },
    'CONCLUIDA': { label: 'Concluída', classe: 'status-concluida' }
};

// ─── Tab ativa ────────────────────────────────────────────────────
var tabAtiva = 'afazer'; 

function abrirTarefa(id) {
    window.location.href = 'detalhe-tarefa.html?id=' + id;
}

// ─── Cards de tarefas (Ajustado para os novos campos) ──────────────
function createTaskCard(task) {
    // Busca a configuração usando o status vindo do banco (ex: "PENDENTE")
    var config = STATUS_CONFIG[task.status] || STATUS_CONFIG['PENDENTE'];

    var card = document.createElement('div');
    card.className = 'task-card';
    card.style.cursor = 'pointer';

    card.innerHTML = ''
        + '<div class="task-icon">'
        +     '<img src="../recursos/imagens/icon-task.svg" alt="">'
        + '</div>'
        + '<div class="task-content">'
        +     '<div class="task-title">'      + task.descricao    + '</div>'
        +     '<div class="task-subtitle">Recorrência: ' + task.recorrencia + '</div>'
        +     '<div class="task-id">ID: #'   + task.id       + '</div>'
        + '</div>'
        + '<span class="task-status ' + config.classe + '">' + config.label + '</span>';

    card.addEventListener('click', function() {
        abrirTarefa(task.id);
    });

    return card;
}

// ─── Filtra tarefas (Ajustado para comparar com Strings MAIÚSCULAS) ──────
function getTasksFiltradas() {
    if (tabAtiva === 'afazer')     return tasks.filter(function(t) { return t.status === 'PENDENTE';  });
    if (tabAtiva === 'progresso')  return tasks.filter(function(t) { return t.status === 'PROGRESSO'; });
    if (tabAtiva === 'concluidas') return tasks.filter(function(t) { return t.status === 'CONCLUIDA'; });
    return tasks;
}

function loadTasks() {
    var container = document.getElementById('tasks-list');
    if (!container) return;
    
    container.innerHTML = '';
    var filtradas = getTasksFiltradas();

    if (filtradas.length === 0) {
        container.innerHTML = '<p class="tasks-vazio">Nenhuma tarefa encontrada.</p>';
        return;
    }

    for (var i = 0; i < filtradas.length; i++) {
        container.appendChild(createTaskCard(filtradas[i]));
    }
}

function changeTab(tabElement) {
    var tabs = document.querySelectorAll('.tab');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    tabElement.classList.add('active');

    var texto = tabElement.textContent.trim();
    if (texto === 'A fazer')      tabAtiva = 'afazer';
    if (texto === 'Em Progresso') tabAtiva = 'progresso';
    if (texto === 'Concluídas')   tabAtiva = 'concluidas';

    loadTasks();
}

window.onload = function() {
    var userData = JSON.parse(localStorage.getItem('user') || '{}');

    // Inicializa sidebar (se a função existir no seu projeto)
    if (typeof initSidebar === "function") {
        initSidebar({
            nome: userData.nome || 'Usuário',
            cargo: userData.role || 'Colaborador',
            paginaAtiva: 'tarefas'
        });
    }

    // Exemplo de como você deve carregar os dados da sua API
    fetch('http://localhost:8080/api/tarefa')
        .then(response => response.json())
        .then(data => {
            tasks = data; // Armazena o retorno da API na variável global
            loadTasks();
        })
        .catch(err => console.error("Erro ao carregar tarefas:", err));
};