// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-08-05",
	devtools: { enabled: true },
	routeRules: {
		"/api": {
			security: {
				rateLimiter: {
					tokensPerInterval: 5,
					interval: 30000,
					headers: true,
				},
			},
		},
	},
	typescript: {
		strict: true,
		typeCheck: true,
	},
	modules: [
		"@nuxtjs/tailwindcss",
		"@vueuse/nuxt",
		"@nuxtjs/color-mode",
		"@nuxtjs/google-fonts",
		"motion-v/nuxt",
		"@nuxt/test-utils/module",
		"@vercel/analytics",
		"@vercel/speed-insights"
	],
	colorMode: {
		classSuffix: "",
	},
	googleFonts: {
		families: {
			Inter: [300, 400, 500, 600, 700],
			"JetBrains Mono": [400, 500],
		},
	},
	css: ["~/assets/css/main.css"],
	app: {
		pageTransition: { name: "page", mode: "out-in" },
		layoutTransition: { name: "layout", mode: "out-in" },
		head: {
			link: [
				{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }
			]
		}
	},
	vite: {
		optimizeDeps: {
			include: [
				"@vue/devtools-core",
				"@vue/devtools-kit",
			],
		},
		server: {
			// timeout: 30000
		},
	},
});
