// // Script UI (toggle tema, dsb.)
// document.addEventListener('DOMContentLoaded', () => {
//   const themeToggleBtn = document.getElementById('theme-toggle');
//   const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
//   const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

//   const applyTheme = (isDark) => {
//     if (isDark) {
//       document.documentElement.classList.add('dark');
//       themeToggleLightIcon.classList.remove('hidden'); // tampilkan ikon "sun"
//       themeToggleDarkIcon.classList.add('hidden');
//     } else {
//       document.documentElement.classList.remove('dark');
//       themeToggleDarkIcon.classList.remove('hidden'); // tampilkan ikon "moon"
//       themeToggleLightIcon.classList.add('hidden');
//     }
//   };

//   const savedThemeIsDark = localStorage.getItem('color-theme') === 'dark';
//   const hasStored = localStorage.getItem('color-theme') === 'dark' || localStorage.getItem('color-theme') === 'light';
//   const osPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

//   applyTheme(hasStored ? savedThemeIsDark : osPrefersDark);

//   themeToggleBtn.addEventListener('click', () => {
//     const isCurrentlyDark = document.documentElement.classList.contains('dark');
//     applyTheme(!isCurrentlyDark);
//     localStorage.setItem('color-theme', !isCurrentlyDark ? 'dark' : 'light');
//   });
// });
