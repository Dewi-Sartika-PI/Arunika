        // // --- Theme Toggle Logic ---
        // const themeToggleBtn = document.getElementById('theme-toggle');
        // const lightIcon = document.getElementById('theme-toggle-light-icon');
        // const darkIcon = document.getElementById('theme-toggle-dark-icon');

        // function setTheme(theme) {
        //     if (theme === 'dark') {
        //         document.documentElement.classList.add('dark');
        //         document.body.classList.add('dark');
        //         document.body.classList.remove('light');
        //         darkIcon.classList.remove('hidden');
        //         lightIcon.classList.add('hidden');
        //         localStorage.setItem('color-theme', 'dark');
        //     } else {
        //         document.documentElement.classList.remove('dark');
        //         document.body.classList.add('light');
        //         document.body.classList.remove('dark');
        //         lightIcon.classList.remove('hidden');
        //         darkIcon.classList.add('hidden');
        //         localStorage.setItem('color-theme', 'light');
        //     }
        // }

        const savedTheme = localStorage.getItem('color-theme');
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
        } else {
            setTheme('light');
        }

        themeToggleBtn.addEventListener('click', () => setTheme(localStorage.getItem('color-theme') === 'dark' ? 'light' : 'dark'));

        // --- Modal Logic ---
        const modal = document.getElementById('result-modal');
        function openModal() {
            modal.classList.remove('opacity-0', 'pointer-events-none');
            modal.querySelector('.relative').classList.remove('scale-95');
        }
        function closeModal() {
            modal.querySelector('.relative').classList.add('scale-95');
            modal.classList.add('opacity-0', 'pointer-events-none');
        }

        // --- Quiz Logic (dapat dipindahkan ke quiz.js) ---
        document.addEventListener('DOMContentLoaded', () => {
            const quizForm = document.getElementById('quiz-form');
            const questionsContainer = document.getElementById('questions');
            const progressBar = document.getElementById('progress-bar');
            
            const questions = [
                "Saya suka memecahkan masalah kompleks dan mencari solusi inovatif.",
                "Saya menikmati bekerja dalam tim dan berkolaborasi dengan orang lain.",
                "Saya tertarik pada data dan analisis untuk membuat keputusan.",
                "Mengekspresikan ide secara visual atau kreatif membuat saya bersemangat.",
                "Saya lebih suka memiliki jadwal yang terstruktur dan dapat diprediksi.",
                "Saya senang memimpin dan mengarahkan orang lain menuju tujuan bersama.",
                "Detail kecil sangat penting bagi saya dalam menyelesaikan pekerjaan.",
                "Saya mudah beradaptasi dengan perubahan dan lingkungan baru.",
                "Membantu atau mengajar orang lain memberikan saya kepuasan.",
                "Saya lebih suka bekerja secara mandiri daripada dalam kelompok besar.",
                "Saya selalu mencari cara untuk membuat proses menjadi lebih efisien.",
                "Saya berani mengambil risiko untuk mendapatkan hasil yang lebih baik."
            ];

            questionsContainer.innerHTML = questions.map((q, index) => `
                <div class="question-block pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p class="text-lg font-semibold mb-4 text-brand-d-brown dark:text-brand-cream">
                        ${index + 1}. ${q}
                    </p>
                    <div class="flex justify-between items-center space-x-2">
                        <span class="text-sm text-brand-d-brown/60 dark:text-brand-cream/60 hidden sm:inline">Tidak Setuju</span>
                        <div class="flex items-center gap-1 sm:gap-2 flex-grow justify-around">
                            ${[1,2,3,4,5].map(val => `
                                <label class="cursor-pointer">
                                    <input type="radio" name="q${index+1}" value="${val}" class="hidden peer" required>
                                    <span class="w-8 h-8 sm:w-10 sm:h-10 grid place-content-center rounded-full border-2 border-gray-300 dark:border-gray-600 peer-checked:border-purple-500 peer-checked:dark:border-fuchsia-500 peer-checked:font-bold peer-checked:shadow-lg transition">${val}</span>
                                </label>
                            `).join('')}
                        </div>
                        <span class="text-sm text-brand-d-brown/60 dark:text-brand-cream/60 hidden sm:inline">Sangat Setuju</span>
                    </div>
                </div>
            `).join('');
            questionsContainer.firstElementChild.classList.remove('pt-6', 'border-t', 'border-gray-200', 'dark:border-gray-700');

            const totalQuestions = questions.length;
            quizForm.addEventListener('change', () => {
                const answeredQuestions = quizForm.querySelectorAll('input[type="radio"]:checked').length;
                progressBar.style.width = `${(answeredQuestions / totalQuestions) * 100}%`;
            });

            quizForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const resultTitle = document.getElementById('result-title');
                const resultBody = document.getElementById('result-body');
                
                resultTitle.textContent = "Profil Anda: The Innovator";
                resultBody.innerHTML = `
                    <p>Anda adalah seorang pemecah masalah alami dengan dorongan kuat untuk inovasi. Anda tidak takut dengan tantangan dan selalu mencari cara baru untuk melakukan sesuatu. Kekuatan Anda terletak pada pemikiran analitis dan kreativitas.</p>
                    <p class="mt-4"><strong>Saran Karir:</strong> Product Manager, Data Scientist, UI/UX Researcher, Management Consultant.</p>
                `;
                
                openModal();
            });
        });
