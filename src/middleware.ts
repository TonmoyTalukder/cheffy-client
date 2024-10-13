import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { getCurrentUser } from "./services/AuthService";

// Define routes that don't require authentication
const AuthRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl; // Get the current path of the request

  // Fetch the current user (from session, token, etc.)
  const user = await getCurrentUser();

  // If the user is not logged in and tries to access a non-auth route, redirect to login
  if (!user) {
    if (AuthRoutes.includes(pathname)) {
      // Allow access to auth routes (login, signup)
      return NextResponse.next();
    } else {
      // Redirect to login with redirect path if not authenticated
      return NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, request.url),
      );
    }
  }

  // If the user is logged in and tries to access login or signup, redirect to home page
  if (user && AuthRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If authenticated, allow access to the requested page
  return NextResponse.next();
}

// Configuration to specify matching routes
export const config = {
  matcher: ["/", "/profile", "/profile/:page*", "/admin", "/login", "/signup"],
};
