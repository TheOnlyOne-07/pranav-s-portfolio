/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#e6e6e6",
        purple: "#b200ff",
        pink: "#f5009b",
        yellow: "#fbea04",
        red: "#ff0808",
        forest: "#3c584c",
        lime: "#63c636",
        mint: "#afe4bb",
      },
      fontFamily: {
        display: ['Anton', 'Impact', '"Arial Narrow"', 'sans-serif'],
        sans: ['"General Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'hs-sm': '3px 3px 0 #000',
        'hs': '6px 6px 0 #000',
        'hs-lg': '10px 10px 0 #000',
        'hs-yellow': '6px 6px 0 #fbea04',
        'hs-pink': '6px 6px 0 #f5009b',
      }
    },
  },
  plugins: [],
}
