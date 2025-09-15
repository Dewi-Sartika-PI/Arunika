// Auth dropdown tunggal di navbar:
// - Guest  : Masuk / Daftar
// - Login  : Avatar cewek (SVG statis) + dropdown (Nama + Logout)
// - Logout : jika di halaman privat -> redirect ke index; jika publik -> tetap di halaman tsb
(function (w) {
  const LS_KEY = 'arunika.session';       // remember=true
  const SS_KEY = 'arunika.session.tmp';   // remember=false

  // ----- utils -----
  function getSession() {
    // baca dari localStorage dulu, kalau kosong coba sessionStorage
    try {
      const raw = localStorage.getItem(LS_KEY) || sessionStorage.getItem(SS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function isProtectedPage() {
    // daftar halaman yang wajib login
    const p = location.pathname.toLowerCase();
    // tambahkan kalau ada halaman private lain
    return (
      p.endsWith('/lab-career.html') ||
      p.endsWith('/skill-match.html') ||
      p.endsWith('/road-map.html')
    );
  }

  function logoutAndRoute() {
    try { w.ArunikaSession?.logout?.(); } catch {}
    // UI akan dirender ulang setelah storage berubah, tapi kita panggil render manual juga
    renderAuthUI();
    if (isProtectedPage()) {
      // dari halaman privat -> lempar ke index
      location.replace('./index.html');
    }
    // kalau di halaman publik, cukup stay; navbar sudah berubah ke guest
  }

  // SVG avatar cewek statis (bukan avatar random / google)
  const femaleSVG = (size = 28) => `
<svg viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true" class="rounded-full">
  <defs>
    <linearGradient id="hairGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#5B3A82"/><stop offset="1" stop-color="#9C6BDF"/>
    </linearGradient>
  </defs>
  <circle cx="32" cy="32" r="30" fill="#F3F4F6"/>
  <path d="M16 36c0-10 6-18 16-18s16 8 16 18v10H16V36z" fill="url(#hairGrad)"/>
  <circle cx="32" cy="30" r="10" fill="#FFE1E8"/>
  <rect x="22" y="44" width="20" height="10" rx="5" fill="#EDE9FE"/>
  <circle cx="28" cy="29.5" r="1.7" fill="#6B7280"/>
  <circle cx="36" cy="29.5" r="1.7" fill="#6B7280"/>
  <path d="M27 35c1.6 1.6 8.4 1.6 10 0" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" fill="none"/>
</svg>`.trim();

  // ----- render -----
  function renderAuthUI() {
    const host = document.getElementById('auth-area');
    if (!host) return;
    host.innerHTML = '';

    const sess = getSession();
    if (!sess) {
      // GUEST: tombol Masuk & Daftar
      host.innerHTML = `
        <a href="login.html"
           class="px-4 py-2 rounded-full bg-brand-gold text-white font-semibold">Masuk</a>
        <a href="signup.html"
           class="px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 font-semibold text-white">Daftar</a>
      `;
      return;
    }

    // LOGGED-IN: avatar cewek + dropdown
    const name = (sess.name || sess.email || 'Akun').trim();

    const wrap = document.createElement('div');
    wrap.className = 'relative';

    // tombol avatar
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'userMenuBtn';
    btn.title = name; // tooltip nama
    btn.setAttribute('aria-haspopup', 'menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.className =
      'flex items-center gap-2 px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 transition border border-white/20 text-white';
    btn.innerHTML = `
      ${femaleSVG(28)}
      <svg class="w-4 h-4 opacity-80" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M7 10l5 5 5-5"></path>
      </svg>
    `;

    // dropdown
    const menu = document.createElement('div');
    menu.id = 'userMenu';
    menu.role = 'menu';
    menu.className =
      'absolute right-0 top-[120%] min-w-[180px] rounded-xl overflow-hidden border border-white/15 bg-[#2b0f3b] text-white shadow-2xl hidden';
    menu.innerHTML = `
      <div class="px-4 py-2 text-sm text-white/80 border-b border-white/10">${name}</div>
      <!-- Jika kamu punya halaman profil, buka komentar baris di bawah -->
      <!-- <a href="profile.html" class="block px-4 py-2 hover:bg-white/10 font-semibold" role="menuitem">Profil</a> -->
      <button id="logoutBtn" type="button"
              class="w-full text-left px-4 py-2 hover:bg-white/10 font-semibold text-red-300" role="menuitem">Logout</button>
    `;

    let open = false;
    const setOpen = (v) => {
      open = v;
      menu.classList.toggle('hidden', !open);
      btn.setAttribute('aria-expanded', String(open));
    };

    btn.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!open); });
    document.addEventListener('click', () => setOpen(false));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

    // action: logout
    menu.addEventListener('click', (e) => {
      const t = e.target;
      if (t && t.id === 'logoutBtn') {
        setOpen(false);
        logoutAndRoute();
      }
    });

    wrap.appendChild(btn);
    wrap.appendChild(menu);
    host.appendChild(wrap);
  }

  // expose untuk manual re-render jika perlu
  w.ArunikaAuthUI = { render: renderAuthUI };

  // render saat load
  document.addEventListener('DOMContentLoaded', renderAuthUI);

  // sinkron antar tab
  window.addEventListener('storage', (e) => {
    if (e.key === LS_KEY || e.key === SS_KEY) renderAuthUI();
  });
})(window);
