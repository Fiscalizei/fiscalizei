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


        //pega os valores digitados 
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === '' || senha === '') {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        if (!emailRegex.test(email)) {
            alert('Por favor, insira um e-mail válido (exemplo: seuemail@dominio.com).');
            return;
        }

        loginBox.classList.add('hidden');
        loadingBox.classList.remove('hidden');

        try {
            const resposta = await fetch('http://localhost:8080/api/v1/auth/login', {
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
                localStorage.setItem('token', dados.token); 
                
               
                
                alert('Login efetuado com sucesso!');
            } else {
                throw new Error('E-mail ou senha incorretos.');
            }

        } catch (erro) {
            alert(erro.message || 'Erro ao conectar no servidor. Tente novamente.');
            loadingBox.classList.add('hidden');
            loginBox.classList.remove('hidden');
            senhaInput.value = ''; 
            senhaInput.setAttribute('type', 'password');
            if (togglePassword) togglePassword.textContent = '👁️';
        }
    });
});