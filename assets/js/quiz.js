        // // --- Theme Toggle Logic ---
        // const themeToggleBtn = document.getElementById('theme-toggle');
        // const lightIcon = document.getElementById('theme-toggle-light-icon');
        // const darkIcon = document.getElementById('theme-toggle-dark-icon');

        // function setTheme(theme) {
        //     if (theme === 'dark') {
        //         document.documentElement.classList.add('dark'); document.body.classList.add('dark');
        //         darkIcon.classList.remove('hidden'); lightIcon.classList.add('hidden');
        //         localStorage.setItem('color-theme', 'dark');
        //     } else {
        //         document.documentElement.classList.remove('dark'); document.body.classList.remove('dark');
        //         lightIcon.classList.remove('hidden'); darkIcon.classList.add('hidden');
        //         localStorage.setItem('color-theme', 'light');
        //     }
        // }

        // const savedTheme = localStorage.getItem('color-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        // setTheme(savedTheme);
        // themeToggleBtn.addEventListener('click', () => setTheme(localStorage.getItem('color-theme') === 'dark' ? 'light' : 'dark'));

        // --- Quiz Logic ---
        document.addEventListener('DOMContentLoaded', () => {
            const quizForm = document.getElementById('quiz-form');
            const questionsContainer = document.getElementById('questions');
            const progressBar = document.getElementById('progress-bar');
            const validationMessage = document.getElementById('validation-message');
            const modal = document.getElementById('result-modal');
            let triggerElement; 

            const quizData = {
                questions: [
                    { text: "Saya suka memecahkan masalah kompleks dan mencari solusi inovatif.", domain: "problemSolving", tooltip: "Mengukur kemampuan analisis dan penyelesaian masalah secara kreatif." },
                    { text: "Saya menikmati bekerja dalam tim dan berkolaborasi dengan orang lain.", domain: "collaboration", tooltip: "Menilai keterampilan kerja sama dan komunikasi dalam tim." },
                    { text: "Saya tertarik pada data dan analisis untuk membuat keputusan.", domain: "analytical", tooltip: "Melihat kecenderungan pada pemikiran berbasis data dan logika." },
                    { text: "Mengekspresikan ide secara visual atau kreatif membuat saya bersemangat.", domain: "creative", tooltip: "Mengidentifikasi kekuatan dalam inovasi visual dan konseptual." },
                    { text: "Saya lebih suka memiliki jadwal yang terstruktur dan dapat diprediksi.", domain: "structured", tooltip: "Mengukur kenyamanan dalam lingkungan kerja yang terorganisir." },
                    { text: "Saya senang memimpin dan mengarahkan orang lain menuju tujuan bersama.", domain: "leadership", tooltip: "Menilai potensi dalam memotivasi dan mengelola tim." },
                    { text: "Detail kecil sangat penting bagi saya dalam menyelesaikan pekerjaan.", domain: "detailOriented", tooltip: "Mengidentifikasi ketelitian dan fokus pada kualitas." },
                    { text: "Saya mudah beradaptasi dengan perubahan dan lingkungan baru.", domain: "adaptability", tooltip: "Menilai fleksibilitas dalam menghadapi situasi yang dinamis." },
                    { text: "Membantu atau mengajar orang lain memberikan saya kepuasan.", domain: "empathy", tooltip: "Mengukur kecenderungan untuk memahami dan membantu orang lain." },
                    { text: "Saya lebih suka bekerja secara mandiri daripada dalam kelompok besar.", domain: "autonomy", tooltip: "Melihat preferensi untuk bekerja secara independen." },
                    { text: "Saya selalu mencari cara untuk membuat proses menjadi lebih efisien.", domain: "efficiency", tooltip: "Mengidentifikasi pola pikir yang berfokus pada optimisasi." },
                    { text: "Saya berani mengambil risiko untuk mendapatkan hasil yang lebih baik.", domain: "riskTaking", tooltip: "Menilai keberanian dalam mengambil keputusan yang menantang." }
                ],
                domains: {
                    problemSolving: "Pemecahan Masalah", collaboration: "Kolaborasi Tim", analytical: "Analitis",
                    creative: "Kreativitas", structured: "Terstruktur", leadership: "Kepemimpinan",
                    detailOriented: "Orientasi Detail", adaptability: "Adaptabilitas", empathy: "Empati",
                    autonomy: "Kemandirian", efficiency: "Efisiensi", riskTaking: "Pengambilan Risiko"
                },
                roles: [
                    { 
                        name: "UI/UX Designer", 
                        weights: { creative: 3, empathy: 3, detailOriented: 2, collaboration: 2, problemSolving: 1 },
                        actions: ["Bangun portofolio desain di platform seperti Behance atau Dribbble.", "Pelajari prinsip dasar desain dan software seperti Figma."]
                    },
                    { 
                        name: "Frontend Developer", 
                        weights: { detailOriented: 3, problemSolving: 3, creative: 2, collaboration: 2, efficiency: 1 },
                        actions: ["Mulai belajar HTML, CSS, dan JavaScript dasar.", "Buat proyek kecil seperti halaman portofolio interaktif."]
                    },
                    { 
                        name: "Backend Developer", 
                        weights: { problemSolving: 3, analytical: 3, structured: 2, autonomy: 2, efficiency: 1 },
                        actions: ["Pilih satu bahasa backend (misalnya, JavaScript/Node.js atau Python) untuk dipelajari.", "Pelajari konsep dasar database dan cara membuat API sederhana."]
                    }
                ]
            };
            
            function renderQuestions() {
                questionsContainer.innerHTML = quizData.questions.map((q, index) => `
                    <div class="question-block pt-6 border-t border-gray-200 dark:border-gray-700" title="${q.tooltip}">
                        <p class="text-lg font-semibold mb-4 text-brand-d-brown dark:text-brand-cream">${index + 1}. ${q.text}</p>
                        <div class="flex justify-between items-center space-x-2">
                            <span class="text-sm text-brand-d-brown/60 dark:text-brand-cream/60 hidden sm:inline">Tidak Setuju</span>
                            <div class="flex items-center gap-1 sm:gap-2 flex-grow justify-around" role="radiogroup" aria-labelledby="q-label-${index+1}">
                                ${[1,2,3,4,5].map(val => `
                                    <label class="cursor-pointer">
                                        <input type="radio" name="q${index+1}" value="${val}" class="hidden peer" required>
                                        <span class="w-8 h-8 sm:w-10 sm:h-10 grid place-content-center rounded-full border-2 border-gray-300 dark:border-gray-600 peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-purple-400 dark:peer-focus:ring-fuchsia-400 peer-checked:bg-purple-500 dark:peer-checked:bg-fuchsia-500 peer-checked:text-white peer-checked:border-purple-500 dark:peer-checked:border-fuchsia-500 peer-checked:font-bold peer-checked:shadow-lg transition-all duration-200">${val}</span>
                                    </label>
                                `).join('')}
                            </div>
                            <span class="text-sm text-brand-d-brown/60 dark:text-brand-cream/60 hidden sm:inline">Sangat Setuju</span>
                        </div>
                    </div>
                `).join('');
                questionsContainer.firstElementChild.classList.remove('pt-6', 'border-t', 'border-gray-200', 'dark:border-gray-700');
            }

            function updateProgress() {
                const answeredQuestions = quizForm.querySelectorAll('input[type="radio"]:checked').length;
                progressBar.style.width = `${(answeredQuestions / quizData.questions.length) * 100}%`;
            }

            function calculateAndSaveResults() {
                const formData = new FormData(quizForm);
                const scores = {};
                Object.keys(quizData.domains).forEach(domain => scores[domain] = 0);
                quizData.questions.forEach((q, index) => {
                    scores[q.domain] += parseInt(formData.get(`q${index+1}`) || 0);
                });

                const roleScores = quizData.roles.map(role => {
                    let score = 0; let totalWeight = 0;
                    for (const domain in role.weights) {
                        const weight = role.weights[domain];
                        score += (scores[domain] || 0) * weight;
                        totalWeight += 5 * weight;
                    }
                    return { ...role, fitScore: Math.round((score / totalWeight) * 100) };
                });

                const bestMatch = roleScores.reduce((a, b) => a.fitScore > b.fitScore ? a : b);
                const topStrengths = Object.entries(scores).sort(([,a],[,b]) => b - a).slice(0, 3).map(([domain]) => quizData.domains[domain]);
                const finalResult = {
                    recommendedRole: bestMatch.name, fitScore: bestMatch.fitScore,
                    strengths: topStrengths, actions: bestMatch.actions, timestamp: new Date().toISOString()
                };
                localStorage.setItem('arunika_quiz', JSON.stringify(finalResult));
                return finalResult;
            }

            function renderResults(result) {
                document.getElementById('result-badge').textContent = result.recommendedRole;
                document.getElementById('result-score').textContent = `${result.fitScore}%`;
                document.getElementById('result-strengths').innerHTML = result.strengths.map(s => `<span class="py-1.5 px-3 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">${s}</span>`).join('');
                document.getElementById('result-actions').innerHTML = result.actions.map(a => `<li class="flex items-start gap-3"><svg class="w-5 h-5 mt-1 text-purple-500 dark:text-fuchsia-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>${a}</span></li>`).join('');
            }
            
            let focusableElements, firstElement, lastElement;
            window.openModal = function() {
                triggerElement = document.activeElement;
                modal.classList.remove('opacity-0', 'pointer-events-none');
                modal.querySelector('.relative').classList.remove('scale-95');
                focusableElements = Array.from(modal.querySelectorAll('button, a[href]'));
                firstElement = focusableElements[0];
                lastElement = focusableElements[focusableElements.length - 1];
                firstElement.focus();
                modal.addEventListener('keydown', trapFocus);
            }
            
            function trapFocus(e) {
                if (e.key !== 'Tab') return;
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus(); e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus(); e.preventDefault();
                    }
                }
            }

            window.closeModal = function() {
                modal.querySelector('.relative').classList.add('scale-95');
                modal.classList.add('opacity-0');
                setTimeout(() => modal.classList.add('pointer-events-none'), 300);
                modal.removeEventListener('keydown', trapFocus);
                if (triggerElement) triggerElement.focus();
            }

            quizForm.addEventListener('submit', (e) => {
                e.preventDefault();
                document.querySelectorAll('.question-block.invalid').forEach(el => el.classList.remove('invalid'));
                if (quizForm.querySelectorAll('input[type="radio"]:checked').length < quizData.questions.length) {
                    validationMessage.textContent = 'Ayo jawab semua pertanyaan dulu untuk melihat hasilnya.';
                    validationMessage.classList.remove('hidden');
                    quizData.questions.forEach((q, i) => {
                        if (!quizForm.querySelector(`input[name="q${i+1}"]:checked`)) {
                           questionsContainer.children[i].classList.add('invalid');
                        }
                    });
                    const firstInvalid = document.querySelector('.question-block.invalid');
                    if(firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    validationMessage.classList.add('hidden');
                    renderResults(calculateAndSaveResults());
                    openModal();
                }
            });

            quizForm.addEventListener('change', updateProgress);

            document.addEventListener('keydown', e => {
                if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
                const focused = document.activeElement;
                if (focused?.type === 'radio') {
                    e.preventDefault();
                    const parent = focused.closest('[role="radiogroup"]');
                    const radios = Array.from(parent.querySelectorAll('input[type="radio"]'));
                    const currentIndex = radios.indexOf(focused);
                    const nextIndex = (e.key === 'ArrowRight') ? (currentIndex + 1) % radios.length : (currentIndex - 1 + radios.length) % radios.length;
                    radios[nextIndex].focus();
                    radios[nextIndex].checked = true;
                    radios[nextIndex].dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
            renderQuestions();
        });
    