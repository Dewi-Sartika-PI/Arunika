// assets/js/signup-page.js
(function () {
  const form    = document.getElementById('signup-form');
  const nameEl  = document.getElementById('name');
  const emailEl = document.getElementById('email');
  const passEl  = document.getElementById('password');

  const emailErr = document.getElementById('email-error');
  const passErr  = document.getElementById('pass-error');
  const toast    = document.getElementById('toast');

  const btn     = document.getElementById('signupBtn'); // optional: kasih id di HTML
  const spinner = document.getElementById('spinner');   // optional: kasih icon spinner di HTML

  const setLoading = (v) => {
    if (btn) btn.disabled = v;
    if (spinner) spinner.classList.toggle('hidden', !v);
  };

  // --- inline validation ringan ---
  emailEl.addEventListener('input', () => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim());
    emailErr.classList.toggle('hidden', ok || emailEl.value === '');
  });
  passEl.addEventListener('input', () => {
    const ok = (passEl.value || '').length >= 8;
    passErr.classList.toggle('hidden', ok || passEl.value === '');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name  = nameEl.value.trim();
    const email = emailEl.value.trim();
    const pass  = passEl.value;

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passOk  = (pass || '').length >= 8;

    emailErr.classList.toggle('hidden', emailOk);
    passErr.classList.toggle('hidden',  passOk);
    if (!emailOk || !passOk) return;

    setLoading(true);
    try {
      // 1) Signup ke MockAPI (ArunikaSession sudah cek duplikat & saveSession)
      await ArunikaSession.signup({ name, email, password: pass });

      // 2) Tampilkan toast (opsional) & redirect ke index
      if (toast) {
        toast.textContent = 'Akun berhasil dibuat. Mengalihkan…';
        toast.classList.remove('hidden');
      }
      setTimeout(() => location.replace('../index.html'), 700);
    } catch (err) {
      const msg = (err && err.message) ? String(err.message) : '';
      if (msg.toLowerCase().includes('sudah terdaftar')) {
        emailErr.textContent = 'Email sudah terdaftar.';
        emailErr.classList.remove('hidden');
      } else {
        alert(`Gagal mendaftar: ${msg || 'Coba lagi.'}`);
      }
    } finally {
      setLoading(false);
    }
  });
})();
