/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 扫描所有 src 下的文件
    "./node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}", // 扫描 shadcn 组件
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};