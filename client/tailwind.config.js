/** @type {import('tailwindcss').Config} */
export default {
  content: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  theme: {
    extend: {
      keyframes: {
        slidein: {
          from: {
            opacity: "0",
            transform: "translateX(-50%) translateY(calc(-100%))",
          },
          to: {
            opacity: "1",
            transform: "translateX(-50%) translateY(calc(-100% - 8px))",
          },
        },
        slideinLeftToRight: {
          from: {
            opacity: "0",
            transform: "translateX(calc(100%))",
          },
          to: {
            opacity: "1",
            transform: "translateX(calc(100% + 10px))",
          },
        },
      },
      animation: {
        slidein: "slidein 300ms ease 0s forwards",
        slideinLeftToRight: "slideinLeftToRight 300ms ease 0s forwards",
      },
    },
  },
  plugins: [],
};
