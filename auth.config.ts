import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config. Used by middleware.
 * Does NOT import Prisma or any Node.js-only modules.
 */
export const authConfig: NextAuthConfig = {
  providers: [], // Providers are defined in the full auth.ts
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role ?? "user";
        token.isOnboarded = user.isOnboarded ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isOnboarded = token.isOnboarded as boolean;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      // This runs in the Edge middleware context
      const isLoggedIn = !!auth?.user;
      const isOnboarded = (auth?.user as { isOnboarded?: boolean })?.isOnboarded ?? false;
      const pathname = nextUrl.pathname;

      // Block register
      if (pathname.startsWith("/register")) return false;

      // Admin-only route prefixes. Everything else — the whole client website,
      // including custom pages under /[slug] — stays public.
      const adminPrefixes = [
        "/dashboard",
        "/settings",
        "/website-setup",
        "/customer",
        "/projects",
        "/team",
        "/services",
        "/careers",
        "/blog",
        "/category",
        "/pages",
        "/leads",
        "/analytics",
        "/invoices",
        "/login",
        "/onboarding",
      ];
      const isAdminRoute = adminPrefixes.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
      );

      if (!isAdminRoute) return true;

      const isAuthPage = pathname.startsWith("/login");
      const isOnboardingPage = pathname.startsWith("/onboarding");

      if (isAuthPage) {
        if (isLoggedIn) {
          const url = isOnboarded ? "/dashboard" : "/onboarding";
          return Response.redirect(new URL(url, nextUrl));
        }
        return true;
      }

      if (isOnboardingPage) {
        if (!isLoggedIn) return false; // Will redirect to login
        if (isOnboarded) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      // Admin routes require auth + onboarding
      if (!isLoggedIn) return false; // Will redirect to login
      if (!isOnboarded) {
        return Response.redirect(new URL("/onboarding", nextUrl));
      }
      return true;
    },
  },
};
