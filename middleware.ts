import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isLoginPage = req.nextUrl.pathname === "/admin/login";

    // Allow access to login page without authentication
    if (isLoginPage) {
      return NextResponse.next();
    }

    // Redirect to login if not authenticated
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    // Redirect to dashboard if trying to access login while authenticated
    if (isLoginPage && token) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    // Check admin role for all admin routes except login
    if (isAdminRoute && token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isLoginPage = req.nextUrl.pathname === "/admin/login";
        return isLoginPage || !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
}; 