"use server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const onboardingSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export async function completeOnboarding(formData: {
  email: string;
  password: string;
}) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    if (session.user.isOnboarded) {
      return { success: false, error: "Onboarding already completed" };
    }

    // Validate input
    const result = onboardingSchema.safeParse(formData);
    if (!result.success) {
      const firstError = result.error.issues[0];
      return { success: false, error: firstError.message };
    }

    const { email, password } = result.data;

    // Check if new email is already taken by another user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== session.user.id) {
      return { success: false, error: "This email is already in use" };
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the admin credentials and mark as onboarded
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        email,
        password: hashedPassword,
        isOnboarded: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Onboarding error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
