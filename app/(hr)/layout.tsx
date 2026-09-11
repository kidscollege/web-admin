"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getToken, removeToken } from "@/lib/auth";

const links = [
  { name: "Dashboard", href: "/hr" },
  { name: "Staff", href: "/hr/staff" },
];

export default function HrLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    const stored = localStorage.getItem("user");
    if (!token || !stored) {
      window.location.href = "/login";
      return;
    }
    const parsed = JSON.parse(stored);
    const role = String(parsed.role || "").toUpperCase();
    if (role !== "HR_ADMIN" && role !== "SUPER_ADMIN") {
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

  return (
    <div className="min-h-screen bg-[#F6F3FF] text-[#2E1A5A]">
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-purple-100 transition-transform ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-purple-100">
          <Image src="/logo.png" alt="Kids College" width={40} height={40} className="rounded-full" />
          <div>
            <p className="font-bold">Kids College</p>
            <p className="text-[10px] uppercase tracking-widest text-[#7C3AED]">HR</p>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block rounded-xl px-4 py-3 text-sm font-medium ${
                pathname === link.href
                  ? "bg-[#F3E8FF] text-[#7C3AED]"
                  : "text-slate-600 hover:bg-purple-50"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-100">
          <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs text-slate-500 mb-3">{user?.role}</p>
          <button
            onClick={() => {
              removeToken();
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="w-full text-sm border border-red-200 text-red-500 py-2 rounded-xl"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-purple-100 px-4 py-4 flex items-center gap-3">
          <button className="lg:hidden p-2" onClick={() => setOpen(true)}>☰</button>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-[#7C3AED]">HR portal</p>
            <h2 className="font-bold">{links.find((l) => l.href === pathname)?.name || "HR"}</h2>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}