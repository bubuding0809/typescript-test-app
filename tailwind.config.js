/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderWidth: {
        3: "3px",
      },
      backgroundImage: {
        "green-image": "url('/public/images/paul-weaver-unsplash.jpeg')",
      },
      backgroundColor: {
        "secondary-green": "#9cb380",
      },
      minHeight: {
        10: "10px",
        20: "20px",
        "20%": "20%",
        "25%": "25%",
        "30%": "30%",
        "40%": "40%",
        "50%": "50%",
        "60%": "60%",
        "75%": "75%",
      },
      maxHeight: {
        "70%": "70%",
        "80%": "80%",
        "90%": "90%",
      },
    },
  },
  plugins: [],
};
