/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: "#0a0a0f",
          dark: "#12121a",
          primary: "#00f0ff",
          secondary: "#7000ff",
          accent: "#ff0099",
          glass: "rgba(18, 18, 26, 0.7)",
          "glass-border": "rgba(255, 255, 255, 0.1)",
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 10px #00f0ff' },
          '50%': { opacity: .5, boxShadow: '0 0 20px #00f0ff' },
        }
      }
    },
  },
  plugins: [],
}
