// Pola ini akan mengecek apakah halaman sudah siap.
// Jika sudah, jalankan kodenya. Jika belum, tunggu event-nya.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runQuizApp);
} else {
    runQuizApp();
}

// Kita bungkus semua kode kita dalam satu fungsi utama
function runQuizApp() {
  
  // ============================================================
  // BAGIAN 1: SETUP UTAMA & DATA
  // ============================================================
  const quizForm = document.getElementById('quiz-form');
  const questionsContainer = document.getElementById('questions');
  const quizData = {
    questions: [{ text: "Saya suka memecahkan masalah kompleks dan mencari solusi inovatif.", domain: "problemSolving" }, { text: "Saya menikmati bekerja dalam tim dan berkolaborasi dengan orang lain.", domain: "collaboration" }, { text: "Saya tertarik pada data dan analisis untuk membuat keputusan.", domain: "analytical" }, { text: "Mengekspresikan ide secara visual atau kreatif membuat saya bersemangat.", domain: "creative" }, { text: "Saya lebih suka memiliki jadwal yang terstruktur dan dapat diprediksi.", domain: "structured" }, { text: "Saya senang memimpin dan mengarahkan orang lain menuju tujuan bersama.", domain: "leadership" }, { text: "Detail kecil sangat penting bagi saya dalam menyelesaikan pekerjaan.", domain: "detailOriented" }, { text: "Saya mudah beradaptasi dengan perubahan dan lingkungan baru.", domain: "adaptability" }, { text: "Membantu atau mengajar orang lain memberikan saya kepuasan.", domain: "empathy" }, { text: "Saya lebih suka bekerja secara mandiri daripada dalam kelompok besar.", domain: "autonomy" }, { text: "Saya selalu mencari cara untuk membuat proses menjadi lebih efisien.", domain: "efficiency" }, { text: "Saya berani mengambil risiko untuk mendapatkan hasil yang lebih baik.", domain: "riskTaking" }],
    domains: { problemSolving: "Pemecahan Masalah", collaboration: "Kolaborasi Tim", analytical: "Analitis", creative: "Kreativitas", structured: "Terstruktur", leadership: "Kepemimpinan", detailOriented: "Orientasi Detail", adaptability: "Adaptabilitas", empathy: "Empati", autonomy: "Kemandirian", efficiency: "Efisiensi", riskTaking: "Pengambilan Risiko" },
    roles: [{ name: "UI/UX Designer", weights: { creative: 3, empathy: 3, detailOriented: 2, collaboration: 2, problemSolving: 1 }, actions: ["Bangun portofolio desain di platform seperti Behance atau Dribbble.", "Pelajari prinsip dasar desain dan software seperti Figma."] }, { name: "Frontend Developer", weights: { detailOriented: 3, problemSolving: 3, creative: 2, collaboration: 2, efficiency: 1 }, actions: ["Mulai belajar HTML, CSS, dan JavaScript dasar.", "Buat proyek kecil seperti halaman portofolio interaktif."] }, { name: "Backend Developer", weights: { problemSolving: 3, analytical: 3, structured: 2, autonomy: 2, efficiency: 1 }, actions: ["Pilih satu bahasa backend (misalnya, JavaScript/Node.js atau Python) untuk dipelajari.", "Pelajari konsep dasar database dan cara membuat API sederhana."] }]
  };

  // ============================================================
  // BAGIAN 2: FUNGSI-FUNGSI UTAMA
  // ============================================================

  function renderQuestions() {
    if (!questionsContainer) return;
    questionsContainer.innerHTML = quizData.questions.map((q, index) => `
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

  function updateProgress() {
    if (!quizForm) return;
    const progressBar = document.getElementById('progress-bar'), progLabel = document.getElementById('ui-progress-label'), pointsEl = document.getElementById('ui-points'), badgeEl = document.getElementById('ui-badge');
    const total = quizData.questions.length;
    const answered = quizForm.querySelectorAll('input[type="radio"]:checked').length;
    const pct = total > 0 ? (answered / total) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
    if (progLabel) progLabel.textContent = `${answered}/${total}`;
    if (pointsEl) pointsEl.textContent = answered * 10;
    if (badgeEl) badgeEl.textContent = answered >= total ? 'Finisher' : answered >= Math.ceil(total * 0.66) ? 'On Fire' : answered >= Math.ceil(total * 0.33) ? 'Warming Up' : 'Starter';
  }

  function calculateAndSaveResults() {
    const formData = new FormData(quizForm);
    const scores = {};
    Object.keys(quizData.domains).forEach(domain => scores[domain] = 0);
    quizData.questions.forEach((q, index) => { scores[q.domain] += parseInt(formData.get(`q${index + 1}`) || 0); });
    const roleScores = quizData.roles.map(role => {
      let score = 0, totalWeight = 0;
      for (const domain in role.weights) { score += (scores[domain] || 0) * role.weights[domain]; totalWeight += 5 * role.weights[domain]; }
      return { ...role, fitScore: Math.round((score / totalWeight) * 100) };
    });
    const bestMatch = roleScores.sort((a, b) => b.fitScore - a.fitScore)[0];
    const topStrengths = Object.entries(scores).sort(([, a], [, b]) => b - a).slice(0, 3).map(([domain]) => quizData.domains[domain]);
    return { recommendedRole: bestMatch.name, fitScore: bestMatch.fitScore, strengths: topStrengths, actions: bestMatch.actions };
  }

  function renderResults(result) {
    document.getElementById('result-badge').textContent = result.recommendedRole;
    document.getElementById('result-score').textContent = `${result.fitScore}%`;
    document.getElementById('result-strengths').innerHTML = result.strengths.map(s => `<span class="py-1.5 px-3 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">${s}</span>`).join('');
    document.getElementById('result-actions').innerHTML = result.actions.map(a => `<li class="flex items-start gap-3"><svg class="w-5 h-5 mt-1 text-[var(--purple)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>${a}</span></li>`).join('');
  }

  function initTheme() {
    const btn = document.getElementById('theme-toggle'); if (!btn) return;
    const sun = document.getElementById('sun'), moon = document.getElementById('moon');
    function setTheme(mode) {
      const root = document.documentElement;
      if (mode === 'dark') { root.classList.add('dark'); if (moon) moon.classList.add('hidden'); if (sun) sun.classList.remove('hidden'); localStorage.setItem('color-theme', 'dark'); }
      else { root.classList.remove('dark'); if (sun) sun.classList.add('hidden'); if (moon) moon.classList.remove('hidden'); localStorage.setItem('color-theme', 'light'); }
    }
    const saved = localStorage.getItem('color-theme'), prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved) { setTheme(saved); } else if (prefersDark) { setTheme('dark'); } else { setTheme('light'); }
    btn.addEventListener('click', () => setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark'));
  }

  function initAnimations() {
    const onScroll = () => document.body.classList.toggle('scrolled', (window.scrollY || document.documentElement.scrollTop) > 4);
    onScroll(); addEventListener('scroll', onScroll, { passive: true });
    const footerLogo = document.getElementById('footer-logo');
    if (footerLogo) {
      const wrap = footerLogo.parentElement, MAX_TILT = 8;
      wrap.addEventListener('mousemove', e => {
        const r = footerLogo.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        footerLogo.style.transform = `rotateX(${-(y - 0.5) * MAX_TILT * 2}deg) rotateY(${(x - 0.5) * MAX_TILT * 2}deg)`;
      });
      wrap.addEventListener('mouseleave', () => footerLogo.style.transform = 'rotateX(0) rotateY(0)');
    }
    const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('sr-in'); } }); }, { threshold: 0.1 });
    document.querySelectorAll('.sr').forEach(el => observer.observe(el));
    
    // Memberi tahu observer untuk mengawasi pertanyaan yang baru dibuat
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

  // ============================================================
  // BAGIAN 3: EKSEKUSI & EVENT LISTENERS
  // ============================================================
  
  initTheme();
  renderQuestions(); // Render pertanyaan dulu
  initAnimations(); // Baru jalankan animasi (termasuk untuk pertanyaan yang baru dirender)
  initModal();
  updateProgress();

  if (quizForm) {
    quizForm.addEventListener('change', updateProgress);
    quizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const validationMessage = document.getElementById('validation-message');
      if (quizForm.querySelectorAll('input[type="radio"]:checked').length < quizData.questions.length) {
        if (validationMessage) { validationMessage.textContent = 'Ayo jawab semua pertanyaan dulu untuk melihat hasilnya.'; validationMessage.classList.remove('hidden'); }
        const firstInvalid = document.querySelector('.question-block:not(:has(input:checked))');
        if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        if (validationMessage) validationMessage.classList.add('hidden');
        const finalResult = calculateAndSaveResults();
        renderResults(finalResult);
        if (window.SkillMatchUI) window.SkillMatchUI.openResultModal();
      }
    });
  }
}