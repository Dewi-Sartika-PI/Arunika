// Konfigurasi Tailwind untuk Play CDN (harus dimuat setelah CDN, sebelum UI dipakai)
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      },
      colors: {
        'brand-cream': '#FEF6DD',
        'brand-d-brown': '#401F18',
        'brand-gold': '#B57D3D',
        'brand-maroon': '#430109',
        'brand-red': '#70020F',
        'brand-ivory': '#FFFFF1',
        // Dark Mode Palette
        'dark-primary': '#2C1B19',
        'dark-secondary': '#36221F',
      },
    },
  },
};
