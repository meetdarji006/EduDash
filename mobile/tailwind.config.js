/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        fontFamily: {
            sans: ['Ubuntu', 'Ubuntu_300', 'Ubuntu_500', 'Ubuntu_700', 'sans-serif'],
            ubuntu: ['Ubuntu', 'Ubuntu_300', 'Ubuntu_500', 'Ubuntu_700', 'sans-serif'],
            bold: ['Ubuntu_700'],
            thin: ['Ubuntu_300'],
            medium : ['Ubuntu_500'],
        },
        extend: {},
    },
    plugins: [],
}
