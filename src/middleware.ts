import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth(async function middleware(req: NextRequest) {
  // Your custom middleware logic goes here
  console.error('Within custom middleware');
  return NextResponse.next();
})

export const config = {
	matcher: [
		// General pattern to match all other paths excluding certain patterns
		// TODO: added auth to try to resolve middleware issues
		"/((?!auth|api|_next/static|_next/image|favicon.ico).*)",
	],
};
