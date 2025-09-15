// Pola ini akan mengecek apakah halaman sudah siap.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runQuizApp);
} else {
    runQuizApp();
}

function runQuizApp() {
  const quizForm = document.getElementById('quiz-form');
  const questionsContainer = document.getElementById('questions');
  const API_URL = 'https://68c5526da712aaca2b6872b6.mockapi.io/quiz-results';
  
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

  // async function fetchAndProcessResults() {
  //   try {
  //     const response = await fetch(API_URL);
  //     if (!response.ok) throw new Error(`API error: ${response.status}`);
  //     const allResults = await response.json();
  //     const bestMatch = allResults.sort((a, b) => b.fitScore - a.fitScore)[0];
  //     return bestMatch;
  //   } catch (error) {
  //     console.error("Error saat fetch:", error);
  //     return null;
  //   }
  // }

  // 1) mapping Q -> trait (sederhana, bisa kamu ubah sesuka hati)
const TRAITS = ["analytical","creative","leadership","people","structure","adaptability"];
const ROLE_DEF = {
  "Product Manager":     { analytical: 0.3, leadership: 0.25, people: 0.2, adaptability: 0.15, structure: 0.1 },
  "UI/UX Researcher":    { analytical: 0.25, people: 0.25, creative: 0.25, adaptability: 0.15, structure: 0.1 },
  "Frontend Developer":  { analytical: 0.3, structure: 0.25, creative: 0.2, adaptability: 0.15, people: 0.1 },
  "The Innovator":       { creative: 0.35, analytical: 0.2, adaptability: 0.2, leadership: 0.15, people: 0.1 }
};

// Setiap pertanyaan “dominan” ke trait tertentu
const Q_TRAIT = [
  "creative",        // 1
  "people",          // 2
  "analytical",      // 3
  "creative",        // 4
  "structure",       // 5
  "leadership",      // 6
  "structure",       // 7
  "adaptability",    // 8
  "people",          // 9
  "analytical",      // 10 -> misal prefer independen = analytical
  "analytical",      // 11
  "leadership"       // 12 (risk taking -> leadership/innovation)
];

// 2) ambil jawaban form → skor trait 0..1
function getTraitScores() {
  const answers = [];
  for (let i = 0; i < Q_TRAIT.length; i++) {
    const v = Number((document.querySelector(`input[name="q${i+1}"]:checked`)||{}).value || 0);
    answers.push(v); // 1..5
  }
  const sums = Object.fromEntries(TRAITS.map(t => [t, 0]));
  answers.forEach((v, idx) => {
    const t = Q_TRAIT[idx];
    if (t) sums[t] += v; // akumulasi
  });
  // normalisasi ke 0..1 (max tiap trait = 5 * jumlah pertanyaan trait tsb)
  const counts = Object.fromEntries(TRAITS.map(t => [t, 0]));
  Q_TRAIT.forEach(t => { counts[t] = (counts[t]||0) + 1; });
  const scores = {};
  TRAITS.forEach(t => {
    const max = (counts[t] || 1) * 5;
    scores[t] = max ? (sums[t] / max) : 0;
  });
  return scores; // {analytical:0.xx,...}
}

// 3) hitung kecocokan ke masing² role → pilih terbaik
function calculateResultFromAnswers() {
  const traits = getTraitScores();

  let best = null;
  Object.entries(ROLE_DEF).forEach(([role, weights]) => {
    // cosine-like: sum(trait_score * weight)
    let s = 0;
    Object.entries(weights).forEach(([t, w]) => {
      s += (traits[t] || 0) * w;
    });
    const fitScore = Math.round(s * 100);
    if (!best || fitScore > best.fitScore) {
      best = { recommendedRole: role, fitScore };
    }
  });

  // strengths sederhana: top 3 trait user
  const strengths = Object.entries(traits)
    .sort((a,b)=>b[1]-a[1]).slice(0,3)
    .map(([t]) => ({
      analytical: "Berpikir Analitis",
      creative: "Pemecahan Masalah Kreatif",
      leadership: "Kepemimpinan",
      people: "Kolaborasi",
      structure: "Ketelitian & Struktur",
      adaptability: "Adaptif pada Perubahan",
    }[t]));

  // saran aksi default per role
  const ACTIONS = {
    "Product Manager": [
      "Latih stakeholder mapping pada proyek nyata.",
      "Rutin review metrik produk dan tulis insight mingguan.",
      "Pimpin sprint planning kecil 2–3 orang."
    ],
    "UI/UX Researcher": [
      "Jadwalkan 5 user interview untuk satu use case.",
      "Buat research plan + analisis temuan di Notion/FigJam.",
      "Latihan usability testing dengan skenario sederhana."
    ],
    "Frontend Developer": [
      "Bangun komponen UI reusable dengan React + Tailwind.",
      "Benchmark performa (LCP/CLS) dan optimasi sederhana.",
      "Tulis unit test untuk satu fitur UI."
    ],
    "The Innovator": [
      "Ambil kursus singkat Design Thinking.",
      "Ikut webinar teknologi yang kamu minati.",
      "Bikin side-project eksperimental 2 minggu."
    ]
  };

  return {
    recommendedRole: best.recommendedRole,
    fitScore: Math.max(40, Math.min(98, best.fitScore)), // jaga rentang enak dilihat
    strengths,
    actions: ACTIONS[best.recommendedRole] || ACTIONS["The Innovator"]
  };
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
        const finalResult = calculateResultFromAnswers();   // ← hasil berdasar jawaban
renderResults(finalResult);

// SIMPAN ke localStorage (supaya Lab Career baca)
if (finalResult && window.UserData?.saveSkillMatchResult) {
  window.UserData.saveSkillMatchResult({
    fit: Number(finalResult.fitScore || 0),
    role: String(finalResult.recommendedRole || ''),
    strengths: finalResult.strengths || [],
    actions: finalResult.actions || [],
  });
}
if (window.SkillMatchUI) window.SkillMatchUI.openResultModal();

      }

    });
  }
}