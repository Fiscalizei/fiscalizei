// ─── Dados das páginas do menu ───────────────────────────────────
var SIDEBAR_ROTAS = {
    painel:        { label: 'Painel geral',   icone: '⊞', href: 'home-admin.html' },
    tarefas:       { label: 'Minhas tarefas', icone: '☑', href: 'home-estoquista.html' },
    configuracoes: { label: 'Configurações',  icone: '⚙', href: 'configuracoes.html' },
};


// ─── Monta e injeta o HTML do sidebar no body ────────────────────
function initSidebar(opcoes) {
    var nome        = opcoes.nome        || 'Usuário';
    var cargo       = opcoes.cargo       || 'Cargo';
    var paginaAtiva = opcoes.paginaAtiva || 'tarefas';

    // Monta os itens de navegação
    var itensHTML = '';

    for (var pagina in SIDEBAR_ROTAS) {
        var rota  = SIDEBAR_ROTAS[pagina];
        var ativo = (pagina === paginaAtiva) ? 'ativo' : '';

        itensHTML += '<a href="' + rota.href + '" '
                   +    'class="sidebar-nav-item ' + ativo + '" '
                   +    'onclick="sidebarNavegar(event, \'' + pagina + '\')">'
                   +    '<span class="sidebar-nav-icone">' + rota.icone + '</span>'
                   +    '<span>' + rota.label + '</span>'
                   + '</a>';
    }

    // Monta o HTML completo do sidebar
    var html = ''
        + '<div class="sidebar-overlay" id="sidebarOverlay">'
        +     '<div class="sidebar-painel" id="sidebarPainel">'

        +         '<div class="sidebar-cabecalho">'
        +             '<button class="sidebar-fechar" onclick="sidebarFechar()">✕</button>'
        +             '<div class="sidebar-avatar">'
        +                 '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'
        +                     '<circle cx="12" cy="8" r="4"/>'
        +                     '<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>'
        +                 '</svg>'
        +             '</div>'
        +             '<p class="sidebar-nome">Olá, ' + nome + '</p>'
        +             '<p class="sidebar-cargo">' + cargo + '</p>'
        +         '</div>'

        +         '<nav class="sidebar-nav">'
        +             itensHTML
        +             '<div class="sidebar-divisor"></div>'
        +             '<button class="sidebar-nav-item sidebar-sair" onclick="sidebarSair()">'
        +                 '<span class="sidebar-nav-icone">⎋</span>'
        +                 '<span>Sair</span>'
        +             '</button>'
        +         '</nav>'

        +         '<div class="sidebar-rodape">'
        +             '<button class="sidebar-btn-voltar" onclick="sidebarFechar()">Voltar</button>'
        +         '</div>'

        +     '</div>'
        + '</div>';

    // Injeta no final do body
    document.body.insertAdjacentHTML('beforeend', html);

    // Fecha ao clicar no fundo escuro (fora do painel)
    document.getElementById('sidebarOverlay').addEventListener('click', function(e) {
        if (e.target.id === 'sidebarOverlay') {
            sidebarFechar();
        }
    });

    // Fecha com a tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            sidebarFechar();
        }
    });
}


// ─── Abre o sidebar ──────────────────────────────────────────────
function sidebarAbrir() {
    document.getElementById('sidebarOverlay').classList.add('aberto');
    document.body.style.overflow = 'hidden';
}


// ─── Fecha o sidebar ─────────────────────────────────────────────
function sidebarFechar() {
    document.getElementById('sidebarOverlay').classList.remove('aberto');
    document.body.style.overflow = '';
}


// ─── Logout ──────────────────────────────────────────────────────
function sidebarSair() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}