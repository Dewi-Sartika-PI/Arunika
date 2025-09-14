document.addEventListener("DOMContentLoaded", function() {
  // Fungsi untuk memuat komponen dari file eksternal
  const loadComponent = (selector, filePath) => {
    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Gagal memuat ${filePath}: ${response.statusText}`);
        }
        return response.text();
      })
      .then(data => {
        const element = document.querySelector(selector);
        if (element) {
          element.innerHTML = data;
        } else {
          console.error(`Elemen dengan selector '${selector}' tidak ditemukan.`);
        }
      })
      .catch(error => console.error("Error memuat komponen:", error));
  };

  // Muat navbar dan footer
  loadComponent("#navbar-placeholder", "./components/navbar.html");
  loadComponent("#footer-placeholder", "./components/footer.html");
});