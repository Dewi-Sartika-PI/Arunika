/* ========= GUARDS (wajib login) ========= */
try {
  // pastikan guards.js sudah ter-load sebelum file ini
  Guard?.requireLoginOrRedirect("./login.html");
} catch (e) {
  console.warn("guards.js belum tersedia atau Guard undefined.", e);
}

/* ========= THEME (sinkron dengan navbar) ========= */
(function () {
  const btn = document.getElementById("theme-toggle");
  const light = document.getElementById("theme-toggle-light-icon");
  const dark = document.getElementById("theme-toggle-dark-icon");

  function setTheme(mode) {
    const isDark = mode === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    document.body.classList.toggle("dark", isDark);
    document.body.classList.toggle("light", !isDark);
    dark?.classList.toggle("hidden", !isDark);
    light?.classList.toggle("hidden", isDark);
    localStorage.setItem("color-theme", isDark ? "dark" : "light");
    btn?.setAttribute("aria-pressed", String(isDark));
  }

  const saved = localStorage.getItem("color-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(saved ? saved : prefersDark ? "dark" : "light");

  btn?.addEventListener("click", () =>
    setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark")
  );
})();

/* ========= Navbar Component Mount =========
   Asumsi: navbar.js otomatis render ke #navbar-root,
   atau expose Navbar.mount(selector, { active: 'Lab Career' })
*/
(function () {
  if (window.Navbar?.mount) {
    Navbar.mount("#navbar-root", { active: "Lab Career" });
  }
})();

/* ========= top glass show on scroll ========= */
(function () {
  const onScroll = () =>
    document.body.classList.toggle(
      "scrolled",
      (window.scrollY || document.documentElement.scrollTop) > 4
    );
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

/* ========= Scroll Reveal (supports dynamic content) ========= */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let io = null;
  function ensureIO() {
    if (io) return io;
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.target.classList.toggle("in", e.isIntersecting));
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );
    return io;
  }
  function scan() {
    const items = [...document.querySelectorAll(".reveal,[data-sr]")];
    items.forEach((el) => {
      if (el.hasAttribute("data-sr")) el.classList.add("reveal", "reveal-up");
      if (!reduce) ensureIO().observe(el);
      else el.classList.add("in");
    });
  }
  window.RevealRefresh = scan;
  scan();
})();

/* ========= Parallax (gentle) ========= */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = () => window.matchMedia("(max-width: 767px)").matches;
  const els = [...document.querySelectorAll("[data-parallax]")];
  if (!els.length) return;
  let ticking = false, lastY = 0, enabled = !(reduce || mobile());
  function apply(y) {
    els.forEach((el) => {
      const f = parseFloat(el.getAttribute("data-parallax") || "0.1");
      const ty = Math.round(y * f);
      el.style.transform = `translate3d(0, ${ty}px, 0)`;
    });
  }
  function onScroll() {
    if (!enabled) return;
    lastY = window.scrollY || document.documentElement.scrollTop;
    if (!ticking) {
      requestAnimationFrame(() => { apply(lastY); ticking = false; });
      ticking = true;
    }
  }
  function update() {
    enabled = !(reduce || mobile());
    if (!enabled) els.forEach((el) => (el.style.transform = ""));
    else onScroll();
  }
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update, { passive: true });
})();

/* ========= Cyber cover height to Ringkasan Diri ========= */
(function () {
  const section = document.getElementById("ringkasan-diri");
  const update = () => {
    if (!section) return;
    const r = section.getBoundingClientRect();
    const top = window.scrollY + r.top;
    const bottom = top + r.height;
    document.documentElement.style.setProperty("--cover-h", bottom + "px");
  };
  window.addEventListener("DOMContentLoaded", update);
  window.addEventListener("resize", update, { passive: true });
  window.addEventListener("load", update);
})();

