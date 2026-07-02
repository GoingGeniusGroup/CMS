import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        // Dynamic import keeps Prisma out of Edge runtime bundle
        const { validateUserCredentials } = await import("@/lib/auth-service");

        const user = await validateUserCredentials(email, password);
        if (!user) return null;

        return user;
      },
    }),
  ],
});
