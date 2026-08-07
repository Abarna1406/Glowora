/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // "ink" = the site's dark neutral — used for both body text AND dark
        // surfaces (footer, hero overlays, primary-dark backgrounds).
        // Value = the spec's Text colour (#1F2937).
        ink: {
          DEFAULT: '#1F2937',
          soft: '#374151',
        },
        // "porcelain" = page/card background. Value = spec's Background (#FFFFFF).
        porcelain: '#FFFFFF',
        // "sand" = soft tinted surfaces (section backgrounds, subtle fills).
        // sand.light = spec's Light Pink (#FDF2F8) exactly.
        sand: {
          DEFAULT: '#FCE7F3',
          light: '#FDF2F8',
          dark: '#F9A8D4',
        },
        // "gold" = primary brand accent (buttons, prices, ratings, CTAs).
        // Repurposed from the old gold accent to the spec's pink palette:
        // DEFAULT = Primary (#EC4899), light = Secondary (#F472B6),
        // dark = Hover (#DB2777) — all exact spec values.
        gold: {
          DEFAULT: '#EC4899',
          light: '#F472B6',
          dark: '#DB2777',
        },
        // "clay" = destructive / error accent (out of stock, remove, cancel).
        clay: '#DC2626',
        // "line" = border colour. Value = spec's Border (#FBCFE8) exactly.
        line: '#FBCFE8',
        // "moss" = success / positive accent (in-stock, savings, confirmations).
        moss: '#16A34A',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        script: ['"Alex Brush"', 'cursive'],
      },
      letterSpacing: {
        widest2: '0.28em',
      },
      boxShadow: {
        soft: '0 20px 60px -30px rgba(236,72,153,0.28)',
        card: '0 10px 30px -15px rgba(31,41,55,0.14)',
        glow: '0 0 0 1px rgba(236,72,153,0.35)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      backgroundImage: {
        'gold-fade': 'linear-gradient(135deg, #F472B6 0%, #EC4899 55%, #DB2777 100%)',
        'ink-fade': 'linear-gradient(180deg, #1F2937 0%, #374151 100%)',
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        'fade-up': 'fadeUp .7s ease forwards',
        'loading-bar': 'loadingBar 1.1s ease-in-out infinite',
        'float-slow': 'floatSlow 11s ease-in-out infinite',
        'float-slower': 'floatSlow 15s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        loadingBar: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(16px, -24px)' },
        },
      },
    },
  },
  plugins: [],
}
