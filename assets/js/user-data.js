/* assets/js/user-data.js */
window.UserData = (() => {
  // Ambil UID user dari session localStorage
  function getCurrentUserId() {
    try {
      const raw = localStorage.getItem('arunika.session');
      if (!raw) return null;
      const s = JSON.parse(raw);
      // >>>> SESUAIKAN jika struktur session kamu beda <<<<
      return s?.user?.id || s?.uid || s?.userId || null;
    } catch {
      return null;
    }
  }

  // Simpan hasil Skill Match (scoped per user + fallback lama)
  function saveSkillMatchResult(result) {
    const uid = getCurrentUserId();
    const payload = { ...result, updatedAt: Date.now() };

    // Scope per user
    if (uid) {
      localStorage.setItem(`arunika.user.${uid}.skillMatch`, JSON.stringify(payload));
    }

    // Fallback kompatibel (dipakai kode lama)
    if (typeof result.fit !== 'undefined') {
      localStorage.setItem('arunika.fit', String(result.fit));
    }
    if (typeof result.role !== 'undefined') {
      localStorage.setItem('arunika.role', String(result.role));
    }
  }

  // Baca hasil untuk user aktif (kalau tidak ada, fallback)
  function loadSkillMatchForCurrentUser() {
    const uid = getCurrentUserId();
    if (uid) {
      try {
        const raw = localStorage.getItem(`arunika.user.${uid}.skillMatch`);
        if (raw) return JSON.parse(raw);
      } catch {}
    }
    return {
      fit: Number(localStorage.getItem('arunika.fit') || 0),
      role: (localStorage.getItem('arunika.role') || '').toLowerCase(),
      strengths: [],
      actions: [],
      updatedAt: null,
    };
  }

  // (Opsional) Pindahkan data lama ke namespace user setelah login
  function migrateLegacySkillMatchToUserScope() {
    const uid = getCurrentUserId();
    if (!uid) return;
    const key = `arunika.user.${uid}.skillMatch`;
    if (localStorage.getItem(key)) return;

    const fit = localStorage.getItem('arunika.fit');
    const role = localStorage.getItem('arunika.role');
    if (fit || role) {
      const payload = {
        fit: Number(fit || 0),
        role: String(role || ''),
        strengths: [],
        actions: [],
        updatedAt: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(payload));
    }
  }

  return { getCurrentUserId, saveSkillMatchResult, loadSkillMatchForCurrentUser, migrateLegacySkillMatchToUserScope };
})();
