"use server";

import { signIn } from "@/auth";
import { loginSchema } from "@/lib/validations/auth";
import { AuthError } from "next-auth";

/**
 * Login user with credentials
 */
export async function loginUser(formData: {
  email: string;
  password: string;
}) {
  try {
    const validated = loginSchema.parse(formData);

    const result = await signIn("credentials", {
      email: validated.email,
      password: validated.password,
      redirect: false,
    });

    if (!result) {
      return { success: false, error: "Invalid email or password" };
    }

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid email or password" };
        default:
          return { success: false, error: "Authentication failed" };
      }
    }

    return { success: false, error: "An error occurred during login" };
  }
}

/**
 * Get current user session
 */
export async function getCurrentUser() {
  try {
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user) {
      return null;
    }

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
      isOnboarded: session.user.isOnboarded,
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}
