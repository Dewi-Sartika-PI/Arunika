// Render status login di navbar (Masuk/Daftar vs Avatar + Keluar)
(function (w) {
  const KEY = 'arunika.session';

  function getSession() {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); }
    catch { return null; }
  }

  function renderAuthUI() {
    const wrap = document.getElementById('auth-area');
    if (!wrap) return;
    wrap.innerHTML = '';

    const sess = getSession();

    if (!sess) {
      // Belum login → tombol Masuk / Daftar
      wrap.innerHTML = `
        <a href="login.html" class="px-4 py-2 rounded-full bg-brand-gold text-white font-semibold">Masuk</a>
        <a href="signup.html" class="px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 font-semibold text-white">Daftar</a>
      `;
      return;
    }

    // Sudah login → chip avatar + menu
    const holder = document.createElement('div');
    holder.style.position = 'relative';

    const chip = document.createElement('button');
    chip.className = 'auth-chip';
    chip.id = 'auth-chip';
    chip.innerHTML = `
      <img src="${sess.avatar || 'https://i.pravatar.cc/40?u=' + (sess.email || sess.userId)}" alt="" class="w-7 h-7 rounded-full">
      <span class="hidden sm:inline font-semibold">${(sess.name || sess.email || 'User').split(' ')[0]}</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="opacity-70"><path d="M7 10l5 5 5-5z"/></svg>
    `;

    const menu = document.createElement('div');
    menu.className = 'auth-menu hidden';
    menu.innerHTML = `
      <a href="lab-career.html">Lab Career</a>
      <hr class="my-1 border border-soft">
      <button type="button" id="logout-btn" class="text-red-600">Keluar</button>
    `;

    holder.appendChild(chip);
    holder.appendChild(menu);
    wrap.appendChild(holder);

    let open = false;
    const toggle = () => { open = !open; menu.classList.toggle('hidden', !open); };
    chip.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    document.addEventListener('click', () => { open = false; menu.classList.add('hidden'); });

    // Logout
    menu.querySelector('#logout-btn').addEventListener('click', () => {
      if (w.ArunikaSession && ArunikaSession.logout) ArunikaSession.logout();
      renderAuthUI();
      if (location.pathname.endsWith('lab-career.html')) location.replace('./index.html');
    });
  }

  // expose untuk manual re-render jika perlu
  w.ArunikaAuthUI = { render: renderAuthUI };

  // render saat load
  document.addEventListener('DOMContentLoaded', renderAuthUI);

  // sinkron antar tab
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) renderAuthUI();
  });
})(window);
