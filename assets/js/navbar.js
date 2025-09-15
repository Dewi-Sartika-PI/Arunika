// Muat partial navbar + init theme toggle + highlight halaman aktif + panggil Auth UI
(function () {
  async function loadNavbar() {
    const mount = document.getElementById('navbar-root');
    if (!mount) return;

    // inject partial
    const res = await fetch('./assets/components/navbar.html', { cache: 'no-store' });
    mount.innerHTML = await res.text();

    // efek top-glass saat scroll
    const onScroll = () => {
      document.body.classList.toggle('scrolled', (window.scrollY || document.documentElement.scrollTop) > 4);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // highlight link aktif
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('header nav a').forEach(a => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href && href === path) a.classList.add('ring-2', 'ring-white/60');
    });

    // theme toggle
    const btn   = document.getElementById('theme-toggle');
    const light = document.getElementById('theme-toggle-light-icon');
    const dark  = document.getElementById('theme-toggle-dark-icon');

    function setTheme(mode) {
      const isDark = mode === 'dark';
      document.documentElement.classList.toggle('dark', isDark);
      document.body.classList.toggle('dark', isDark);
      document.body.classList.toggle('light', !isDark);
      dark?.classList.toggle('hidden', !isDark);
      light?.classList.toggle('hidden', isDark);
      localStorage.setItem('color-theme', isDark ? 'dark' : 'light');
      btn?.setAttribute('aria-pressed', String(isDark));
    }
    const saved = localStorage.getItem('color-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(saved ? saved : prefersDark ? 'dark' : 'light');

    btn?.addEventListener('click', () => {
      setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
    });

    // render auth (Masuk/Daftar atau Avatar+Dropdown)
    window.ArunikaAuthUI?.render?.();
  }

  window.Navbar = { load: loadNavbar };
  document.addEventListener('DOMContentLoaded', loadNavbar);
})();
