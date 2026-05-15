document.addEventListener('DOMContentLoaded', () => {

    // Pegando os elementos do HTML pelo ID
    const loginForm = document.getElementById('loginForm');
    const loginBox = document.getElementById('login-box');
    const loadingBox = document.getElementById('loading-box');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');

    // Botão de mostrar/ocultar senha
    const togglePassword = document.getElementById('togglePassword');

    // Verifica se o botão existe
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {

            // Alterna entre "password" (escondido) e "text" (visível)
            const type = senhaInput.getAttribute('type') === 'password' ? 'text' : 'password';

            // Aplica o novo tipo no input
            senhaInput.setAttribute('type', type);

            // Troca o ícone (olho aberto e olho fechado)
            togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
        });
    }

    // dispara o evento quando envia o formulario
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();


        //pega os valores digitados e remove espaços extras
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();

        // Regex para validar formato de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validação: campos vazios
        if (email === '' || senha === '') {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        // Validação: formato de e-mail inválido
        if (!emailRegex.test(email)) {
            alert('Por favor, insira um e-mail válido (exemplo: seuemail@dominio.com).');
            return;
        }

        // Esconde o formulário e mostra o loading
        loginBox.classList.add('hidden');
        loadingBox.classList.remove('hidden');

        try {
            // Faz requisição para API de login
            const resposta = await fetch('http://localhost:8080/api/usuario/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    senha: senha
                })
            });

            if (resposta.ok) {
            const dados = await resposta.json();

            // Salva o token (se existir)
            if (dados.token) {
                localStorage.setItem('token', dados.token);
            }

            // Salva os dados do usuário
            localStorage.setItem('user', JSON.stringify({
                nome: dados.nome,
                email: dados.email,
                role: dados.role,
                id: dados.id
            }));

            // Redirecionamento baseado no role
            if (dados.role === 'ADMIN') {
                alert(`Bem-vindo, ${dados.nome || 'Administrador'}!`);
                window.location.href = '/admin/dashboard.html';
            } 
            else if (dados.role === 'COLABORADOR') {
                window.location.href = 'home-estoquista.html';
            } 
            else {
                alert('Perfil de usuário não reconhecido.');
                localStorage.clear();
                window.location.href = 'login.html';
            }

        } else {
            // Se credenciais inválidas
            throw new Error('E-mail ou senha incorretos.');
        }

        } catch (erro) {
            // Erro de conexão ou falha no login
            alert(erro.message || 'Erro ao conectar no servidor. Tente novamente.');

            // Volta para tela de login
            loadingBox.classList.add('hidden');
            loginBox.classList.remove('hidden');

            // Limpa senha
            senhaInput.value = '';

            // Volta input para tipo password
            senhaInput.setAttribute('type', 'password');

            // Reseta ícone do olho
            if (togglePassword) togglePassword.textContent = '👁️';
        }
    });
});