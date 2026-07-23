/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // บังคับให้ Tailwind อ่านไฟล์ทั้งหมดใน src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}