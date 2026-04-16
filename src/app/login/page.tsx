"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Flame,
  Loader2,
  LogIn,
  ShieldCheck,
  Lock,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.identifier.trim()) {
      setError("Please enter your phone number, email, or LPG ID.");
      return;
    }

    if (!formData.password.trim()) {
      setError("Please enter your password.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Login failed");
      }

      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      router.push("/app");
    } catch (err: any) {
      setError(err?.message || "Unable to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page-bg flex h-screen overflow-hidden flex-col">
      <div className="auth-shell flex flex-1 items-center justify-center py-3">
        <div className="auth-card auth-bottom-sheet fade-scale w-full max-w-6xl max-h-[92vh] overflow-hidden">
          <div className="auth-card-inner grid h-full grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
            {/* LEFT PANEL */}
            <section className="auth-divider flex flex-col justify-between border-b border-slate-200/50 px-5 py-5 lg:border-b-0 lg:px-7 lg:py-6">
              <div>
                <div className="auth-kicker mb-4 w-fit">
                  <Flame size={15} />
                  Welcome Back
                </div>

                <h1 className="mb-3 text-3xl font-semibold leading-tight tracking-tight text-slate-900 lg:text-4xl">
                  Sign in to access your secure LPG account.
                </h1>

                <p className="mb-5 text-sm leading-6 text-slate-600 lg:text-[15px]">
                  Manage your profile, requests, and LPG-connected services in
                  one clean and secure dashboard experience.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="glass-panel p-3.5">
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                      <ShieldCheck size={17} />
                    </div>
                    <h3 className="mb-1 text-sm font-semibold text-slate-800">
                      Secure access
                    </h3>
                    <p className="text-xs leading-5 text-slate-500">
                      Login with your registered credentials safely.
                    </p>
                  </div>

                  <div className="glass-panel p-3.5">
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                      <Lock size={17} />
                    </div>
                    <h3 className="mb-1 text-sm font-semibold text-slate-800">
                      Fast experience
                    </h3>
                    <p className="text-xs leading-5 text-slate-500">
                      Smooth, quick access to your dashboard.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[20px] border border-blue-100 bg-white/60 p-4 shadow-sm">
                <p className="mb-2 text-sm font-semibold text-slate-700">
                  Why sign in?
                </p>
                <div className="grid gap-2 text-xs text-slate-600">
                  <div className="soft-chip">Access booking and history</div>
                  <div className="soft-chip">View LPG account details</div>
                  <div className="soft-chip">Continue with a secure session</div>
                </div>
              </div>
            </section>

            {/* RIGHT PANEL */}
            <section className="flex flex-col justify-center px-5 py-5 lg:px-7 lg:py-6">
              <div className="mx-auto w-full max-w-xl">
                <div className="mb-5">
                  <div className="mb-2 text-xs font-semibold tracking-[0.18em] text-blue-700">
                    LOGIN
                  </div>
                  <h2 className="mb-1 text-2xl font-semibold tracking-tight text-slate-900 lg:text-3xl">
                    Sign in
                  </h2>
                  <p className="text-sm leading-6 text-slate-500">
                    Enter your details to continue to your account.
                  </p>
                </div>

                {error && <div className="alert-error mb-4">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-4 fade-up">
                  <div>
                    <label className="label-premium">
                      Phone Number / Email / LPG ID
                    </label>
                    <input
                      type="text"
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleChange}
                      placeholder="Enter your registered phone, email, or LPG ID"
                      className="input-premium"
                      autoComplete="username"
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label className="label-premium mb-0">Password</label>
                      <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-blue-700 transition hover:text-indigo-700"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="input-premium"
                      autoComplete="current-password"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-premium w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn size={18} />
                        Sign in
                      </>
                    )}
                  </button>
                </form>

                <div className="my-5 flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                    OR
                  </span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="rounded-[18px] border border-slate-200/70 bg-white/60 p-3.5 text-sm text-slate-600">
                  New here? Create your account and complete LPG verification in
                  a few guided steps.
                </div>

                <div className="mt-4">
                  <Link
                    href="/register"
                    className="btn-secondary-premium w-full"
                  >
                    Create account
                    <ArrowRight size={18} />
                  </Link>
                </div>

                <div className="mt-5 border-t border-slate-200/70 pt-4 text-center text-sm text-slate-500">
                  By continuing, you agree to our secure access and account
                  usage policy.
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <footer className="auth-footer py-2">
        <div className="text-sm text-slate-500">© 2026 LPG Platform</div>

        <div className="auth-footer-links">
          <Link href="/policy">Policy</Link>
          <Link href="/terms">Terms & Conditions</Link>
          <Link href="/support">Support</Link>
        </div>
      </footer>
    </main>
  );
}