// assets/js/config.js
(function (w) {
  // BASE URL Anda sudah benar
  const BASE   = 'https://68c5526da712aaca2b6872b6.mockapi.io';
  
  // PREFIX ini harus dikosongkan karena tidak ada di URL Anda
  const PREFIX = '';
  



  // Fungsi ini tidak perlu diubah

  const join = (path) => `${BASE}${PREFIX}${path}`;

  w.API = {
    users: () => join('/users'),
    user:  (id) => join(`/users/${id}`),
  };
})(window);