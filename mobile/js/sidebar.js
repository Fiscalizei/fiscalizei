// ============================================================
//  FISCALIZEI — sidebar.js
// ============================================================

var SIDEBAR_ROTAS = {
    painel:        { label: 'Painel geral',   icone: '⊞', href: 'painel-geral.html' },
    tarefas:       { label: 'Minhas tarefas', icone: '☑', href: 'home-estoquista.html' },
    configuracoes: { label: 'Configurações',  icone: '⚙', href: 'configuracoes.html' },
};

// ─── SVG padrão quando não há foto ───────────────────────
var AVATAR_SVG = ''
    + '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'
    +     '<circle cx="12" cy="8" r="4"/>'
    +     '<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>'
    + '</svg>';

// ─── Monta e injeta o HTML do sidebar ────────────────────
function initSidebar(opcoes) {
    var nome        = opcoes.nome        || 'Usuário';
    var cargo       = opcoes.cargo       || 'Cargo';
    var paginaAtiva = opcoes.paginaAtiva || 'tarefas';

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

    // Começa com o SVG padrão — a foto é carregada depois de forma assíncrona
    var html = ''
        + '<div class="sidebar-overlay" id="sidebarOverlay">'
        +     '<div class="sidebar-painel" id="sidebarPainel">'
        +         '<div class="sidebar-cabecalho">'
        +             '<button class="sidebar-fechar" onclick="sidebarFechar()">✕</button>'
        +             '<div class="sidebar-avatar" id="sidebarAvatar">'
        +                 AVATAR_SVG
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

    document.body.insertAdjacentHTML('beforeend', html);

    // Fecha ao clicar no overlay
    document.getElementById('sidebarOverlay').addEventListener('click', function(e) {
        if (e.target.id === 'sidebarOverlay') sidebarFechar();
    });

    // Fecha com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') sidebarFechar();
    });

    // Carrega a foto do usuário de forma assíncrona
    sidebarCarregarFoto();
}

// ─── Busca a foto do servidor e exibe no avatar ───────────
function sidebarCarregarFoto() {
    var userData = JSON.parse(localStorage.getItem('user') || '{}');
    var id       = userData.id;
    var token    = localStorage.getItem('token') || '';

    if (!id) return; // sem id salvo, mantém SVG

    fetch('http://localhost:8080/api/usuario/' + id + '/foto', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(function(res) {
        if (!res.ok) return null; // sem foto cadastrada, mantém SVG
        return res.blob();
    })
    .then(function(blob) {
        if (!blob) return;

        var avatarEl = document.getElementById('sidebarAvatar');
        if (!avatarEl) return;

        // Substitui o SVG por uma <img> com a foto
        var url = URL.createObjectURL(blob);
        avatarEl.innerHTML = '<img src="' + url + '" class="sidebar-avatar-foto" alt="Foto de perfil">';
    })
    .catch(function() {}); // silencioso — mantém SVG se der erro
}

// ─── Abre o sidebar ──────────────────────────────────────
function sidebarAbrir() {
    document.getElementById('sidebarOverlay').classList.add('aberto');
    document.body.style.overflow = 'hidden';
}

// ─── Fecha o sidebar ─────────────────────────────────────
function sidebarFechar() {
    document.getElementById('sidebarOverlay').classList.remove('aberto');
    document.body.style.overflow = '';
}

// ─── Navegação entre páginas ─────────────────────────────
function sidebarNavegar(event, pagina) {
    sidebarFechar();
}

// ─── Logout ──────────────────────────────────────────────
function sidebarSair() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}