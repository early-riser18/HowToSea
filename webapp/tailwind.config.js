/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",

  ],
  theme: {
    extend: {
      colors: {
        primary: "#0091ff",
      },
      boxShadow: {
        header: "1px 1px 6px #eee",
      },
      fontFamily: {
        header: ["TommySoft", "Arial", "Helvetica"],
        main: ["Quicksand", "Verdsana", "Tahoma"],
      },
    },
    backgroundImage: {
      home_search:
        "linear-gradient(180deg, rgba(143, 170, 220, .05), rgba(47, 85, 151, .29) 38%), url('/search-bar-bg.jpg')",
      "search-gradient":
        "linear-gradient(58deg, #0091ff 22%, #30d5ff 80%, #a9f8ff)",
    },
  },
  plugins: [],
};
