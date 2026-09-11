"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@school.com");
  const [password, setPassword] = useState("Admin@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { access_token, user } = response.data;

      const token =
        access_token || response.data.accessToken || response.data.token;

      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));

      const role = String(user?.role || "").toUpperCase();

      if (role === "PARENT") {
        window.location.href = "/parent";
        return;
      }

      if (role === "TEACHER") {
        window.location.href = "/teacher";
        return;
      }

      if (role === "BURSAR") {
        window.location.href = "/bursary";
        return;
      }

      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left form side */}
      <div className="flex items-center justify-center bg-white px-4 py-10">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-slate-500 hover:text-[#7C3AED] mb-8"
          >
            ← Back to website
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="Kids College"
                width={42}
                height={42}
                className="rounded-full"
              />
              <div>
                <p className="font-bold text-[#2E1A5A]">Kids College</p>
                <p className="text-xs text-slate-500">Portal</p>
              </div>
            </div>

            <h1 className="text-3xl font-extrabold text-[#2E1A5A]">Sign In</h1>
            <p className="text-slate-500 mt-2 text-sm">
              Enter your email and password to access the school management
              system.
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 text-red-600 rounded-xl p-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Return to{" "}
            <Link
              href="/"
              className="text-[#7C3AED] hover:underline font-medium"
            >
              Kids College website
            </Link>
          </p>
        </div>
      </div>

      {/* Right branded side */}
      <div className="hidden lg:flex relative items-center justify-center bg-[#2E1A5A] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.25),transparent_55%)]" />
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative z-10 text-center px-8">
          <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-white p-2 shadow-xl">
            <Image
              src="/logo.png"
              alt="Kids College"
              width={88}
              height={88}
              className="rounded-full object-contain"
            />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-3">
            Kids College
          </h2>
          <p className="text-purple-200 max-w-sm mx-auto leading-relaxed">
            School Management System for academics, finance, attendance,
            admissions, and more.
          </p>
          <p className="text-purple-300 text-sm mt-6">First Among Equals</p>
        </div>
      </div>
    </div>
  );
}