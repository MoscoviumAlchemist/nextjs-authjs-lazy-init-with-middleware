import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";

export const providers: Provider[] = [
	Credentials({
		/**
		 * The authorize callback is called when a user signs in with the credentials provider.
		 */

		async authorize(credentials, request) {
			console.error("within authorize(credentials, request)");
			console.log({ credentials, request });
			// credentials also has a callbackUrl
			const loginInput = {
				username: credentials.username,
				password: credentials.password,
			};
			const user = {email:"foo@bar.com", name: "Foo bar"}
			return user; // to jwt callback
		},
	}),
];
