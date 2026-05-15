// ============================================================
//  FISCALIZEI — painel-geral.js
// ============================================================

// ─── Mock de dados do painel ──────────────────────────────
// TODO: substituir por chamada à API quando estiver pronta
var PAINEL_MOCK = {
    tarefasConcluidas: 12,
    tarefasTotal:      15,
    percentual:        80,
    ultimaSync:        '07:45'
};

/*
// TODO: descomentar quando a API estiver pronta
async function buscarDadosPainelAPI() {
    var token = localStorage.getItem('token') || '';
    var resposta = await fetch('http://localhost:8080/api/painel', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });
    if (!resposta.ok) throw new Error('Erro ao buscar painel');
    return await resposta.json();
    // Espera retorno: { tarefasConcluidas, tarefasTotal, percentual, ultimaSync }
}
*/

async function buscarDadosPainel() {
    // TODO: trocar por buscarDadosPainelAPI() quando a API estiver pronta
    await new Promise(function(r) { setTimeout(r, 400); }); // simula delay
    return PAINEL_MOCK;
}

// ─── Renderiza os dados na tela ───────────────────────────
function renderizarPainel(dados) {
    var barra   = document.getElementById('barraProgresso');
    var legenda = document.getElementById('barraLegenda');
    var sync    = document.getElementById('painelSync');

    // Anima a barra após um frame para a transição CSS funcionar
    requestAnimationFrame(function() {
        barra.style.width = dados.percentual + '%';
    });

    legenda.textContent = dados.percentual + '% Concluída ('
        + dados.tarefasConcluidas + '/' + dados.tarefasTotal + ' tarefas)';

    sync.textContent = 'Dados sincronizados às ' + dados.ultimaSync;
}

// ─── Volta para lista de tarefas ──────────────────────────
function voltarParaLista() {
    window.location.href = 'home-estoquista.html';
}

// ─── Inicialização ────────────────────────────────────────
window.onload = async function() {
    var userData = JSON.parse(localStorage.getItem('user') || '{}');

    initSidebar({
        nome: userData.nome || 'Usuário',
        cargo: userData.role || 'Colaborador',
        paginaAtiva: 'painel'
    });

    try {
        var dados = await buscarDadosPainel();
        renderizarPainel(dados);
    } catch (erro) {
        document.getElementById('barraLegenda').textContent = 'Erro ao carregar dados.';
    }
};