export default {
    content: ["./src/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                martel: ["Martel", "serif"],
            },
            backgroundImage: {
                "soft-vertical":
                    "linear-gradient(180deg, #fdf7f7 0%, #c6F7F7 100%)",
                "signin-btn": "linear-gradient(to right,#36C5D1, #A82ED3)",
            },
        },
    },
    plugins: [],
};
