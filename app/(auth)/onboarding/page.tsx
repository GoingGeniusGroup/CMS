"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { completeOnboarding } from "@/app/actions/onboarding";
import { ShieldCheck } from "lucide-react";

const onboardingFormSchema = z
  .object({
    email: z.email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type OnboardingFormInput = z.infer<typeof onboardingFormSchema>;

export default function OnboardingPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormInput>({
    resolver: zodResolver(onboardingFormSchema),
  });

  async function onSubmit(data: OnboardingFormInput) {
    setError(null);

    const result = await completeOnboarding({
      email: data.email,
      password: data.password,
    });

    if (!result.success) {
      setError(result.error || "Failed to complete onboarding");
      return;
    }

    setSuccess(true);

    // Force logout so the admin must re-authenticate with new credentials
    setTimeout(async () => {
      await signOut({ callbackUrl: "/login", redirect: true });
    }, 2000);
  }

  if (success) {
    return (
      <Card className="p-6 sm:p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <ShieldCheck className="h-6 w-6 text-emerald-600" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Credentials Updated
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Your new email and password have been saved. You&apos;ll be redirected
          to the login page to sign in with your new credentials.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-500">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Welcome, Admin</h2>
          <p className="text-sm text-gray-500">
            Set up your new credentials to secure your account
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>Important:</strong> After saving, you will be logged out and
          must sign in again with your new email and password. The default
          credentials will no longer work.
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            New Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="your-email@example.com"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            New Password <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            Min 8 characters, 1 uppercase, 1 number, 1 special character
          </p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save & Continue"}
        </Button>
      </form>
    </Card>
  );
}
