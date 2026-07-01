import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * Edge middleware — uses ONLY auth.config.ts (no Prisma, no providers).
 * The authorized() callback in authConfig handles all route protection.
 */
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
