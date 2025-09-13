// assets/js/config.js
(function (w) {
  // GANTI dengan base MockAPI kamu, contoh:
  // const BASE = 'https://65f7c9e9d1f1dc9.mockapi.io';
  const BASE = 'https://<SUBDOMAIN>.mockapi.io';

  // Jika di MockAPI kamu pakai prefix (mis. /api/v1). Kalau tidak, jadikan ''.
  const PREFIX = '/api/v1';

  const join = (path) => `${BASE}${PREFIX}${path}`;

  w.API = {
    users: () => join('/users'),
    user:  (id) => join(`/users/${id}`),
    // Tambah resource lain di sini bila perlu:
    // jobs: () => join('/jobs'),
    // job:  (id) => join(`/jobs/${id}`),
  };
})(window);