/* ========= LAB-CAREER DYNAMIC: Jobs + Ranking + Tracking ========= */
(function () {
  const JOBS_URL = "./assets/data/jobs.json";
  const jobGrid = document.getElementById("job-list");
  const btnApply = document.getElementById("apply-filters");
  const fRole = document.getElementById("f-role");
  const fLevel = document.getElementById("f-level");
  const fLoc = document.getElementById("f-loc");
  const fSalary = document.getElementById("f-salary");

  const FALLBACK_JOBS = [
    {
      id: "job_pm_01",
      title: "Product Manager",
      company: "Inovasi Digital",
      location: "Jakarta",
      level: "Mid",
      role_key: "product_manager",
      tags: ["leadership", "stakeholder", "roadmap"],
      verified: true,
      base_fit_score: 92,
      min_salary: 12000000,
      apply_url: "https://jobs.example.com/pm?id=01",
    },
    {
      id: "job_ux_01",
      title: "UI/UX Researcher",
      company: "Visuara",
      location: "Bandung",
      level: "Entry",
      role_key: "ux_researcher",
      tags: ["interview", "usability", "synthesis"],
      verified: true,
      base_fit_score: 85,
      min_salary: 9000000,
      apply_url: "https://jobs.example.com/ux?id=01",
    },
    {
      id: "job_fe_01",
      title: "Frontend Developer",
      company: "Tech Labs",
      location: "Surabaya",
      level: "Mid",
      role_key: "frontend_developer",
      tags: ["react", "ui patterns", "performance"],
      verified: true,
      base_fit_score: 81,
      min_salary: 11000000,
      apply_url: "https://jobs.example.com/fe?id=01",
    },
  ];

  function getQuizFit() {
    return {
      fit: Number(localStorage.getItem("arunika.fit") || 0),
      role: (localStorage.getItem("arunika.role") || "").toLowerCase(),
    };
  }

  function computeFinalScore(job, quiz) {
    const roleMatch = quiz.role && (job.role_key || "").toLowerCase().includes(quiz.role);
    const roleBonus = roleMatch ? quiz.fit : Math.max(quiz.fit - 10, 0);
    const score = 0.7 * (job.base_fit_score || 0) + 0.3 * roleBonus;
    return Math.round(Math.min(100, score));
  }

  function trackApply(job) {
    try {
      const url = new URL(job.apply_url);
      url.searchParams.set("utm_source", "arunika");
      url.searchParams.set("utm_campaign", "job_connector");
      window.open(url.toString(), "_blank", "noopener");
    } catch {
      if (job.apply_url) window.open(job.apply_url, "_blank", "noopener");
    }
    const key = "arunika.applyClicks";
    const map = JSON.parse(localStorage.getItem(key) || "{}");
    map[job.id] = (map[job.id] || 0) + 1;
    localStorage.setItem(key, JSON.stringify(map));
  }

  function cardHTML(job) {
    const chips = (job.tags || [])
      .slice(0, 3)
      .map((t) => `<span class="chip px-2.5 py-1 rounded-full">${t}</span>`)
      .join("");
    const score = job.final_score || 0;
    return `
      <article class="reveal reveal-scale rounded-2xl p-6 border shadow-md hover:shadow-xl transition surface-1" style="border-color:var(--border)">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="font-extrabold text-lg ink">${job.title}</h3>
            <p class="text-sm muted">${job.company} • ${job.location}${job.level ? " • " + job.level : ""}</p>
          </div>
          <button class="px-3 py-1.5 rounded-full text-white text-sm btn-primary apply-btn" data-id="${job.id}">Detail</button>
        </div>
        <div class="mt-4">
          <div class="flex items-center justify-between text-sm mb-2"><span class="font-semibold ink">Match</span><span class="ink">${score}%</span></div>
          <div class="h-2 w-full rounded-full match-track"><div class="h-2 rounded-full match-fill" style="width:${score}%"></div></div>
        </div>
        <div class="mt-4 flex flex-wrap gap-2 text-xs">${chips}</div>
      </article>`;
  }

  function renderEmpty() {
    jobGrid.innerHTML = `
      <div class="col-span-full text-center rounded-2xl p-10 border surface-1" style="border-color:#E5E7EB">
        <h3 class="text-xl font-bold ink">Tidak ada hasil 🚫</h3>
        <p class="mt-1 muted">Coba ubah filter atau reset ke default.</p>
        <button class="mt-4 rounded-full px-5 py-2.5 font-bold btn-primary" id="resetFilters">Reset Filter</button>
      </div>`;
    document.getElementById("resetFilters")?.addEventListener("click", () => {
      fRole.value = "";
      fLevel.value = "";
      fLoc.value = "ID";
      fSalary.value = "0";
      apply();
    });
  }

  let JOBS = [];
  function apply() {
    const quiz = getQuizFit();
    const roleVal = (fRole.value || "").toLowerCase();
    const levelVal = (fLevel.value || "").toLowerCase();
    const locVal = (fLoc.value || "").toLowerCase();
    const minSalary = Number(fSalary.value || 0);

    let list = JOBS.filter((j) => {
      const okRole =
        !roleVal ||
        j.title.toLowerCase().includes(roleVal) ||
        (j.role_key || "").toLowerCase().includes(roleVal);
      const okLevel = !levelVal || (j.level || "").toLowerCase().includes(levelVal);
      const okLoc = !locVal || locVal === "id" || (j.location || "").toLowerCase().includes(locVal);
      const okPay = !minSalary || (j.min_salary || 0) >= minSalary;
      return okRole && okLevel && okLoc && okPay;
    });

    list.forEach((j) => (j.final_score = computeFinalScore(j, quiz)));
    list.sort((a, b) => b.final_score - a.final_score);

    if (!list.length) {
      renderEmpty();
      window.RevealRefresh?.();
      return;
    }

    jobGrid.innerHTML = list.map(cardHTML).join("");
    jobGrid.querySelectorAll(".apply-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const job = list.find((j) => j.id === btn.dataset.id);
        if (!job || !job.apply_url) {
          alert("Link apply tidak tersedia.");
          return;
        }
        trackApply(job);
      });
    });
    window.RevealRefresh?.();
  }

  async function loadJobs() {
    try {
      const r = await fetch(JOBS_URL, { cache: "no-store" });
      if (!r.ok) throw new Error("HTTP " + r.status);
      const data = await r.json();
      JOBS = Array.isArray(data) && data.length ? data : FALLBACK_JOBS;
    } catch (e) {
      console.warn("Gagal memuat jobs.json, gunakan fallback.", e);
      JOBS = FALLBACK_JOBS;
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    await loadJobs();
    apply();
    btnApply?.addEventListener("click", apply);
  });
})();

