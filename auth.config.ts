import type { NextAuthConfig } from "next-auth";
import { providers } from "@/lib/auth/providers";

export default {
	// secret is required
	secret: process.env.AUTH_SECRET,
	trustHost: true,
	theme: {
		logo: "https://next-auth.js.org/img/logo/logo-sm.png",
	},
	basePath: "/auth",
	pages: {
		signIn: "/login",
		error: "/error",
	},
	debug: true,
	logger: {
		error(code, ...message) {
			console.error(code, message);
		},
		warn(code, ...message) {
			console.warn(code, message);
		},
		debug(code, ...message) {
			console.debug(code, message);
		},
	},
	providers,
	events: {
		async signOut() {
			
			console.log("TODO: add other cleanup, user signed out");
		},
	},
} satisfies NextAuthConfig;
