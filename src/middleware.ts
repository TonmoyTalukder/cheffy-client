import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { getCurrentUser } from "@/src/services/AuthService";

const AuthRoutes = ["/login", "/signup"];
const AdminRoutes = ["/admin-dashboard", "/admin-recipe", "/admin-user"];
const SharedRoutes = ["/profile", "/recipe"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = await getCurrentUser();

  if (user?.status === "BLOCKED") {
    return NextResponse.redirect(new URL(`/login?status=blocked`, request.url));
  }

  if (!user) {
    if (AuthRoutes.includes(pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, request.url),
      );
    }
  }

  if (user.role === "ADMIN") {
    // Allow access to admin routes
    if (AdminRoutes.includes(pathname)) {
      return NextResponse.next();
    }

    // Allow access to shared routes or routes starting with shared paths
    if (
      SharedRoutes.some((route) => pathname.startsWith(route)) ||
      pathname.startsWith("/profile/") ||
      pathname.startsWith("/recipe/")
    ) {
      return NextResponse.next();
    }

    // Redirect to admin dashboard for other routes
    return NextResponse.redirect(new URL("/admin-dashboard", request.url));
  }

  // If user is not admin, restrict admin routes
  if (AdminRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Restrict access to login/signup pages for logged-in users
  if (AuthRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/profile",
    "/profile/:page*",
    "/recipe/:page*",
    "/admin-dashboard",
    "/admin-recipe",
    "/admin-user",
    "/premium-recipe",
    "/premium-recipe/:page*",
    "/follow",
    "/login",
    "/signup",
  ],
};
