import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ["class"],
	content: ["./src/**/*.{html,js,svelte,ts}"],
	safelist: ["dark"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px"
			}
		},
		extend: {
			textColor: {
				foreground: "#B7BABE",
			},
			colors: {
				border: "hsl(var(--border) / <alpha-value>)",
				input: "hsl(var(--input) / <alpha-value>)",
				ring: "hsl(var(--ring) / <alpha-value>)",
				background: "hsl(var(--background) / <alpha-value>)",
				inputbackground: "hsl(var(--input-background) / <alpha-value>)",
				foreground: "hsl(var(--foreground) / <alpha-value>)",
				primary: {
					DEFAULT: "hsl(var(--primary) / <alpha-value>)",
					foreground: "hsl(var(--primary-foreground) / <alpha-value>)"
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
					foreground: "hsl(var(--secondary-foreground) / <alpha-value>)"
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
					foreground: "hsl(var(--destructive-foreground) / <alpha-value>)"
				},
				muted: {
					DEFAULT: "hsl(var(--muted) / <alpha-value>)",
					foreground: "hsl(var(--muted-foreground) / <alpha-value>)"
				},
				accent: {
					DEFAULT: "hsl(var(--accent) / <alpha-value>)",
					foreground: "hsl(var(--accent-foreground) / <alpha-value>)"
				},
				popover: {
					DEFAULT: "hsl(var(--popover) / <alpha-value>)",
					foreground: "hsl(var(--popover-foreground) / <alpha-value>)"
				},
				card: {
					DEFAULT: "hsl(var(--card) / <alpha-value>)",
					foreground: "hsl(var(--card-foreground) / <alpha-value>)"
				}
			},
			backgroundImage: {
				'gradient-blue-vertical': 'linear-gradient(180deg, #62DCF6 0%, #5FB4F2 100%)'
			},
			dropShadow: {
				'blue-glow': `drop-shadow(0px 1.6px 4px rgba(98, 220, 246, 0.25)) drop-shadow(0px 0px 50px rgba(98, 220, 246, 0.50))`
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)"
			},
			fontFamily: {
				sans: ["Poppins", ...fontFamily.sans]
			},
			keyframes: {
				slosh: {
					'0%': { transform: 'rotate(-18deg)' },
					'20%': { transform: 'rotate(10deg)' },
					'40%': { transform: 'rotate(-6deg)' },
					'60%': { transform: 'rotate(3deg)' },
					'80%': { transform: 'rotate(-1.8deg)' },
					'100%': { transform: 'rotate(0deg)' },
				},
				flow: {
					'0%': { backgroundPosition: "0% 50%" },
					'100%': { backgroundPosition: "200% 50%" },
				}
			},
			animation: {
				'slosh': 'slosh 1s cubic-bezier(.66,-0.14,.33,1.14) 1 alternate',
				'flow': 'flow 3s linear infinite',
			}
		}
	},
};

export default config;
