/**
 * Session & Auth ringan untuk MockAPI
 * - Simpan session di localStorage / sessionStorage (tergantung "remember").
 * - Validasi unik email via filter ?email=...
 * - ⚠️ Prototipe: password disimpan plaintext di MockAPI (JANGAN untuk produksi).
 */
(function (w) {
  const LS_KEY = 'arunika.session'; // localStorage (remember=true)
  const SS_KEY = 'arunika.session.tmp'; // sessionStorage (remember=false)

  async function request(url, options = {}) {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) {
      let msg = res.statusText;
      try { msg = await res.text(); } catch (_) {}
      const err = new Error(`API error ${res.status}: ${msg || res.statusText}`);
      err.status = res.status;
      throw err;
    }
    if (res.status === 204 || res.headers.get('content-length') === '0') {
      return null;
    }
    return res.json();
  }

  // ----- Session helpers -----
  function saveSessionObj(obj, remember) {
    const data = JSON.stringify(obj);
    if (remember) {
      localStorage.setItem(LS_KEY, data);
      sessionStorage.removeItem(SS_KEY);
    } else {
      sessionStorage.setItem(SS_KEY, data);
      localStorage.removeItem(LS_KEY);
    }
  }

  function clearSession() {
    localStorage.removeItem(LS_KEY);
    sessionStorage.removeItem(SS_KEY);
  }

  function getSession() {
    const raw = localStorage.getItem(LS_KEY) || sessionStorage.getItem(SS_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  function toSessionPayload(user) {
    return {
      userId: user.id,
      email: user.email,
      name: user.name || '',
    };
  }

  /**
   * Cari pengguna berdasarkan email (case-insensitive).
   * Menggunakan filter di MockAPI agar efisien.
   */
  async function findUserByEmail(email) {
    if (!email) return null;
    const url = API.users() + `?email=${encodeURIComponent(email)}&limit=1`;
    const users = await request(url);
    if (!Array.isArray(users)) return null;
    // Cari yang benar-benar cocok (case-insensitive)
    return users.find(user => user && typeof user.email === 'string' && user.email.toLowerCase() === email.toLowerCase()) || null;
  }

  w.ArunikaSession = {
    /**
     * Buat akun baru
     * @param {{name:string,email:string,password:string,avatar?:string}} payload
     * @returns {Promise<object>} user
     */
    async signup(payload) {
      const { name, email, password } = payload || {};
      if (!name || !email || !password) {
        const err = new Error('Data tidak lengkap.');
        err.code = 'INVALID_INPUT';
        throw err;
      }

      // Cek apakah email sudah ada
      const existing = await findUserByEmail(email);
      if (existing) {
        const err = new Error('Email sudah terdaftar.');
        err.code = 'EMAIL_EXISTS';
        throw err;
      }

      const user = await request(API.users(), {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password, // ⚠️ plaintext hanya untuk demo
        }),
      });

      // default: treat signup sebagai "remember"
      saveSessionObj(toSessionPayload(user), true);
      return user;
    },

    /**
     * Login (email + password)
     * @param {string} email
     * @param {string} password
     * @param {boolean} [remember=false]
     */
    async login(email, password, remember = false) {
      if (!email || !password) {
        const err = new Error('Email/Password wajib diisi.');
        err.code = 'INVALID_INPUT';
        throw err;
      }
      const user = await findUserByEmail(email);
      if (!user) {
        const err = new Error('Akun tidak ditemukan.');
        err.code = 'NOT_FOUND';
        throw err;
      }
      if ((user.password || '') !== password) {
        const err = new Error('Password salah.');
        err.code = 'WRONG_PASSWORD';
        throw err;
      }
      saveSessionObj(toSessionPayload(user), !!remember);
      return user;
    },

    /**
     * Google login dummy (buat akun otomatis jika belum ada)
     */
    async loginWithGoogle(mockEmail, mockName) {
      const email = mockEmail || `user_${Date.now()}@example.com`;
      let user = await findUserByEmail(email);
      if (!user) {
        user = await request(API.users(), {
          method: 'POST',
          body: JSON.stringify({
            name: mockName || 'Google User',
            email,
            password: 'google-oauth', // dummy
          }),
        });
      }
      saveSessionObj(toSessionPayload(user), true);
      return user;
    },

    logout() { clearSession(); },

    current() { return getSession(); },
    
    guard() {
      if (!this.current()) {
        location.replace('./login.html');
      }
    }
  };
})(window);