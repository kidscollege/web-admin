"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken, removeToken } from "@/lib/auth";

const links = [
  { name: "Dashboard", href: "/teacher" },
  { name: "Attendance", href: "/teacher/attendance" },
  { name: "Results", href: "/teacher/results" },
  { name: "Change Password", href: "/teacher/change-password" },
];

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = getToken();
    const stored = localStorage.getItem("user");

    if (!token || !stored) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(stored);
    if (parsed.role !== "TEACHER") {
      router.push("/dashboard");
      return;
    }

    setUser(parsed);
    setReady(true);
  }, [router]);

  const logout = () => {
    removeToken();
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5FF]">
      <header className="bg-white border-b border-purple-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-bold text-[#2E1A5A]">Kids College</p>
            <p className="text-xs text-slate-500">Teacher Portal</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600 hidden sm:block">
              {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={logout}
              className="text-sm border border-purple-200 text-[#4B2E83] px-3 py-1.5 rounded-full hover:bg-purple-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <nav className="flex gap-2 mb-6 overflow-x-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                pathname === link.href
                  ? "bg-[#7C3AED] text-white"
                  : "bg-white text-slate-600 border border-purple-100"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {children}
      </div>
    </div>
  );
}