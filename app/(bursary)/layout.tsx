"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getToken, removeToken } from "@/lib/auth";

export default function BursaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = getToken();
    const stored = localStorage.getItem("user");

    if (!token || !stored) {
      window.location.href = "/login";
      return;
    }

    const parsed = JSON.parse(stored);
    const role = String(parsed.role || "").trim().toUpperCase();

    if (role !== "BURSAR" && role !== "SUPER_ADMIN") {
      window.location.href = "/dashboard";
      return;
    }

    setUser(parsed);
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  const links = [
    { name: "Dashboard", href: "/bursary" },
    { name: "Invoices", href: "/bursary/invoices" },
    { name: "Payments", href: "/bursary/payments" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b px-4 py-4 flex items-center justify-between">
        <div>
          <p className="font-bold text-[#17233C]">Kids College</p>
          <p className="text-xs text-slate-500">Bursary Portal</p>
        </div>
        <nav className="hidden sm:flex items-center gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm px-3 py-1.5 rounded-lg ${
                pathname === link.href
                  ? "bg-[#EEF4FF] text-[#1E4D9B]"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">
            {user?.firstName} {user?.lastName}
          </span>
          <button
            onClick={() => {
              removeToken();
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="text-sm border px-3 py-1.5 rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4 sm:p-6">{children}</main>
    </div>
  );
}