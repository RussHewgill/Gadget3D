/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')

module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  // plugins: [
  //   plugin(function({ addVariant }) {
  //     addVariant('hocus', ['&:hover', '&:focus'])
  //   })
  // ],
	theme: {
		screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
		colors: {
			'light-shade': '#FBF9FB',
			'light-accent': '#C5957A',
			'color-main': '#CE2020',
			'dark-accent': '#867C93',
			'dark-shade': '#211D24',
    },
		// fontFamily: {
    //   sans: ['Graphik', 'sans-serif'],
    //   serif: ['Merriweather', 'serif'],
    // },
		extend: {
			spacing: {
			}
		},
	},
	plugins: [],
}
