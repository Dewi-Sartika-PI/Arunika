// Pola ini akan mengecek apakah halaman sudah siap.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runQuizApp);
} else {
    runQuizApp();
}

function runQuizApp() {
  const quizForm = document.getElementById('quiz-form');
  const questionsContainer = document.getElementById('questions');
  const API_URL = 'https://68c5526da712aaca2b6872b6.mockapi.io/api/v1/quiz-results';

  const quizQuestions = [
      { text: "Saya suka memecahkan masalah kompleks dan mencari solusi inovatif." },
      { text: "Saya menikmati bekerja dalam tim dan berkolaborasi dengan orang lain." },
      { text: "Saya tertarik pada data dan analisis untuk membuat keputusan." },
      { text: "Mengekspresikan ide secara visual atau kreatif membuat saya bersemangat." },
      { text: "Saya lebih suka memiliki jadwal yang terstruktur dan dapat diprediksi." },
      { text: "Saya senang memimpin dan mengarahkan orang lain menuju tujuan bersama." },
      { text: "Detail kecil sangat penting bagi saya dalam menyelesaikan pekerjaan." },
      { text: "Saya mudah beradaptasi dengan perubahan dan lingkungan baru." },
      { text: "Membantu atau mengajar orang lain memberikan saya kepuasan." },
      { text: "Saya lebih suka bekerja secara mandiri daripada dalam kelompok besar." },
      { text: "Saya selalu mencari cara untuk membuat proses menjadi lebih efisien." },
      { text: "Saya berani mengambil risiko untuk mendapatkan hasil yang lebih baik." }
  ];

  function renderQuestions() {
    if (!questionsContainer) return;
    questionsContainer.innerHTML = quizQuestions.map((q, index) => `
        <div class="question-block card-surface rounded-xl shadow-lg p-6 sr">
            <p class="font-semibold mb-4 text-lg">${index + 1}. ${q.text}</p>
            <div class="flex justify-between items-center space-x-2">
                <span class="text-sm text-muted hidden sm:inline">Tidak Setuju</span>
                <div class="flex items-center gap-2 sm:gap-3 flex-grow justify-around" role="radiogroup">
                    ${[1, 2, 3, 4, 5].map(val => `
                        <label class="cursor-pointer">
                            <input type="radio" name="q${index + 1}" value="${val}" class="sr-only peer" required>
                            <span class="quiz-option">${val}</span>
                        </label>
                    `).join('')}
                </div>
                <span class="text-sm text-muted hidden sm:inline">Sangat Setuju</span>
            </div>
        </div>`).join('');
  }

  async function fetchAndProcessResults() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const allResults = await response.json();
      const bestMatch = allResults.sort((a, b) => b.fitScore - a.fitScore)[0];
      return bestMatch;
    } catch (error) {
      console.error("Error saat fetch:", error);
      return null;
    }
  }

  // =================================================================
  // !!! FUNGSI renderResults() YANG DIPERBARUI DENGAN TOMBOL !!!
  // =================================================================
  function renderResults(result) {
    if (!result || !result.strengths || !result.actions) {
      console.error("Data hasil tidak valid:", result);
      alert("Gagal memuat hasil. Data yang diterima tidak lengkap.");
      return;
    }

    const resultBody = document.getElementById('result-body');
    if (!resultBody) return;

    // Membuat HTML untuk seluruh isi modal, termasuk tombol baru
    resultBody.innerHTML = `
      <div class="text-center">
        <span id="result-badge" class="py-1.5 px-4 rounded-full text-base font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">${result.recommendedRole}</span>
        <div id="result-score" class="text-7xl font-extrabold my-2">${result.fitScore}%</div>
        <p class="text-muted">Fit Score</p>
      </div>

      <div class="mt-8">
        <h3 class="font-semibold text-lg">Kekuatan Utamamu:</h3>
        <div id="result-strengths" class="flex flex-wrap gap-3 mt-3">
          ${result.strengths.map(s => `<span class="py-1.5 px-3 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">${s}</span>`).join('')}
        </div>
      </div>

      <div class="mt-6">
        <h3 class="font-semibold text-lg">Saran Aksi:</h3>
        <ul id="result-actions" class="mt-2 space-y-2 text-muted">
          ${result.actions.map(a => `<li class="flex items-start gap-3"><svg class="w-5 h-5 mt-1 text-[var(--purple)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>${a}</span></li>`).join('')}
        </ul>
      </div>

      <div class="mt-8 border-t border-soft pt-6 text-center">
        <a href="lab-career.html" class="inline-block rounded-lg px-6 py-3 font-semibold text-white bg-gradient-to-r from-[var(--blue)] to-[var(--purple)] shadow-md hover:shadow-lg transition active:scale-[0.98]">
          Jelajahi Lab Career →
        </a>
      </div>
    `;
  }

  function updateProgress() {
    if (!quizForm) return;
    const progressBar = document.getElementById('progress-bar'), progLabel = document.getElementById('ui-progress-label'), pointsEl = document.getElementById('ui-points'), badgeEl = document.getElementById('ui-badge');
    const total = quizQuestions.length;
    const answered = quizForm.querySelectorAll('input[type="radio"]:checked').length;
    const pct = total > 0 ? (answered / total) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
    if (progLabel) progLabel.textContent = `${answered}/${total}`;
    if (pointsEl) pointsEl.textContent = answered * 10;
    if (badgeEl) badgeEl.textContent = answered >= total ? 'Finisher' : answered >= Math.ceil(total * 0.66) ? 'On Fire' : answered >= Math.ceil(total * 0.33) ? 'Warming Up' : 'Starter';
  }

  function initTheme() {
    const btn = document.getElementById('theme-toggle'); 
    if (!btn) return;
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');

    function setTheme(mode) {
      const isDark = (mode === 'dark');
      document.documentElement.classList.toggle('dark', isDark);
      if (lightIcon) lightIcon.classList.toggle('hidden', isDark);
      if (darkIcon) darkIcon.classList.toggle('hidden', !isDark);
      localStorage.setItem('color-theme', mode);
      btn.setAttribute('aria-pressed', String(isDark));
    }

    const savedTheme = localStorage.getItem('color-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(prefersDark ? 'dark' : 'light');
    }

    btn.addEventListener('click', () => {
      const isCurrentlyDark = document.documentElement.classList.contains('dark');
      setTheme(isCurrentlyDark ? 'light' : 'dark');
    });
  }

  function initAnimations() {
    const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('sr-in'); } }); }, { threshold: 0.1 });
    document.querySelectorAll('.sr').forEach(el => observer.observe(el));
    if (questionsContainer) {
        const questionBlocks = questionsContainer.querySelectorAll('.question-block');
        questionBlocks.forEach(el => observer.observe(el));
    }
  }

  function initModal() {
    const modal = document.getElementById('result-modal'); if (!modal) return;
    const overlay = document.getElementById('result-overlay'), closeBtn = document.getElementById('result-close'), card = modal.querySelector('.relative.w-full');
    function open() { modal.classList.remove('pointer-events-none'); modal.style.opacity = '1'; card.style.transform = 'scale(1)'; }
    function close() { card.style.transform = 'scale(0.95)'; modal.style.opacity = '0'; setTimeout(() => modal.classList.add('pointer-events-none'), 300); }
    window.SkillMatchUI = { openResultModal: open, closeResultModal: close };
    overlay.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
  }

  // --- EKSEKUSI ---
  renderQuestions();
  updateProgress();
  initTheme();
  initAnimations();
  initModal();

  if (quizForm) {
    quizForm.addEventListener('change', updateProgress);
    quizForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const validationMessage = document.getElementById('validation-message');
      if (quizForm.querySelectorAll('input[type="radio"]:checked').length < quizQuestions.length) {
        validationMessage.classList.remove('hidden');
      } else {
        validationMessage.classList.add('hidden');
        const finalResult = await fetchAndProcessResults();
        renderResults(finalResult);
        if (window.SkillMatchUI) window.SkillMatchUI.openResultModal();
      }
    });
  }
}