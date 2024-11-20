import NextAuth, { type NextAuthConfig } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authConfig from "@/../auth.config";

const debugSessions: boolean = process.env.DEBUG_AUTH_SESSIONS ? true : false;
export const cookiePrefix =
	process.env.NODE_ENV === "production" ? "__Secure-" : "__Dev-";

export const {
	handlers,
	auth,
	signIn,
	signOut,
	unstable_update: updateSession,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
} = NextAuth(
	//{
	async (request: NextRequest | undefined) => {
	return {
		...authConfig,
		jwt: {},
		session: {strategy: "jwt"},
		cookies: {
			sessionToken: {
				name: `${cookiePrefix}authjs.session-token`,
			},
			callbackUrl: {
				name: `${cookiePrefix}authjs.callback-url`,
				options: {
					httpOnly: true,
					sameSite: "lax",
					path: "/",
					secure: true,
				},
			},
		},
		callbacks: {
			async signIn({ user, account, profile, email, credentials }) {
				if (debugSessions)
					console.error(
						"signIn({ user, account, profile, email, credentials })",
					);
				if (debugSessions) {
					console.log({ user, account, profile, email, credentials });
					console.error("signIn request object");
					// request is available with lazy init
					console.log({request});
				}
				if (!user) {
					return false; //"/login?error=InvalidCredentials";
				}
				return true; // Proceed with redirect on successful login
			},
			async jwt({ token, user, account, profile, trigger, session }) {
				if (debugSessions) {
					console.error(
						"within jwt({ token, user, account, profile, trigger, session })",
					);
					console.log({
						token,
						user,
						account,
						profile,
						trigger,
						session,
					});
				}
				
				if (trigger === "signUp") {
					if (debugSessions) {
						console.error("within jwt trigger === signUp");
					}
				}
				if (trigger === "signIn") {
					if (debugSessions) {
						console.error("within jwt trigger === signIn");
					}

					// TODO: an unsolved problem: what if the token wasn't refreshed and we are in an update?
				} else if (trigger === "update") {
					if (debugSessions) {
						console.error("within jwt trigger === update");
					}
				}

				// on signIn with credentials, the authorize callback in providers.ts (not the authorized callback) returns
				// user as User from CredentialsConfig.authorize callback in providers.ts
				// here we filter the fields and return them to the session
				if (user) {
					if (debugSessions) {
						console.error("within jwt if (user)");
						console.log({ user, token });
					}
					const {
						...userRest
					} = user;

					token.user = {
						...userRest,
						// AdapterUser and User conflict on whether id and email can be undefined, this is unsolved, see next-auth.d.ts
						id: user.id || "",
						email: user.email || "",
					};
					
				}
				return token; // to session callback as token param
			},

			// called whenever the session is checked
			async session({ session, token }) {
				if (debugSessions) {
					console.error("within session({ session, token }) ");
					console.log({
						session,
						token,
					});
				}
				
				const { sessionToken, ...theSessionRest } = session;
				return theSessionRest;
			},
			// runs whenever the user's authorization is checked, use for authorization checks
			async authorized({ request, auth }) {
				if (debugSessions) {
					console.error("within authorized({ request, auth })");
					console.log({ request, auth });
				}
				const isAuthenticated = !!auth;
				return true; // Allow the user to proceed
			},
			async redirect({ url, baseUrl }) {
				if (debugSessions) {
					console.error("within redirect({ url, baseUrl })");
					console.log({ url, baseUrl });
				}
				// Check if `url` starts with `/specialcase`, indicating a special path with a token
				if (url.startsWith(`${baseUrl}/specialcase`)) {
					if (debugSessions) {
						console.log({ url });
					}
					return url;
				}
				// Default redirect path if not on `/specialcase`
				return `${baseUrl}/dashboard`;
			},
			
		},
	};
	//satisfies Awaitable<NextAuthConfig>; //NextAuthConfig;
});
