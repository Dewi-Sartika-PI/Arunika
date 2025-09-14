// assets/js/footer.js

function renderFooter() {
  const footerHTML = `
    <footer class="relative z-0 footer-cyber-bg">
      <div class="container mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="col-span-2 md:col-span-2">
            <div class="inline-block [perspective:1000px] sr" data-sr>
              <img id="footer-logo" src="./assets/img/logo.png" alt="Arunika Logo" class="h-12 w-auto footer-tilt" />
            </div>
            <p class="mt-4 max-w-xs text-lg leading-relaxed text-muted sr" data-sr data-sr-delay="120">
              Playlist karir personalmu untuk masa depan yang lebih cerah.
            </p>
          </div>
          <div class="sr" data-sr>
            <h4 class="font-bold mb-4 text-xl">Perusahaan</h4>
            <ul class="space-y-3 text-lg">
              <li><a href="#" class="footer-link-hover text-muted">Tentang Kami</a></li>
              <li><a href="#" class="footer-link-hover text-muted">Partner</a></li>
              <li><a href="#" class="footer-link-hover text-muted">Press Kit</a></li>
            </ul>
          </div>
          <div class="sr" data-sr data-sr-delay="80">
            <h4 class="font-bold mb-4 text-xl">Sosial Media</h4>
            <ul class="space-y-3 text-lg">
              <li><a href="#" class="footer-link-hover text-muted">Twitter</a></li>
              <li><a href="#" class="footer-link-hover text-muted">Instagram</a></li>
              <li><a href="#" class="footer-link-hover text-muted">Threads</a></li>
            </ul>
          </div>
        </div>
        <div class="mt-16 pt-8 border-t text-center text-sm text-muted sr" data-sr data-sr-delay="140" style="border-color:var(--border);">
          &copy; 2025 Arunika. All Rights Reserved.
        </div>
      </div>
    </footer>
  `;

  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    footerContainer.innerHTML = footerHTML;
  }
}