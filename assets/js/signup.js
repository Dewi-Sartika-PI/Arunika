(function () {
  const form = document.getElementById('signup-form');
  const emailEl = document.getElementById('email');
  const passEl  = document.getElementById('password');
  const nameEl  = document.getElementById('name');

  const emailErr = document.getElementById('email-error');
  const passErr  = document.getElementById('pass-error');
  const toast    = document.getElementById('toast');

  const btn     = document.getElementById('signupBtn');
  const spinner = document.getElementById('spinner');

  const setLoading = (v) => {
    btn.disabled = v;
    spinner.classList.toggle('hidden', !v);
  };

  // Inline validation ringan
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

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const pass = passEl.value;

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passOk = (pass || '').length >= 8;

    emailErr.classList.toggle('hidden', emailOk);
    passErr.classList.toggle('hidden', passOk);
    if (!emailOk || !passOk) return;

    setLoading(true);
    try {
      // 1) Signup via MockAPI (ArunikaSession sudah handle cek duplikat)
      await ArunikaSession.signup({ name, email, password: pass });

      // 2) Auto-login (ingat perangkat)
      await ArunikaSession.login(email, pass, true);

      // 3) Toast & redirect
      toast.classList.remove('hidden');
      setTimeout(() => (location.href = './lab-career.html'), 700);
    } catch (err) {
      // Pesan khusus untuk email sudah ada
      if (err && err.message === 'EMAIL_EXISTS') {
        emailErr.textContent = 'Email sudah terdaftar.';
        emailErr.classList.remove('hidden');
      } else {
        alert('Gagal mendaftar. Coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  });
})();
