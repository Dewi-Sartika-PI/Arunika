// Helper sederhana untuk proteksi halaman & tombol menuju halaman protected
(function (w) {
  function isLoggedIn() {
    try { return !!w.ArunikaSession?.current(); } catch { return false; }
  }

  function requireLoginOrRedirect(loginPage) {
    if (!isLoggedIn()) {
      location.replace(loginPage || './login.html');
      return false;
    }
    return true;
  }

  // dipakai di tombol "ke Lab Career" dari halaman bebas (index, hasil quiz, dll)
  function goToLabCareer() {
    if (isLoggedIn()) location.href = './lab-career.html';
    else location.href = './login.html';
  }

  // opsional: untuk menu "Keluar"
  function logoutAndRedirect(url = './index.html') {
    try { w.ArunikaSession?.logout(); } catch {}
    location.replace(url);
  }

  w.Guard = { isLoggedIn, requireLoginOrRedirect, goToLabCareer, logoutAndRedirect };
})(window);
