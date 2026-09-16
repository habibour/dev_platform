"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CodeXml } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/lib/auth-context";
import { loginSchema } from "@/lib/schemas/auth";
import type { LoginFormValues } from "@/lib/schemas/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: (values: LoginFormValues) => login(values.email, values.password),
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
        <h1 className="text-xl font-bold text-chrome-900">Log in</h1>

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
            {mutation.error instanceof Error ? mutation.error.message : "Login failed"}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="cursor-pointer rounded-full bg-brand-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
        >
          {mutation.isPending ? "Logging in…" : "Log in"}
        </button>

        <p className="text-center text-sm text-chrome-600">
          No account?{" "}
          <Link href="/signup" className="font-medium text-brand-500 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}
