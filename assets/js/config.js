// assets/js/config.js
(function (w) {
  // GANTI ini dengan domain project kamu (tanpa /api/v1, tanpa /users di belakang)
  const BASE   = 'https://68c52bd4a712aaca2b680abe.mockapi.io';
  // Kalau di MockAPI resource kamu berada di /api/v1, isi sesuai (huruf kecil semua)
  const PREFIX = '/api/v1';   // kalau projectmu tanpa prefix, jadikan ''.

  const join = (path) => `${BASE}${PREFIX}${path}`;

  w.API = {
    users: () => join('/users'),
    user:  (id) => join(`/users/${id}`),
  };
})(window);
