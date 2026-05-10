// ─── Dados das tarefas ────────────────────────────────────────────
// status possíveis: 'pendente' | 'progresso' | 'concluida'
var tasks = [
    { title: "Conferir recebimento da carga", subtitle: "Corredor A", id: "#TH123", status: "pendente"  },
    { title: "Conferir recebimento da carga", subtitle: "Corredor B", id: "#TH124", status: "progresso" },
    { title: "Verificar qualidade do produto", subtitle: "Armazém 1", id: "#TH125", status: "concluida" },
    { title: "Organizar estoque",              subtitle: "Seção C",   id: "#TH126", status: "pendente"  },
    { title: "Reabastecer prateleiras",        subtitle: "Corredor D",id: "#TH127", status: "progresso" }
];

// ─── Mapa de status → label e classe CSS ─────────────────────────
var STATUS_CONFIG = {
    pendente:  { label: 'Pendente',  classe: 'status-pendente'  },
    progresso: { label: 'Progresso', classe: 'status-progresso' },
    concluida: { label: 'Concluída', classe: 'status-concluida' }
};

// ─── Tab ativa no momento ─────────────────────────────────────────
var tabAtiva = 'afazer'; // 'afazer' | 'progresso' | 'concluidas'

// ─── Cards de tarefas ────────────────────────────────────────────
function createTaskCard(task) {
    var config = STATUS_CONFIG[task.status] || STATUS_CONFIG['pendente'];

    var card = document.createElement('div');
    card.className = 'task-card';
    card.innerHTML = ''
        + '<div class="task-icon">'
        +     '<img src="recursos/imagens/icon-task.svg" alt="">'
        + '</div>'
        + '<div class="task-content">'
        +     '<div class="task-title">'      + task.title    + '</div>'
        +     '<div class="task-subtitle">- ' + task.subtitle + '</div>'
        +     '<div class="task-id">ID: '     + task.id       + '</div>'
        + '</div>'
        + '<span class="task-status ' + config.classe + '">' + config.label + '</span>';

    return card;
}

// ─── Filtra tarefas pela tab ativa ───────────────────────────────
function getTasksFiltradas() {
    if (tabAtiva === 'afazer')     return tasks.filter(function(t) { return t.status === 'pendente';  });
    if (tabAtiva === 'progresso')  return tasks.filter(function(t) { return t.status === 'progresso'; });
    if (tabAtiva === 'concluidas') return tasks.filter(function(t) { return t.status === 'concluida'; });
    return tasks;
}

function loadTasks() {
    var container = document.getElementById('tasks-list');
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

// ─── Troca de tab ────────────────────────────────────────────────
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

// ─── Inicialização geral ─────────────────────────────────────────
window.onload = function() {
    var userData = JSON.parse(localStorage.getItem('user') || '{}');

    initSidebar({
        nome: userData.nome || 'Usuário',
        cargo: userData.role || 'Colaborador',
        paginaAtiva: 'tarefas'
    });

    loadTasks();
};