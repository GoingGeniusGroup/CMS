"use server";

import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import prisma from "@/lib/prisma";
import { registerSchema, loginSchema } from "@/lib/validations/auth";
import { AuthError } from "next-auth";

/**
 * Register a new user
 */
export async function registerUser(formData: {
  name?: string;
  email: string;
  password: string;
}) {
  try {
    // Validate input
    const validated = registerSchema.parse(formData);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "Email already registered",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        role: "user",
      },
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        error: "Invalid input data",
      };
    }

    return {
      success: false,
      error: "Registration failed. Please try again.",
    };
  }
}

/**
 * Login user with credentials
 */
export async function loginUser(formData: {
  email: string;
  password: string;
}) {
  try {
    // Validate input
    const validated = loginSchema.parse(formData);

    // Attempt to sign in
    const result = await signIn("credentials", {
      email: validated.email,
      password: validated.password,
      redirect: false,
    });

    if (!result) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            error: "Invalid email or password",
          };
        default:
          return {
            success: false,
            error: "Authentication failed",
          };
      }
    }

    return {
      success: false,
      error: "An error occurred during login",
    };
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
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}
