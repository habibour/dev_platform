"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CodeXml } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/lib/auth-context";
import { signupSchema } from "@/lib/schemas/auth";
import type { SignupFormValues } from "@/lib/schemas/auth";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });

  const mutation = useMutation({
    mutationFn: (values: SignupFormValues) => signup(values.name, values.email, values.password),
    onSuccess: () => router.push("/"),
  });

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-brand-50 px-4 py-12">
      <span className="relative mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-500 text-white">
        <CodeXml size={26} strokeWidth={2.5} />
        <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-brand-100" />
      </span>

      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-chrome-0 p-8 shadow-sm"
      >
        <h1 className="text-xl font-bold text-chrome-900">Create an account</h1>

        <label className="flex flex-col gap-1.5 text-sm text-chrome-700">
          Name
          <input
            type="text"
            {...register("name")}
            className="rounded-md border border-chrome-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
          {errors.name && <span className="text-xs text-like">{errors.name.message}</span>}
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-chrome-700">
          Email
          <input
            type="email"
            {...register("email")}
            className="rounded-md border border-chrome-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
          {errors.email && <span className="text-xs text-like">{errors.email.message}</span>}
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-chrome-700">
          Password
          <input
            type="password"
            {...register("password")}
            className="rounded-md border border-chrome-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
          {errors.password && <span className="text-xs text-like">{errors.password.message}</span>}
        </label>

        {mutation.isError && (
          <p className="rounded-md bg-like/10 px-3 py-2 text-sm text-like">
            {mutation.error instanceof Error ? mutation.error.message : "Signup failed"}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="cursor-pointer rounded-full bg-brand-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
        >
          {mutation.isPending ? "Creating account…" : "Register"}
        </button>

        <p className="text-center text-sm text-chrome-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand-500 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