/* ========= SALARY: isi dari salary.json (opsional, desain tetap) ========= */
(function () {
  const SAL_URL = "./assets/data/salary.json";
  const fmt = (n) => (n / 1_000_000).toFixed(0) + "jt";
  function setLine(el, obj) {
    if (!el || !obj) return;
    el.textContent = `P25 ${fmt(obj.p25)} • Median ${fmt(obj.median)} • P75 ${fmt(obj.p75)}`;
  }
  async function hydrate() {
    try {
      const r = await fetch(SAL_URL, { cache: "no-store" });
      if (!r.ok) return;
      const s = await r.json();
      setLine(document.getElementById("sal-pm-1"), s.product_manager?.Entry?.Indonesia);
      setLine(document.getElementById("sal-pm-2"), s.product_manager?.Mid?.Indonesia);
      setLine(document.getElementById("sal-pm-3"), s.product_manager?.Senior?.Indonesia);
      setLine(document.getElementById("sal-ux-1"), s.ux_researcher?.Entry?.Indonesia);
      setLine(document.getElementById("sal-ux-2"), s.ux_researcher?.Mid?.Indonesia);
      setLine(document.getElementById("sal-ux-3"), s.ux_researcher?.Senior?.Indonesia);
      setLine(document.getElementById("sal-fe-1"), s.frontend_developer?.Entry?.Indonesia);
      setLine(document.getElementById("sal-fe-2"), s.frontend_developer?.Mid?.Indonesia);
      setLine(document.getElementById("sal-fe-3"), s.frontend_developer?.Senior?.Indonesia);
    } catch (e) {
      /* keep default text */
    }
  }
  document.addEventListener("DOMContentLoaded", hydrate);
})();
