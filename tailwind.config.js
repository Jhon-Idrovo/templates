const colors = require("tailwindcss/colors");
module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      base: colors.yellow[200],
      "txt-base": colors.black,
      primary: colors.yellow[100],
      "txt-primary": colors.black,
      secondary: colors.yellow[900],
      "txt-secondary": colors.white,
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
