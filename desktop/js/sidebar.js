/**
 * sidebar.js — Componente de sidebar compartilhado
 * Inclua este script em todas as páginas e chame:
 *   Sidebar.init('dashboard' | 'criar' | 'aprovacao')
 */

const Sidebar = (() => {
  const PAGES = {
    dashboard: { href: 'dashboard.html', icon: 'bx-bar-chart-alt-2', label: 'Dashboard' },
    criar:     { href: 'tarefa-cadastro.html', icon: 'bx-plus', label: 'Criar tarefa' },
    aprovacao: { href: 'aprovar-tarefa.html', icon: 'bx-check-circle', label: 'Aprovação' },
  };

  function init(activePage) {
    const sidebar = document.createElement('nav');
    sidebar.className = 'sidebar';

    // Logo
    const logo = document.createElement('div');
    logo.className = 'logo';
    const logoImg = document.createElement('img');
    logoImg.src = '/assetsport/logo_fiscalizei.png';
    logoImg.alt = 'Fiscalizei';
    logo.appendChild(logoImg);
    sidebar.appendChild(logo);

    // Menu icons
    const menuIcons = document.createElement('div');
    menuIcons.className = 'menu-icons';

    Object.entries(PAGES).forEach(([key, page]) => {
      const link = document.createElement('a');
      link.href = page.href;
      link.title = page.label;
      link.className = 'sidebar-link';

      const icon = document.createElement('i');
      icon.className = `bx ${page.icon}${key === activePage ? ' active' : ''}`;
      link.appendChild(icon);
      menuIcons.appendChild(link);
    });

    sidebar.appendChild(menuIcons);

    // User footer
    const footer = document.createElement('div');
    footer.className = 'user-footer';
    const userIcon = document.createElement('i');
    userIcon.className = 'bx bx-user-circle';
    footer.appendChild(userIcon);
    sidebar.appendChild(footer);

    // Inject into body as first child
    document.body.prepend(sidebar);
  }

  return { init };
})();
