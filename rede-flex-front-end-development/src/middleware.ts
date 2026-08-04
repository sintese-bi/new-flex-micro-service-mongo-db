import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  let access_token = request.cookies.get("access_token");
  if (!access_token)
    return NextResponse.redirect(new URL("/login", request.url));
}
// See "Matching Paths" below to learn more
export const config = {
  matcher: "/dashboard",
};
