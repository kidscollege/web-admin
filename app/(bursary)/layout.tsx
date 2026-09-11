"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "@/lib/auth";

export default function BursaryLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = getToken();
    const stored = localStorage.getItem("user");
    if (!token || !stored) {
      router.replace("/login");
      return;
    }

    const parsed = JSON.parse(stored);
    const role = String(parsed.role || "").toUpperCase();
    if (role !== "BURSAR" && role !== "SUPER_ADMIN") {
      router.replace("/dashboard");
      return;
    }

    setUser(parsed);
    setReady(true);
  }, [router]);

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b px-4 py-4 flex items-center justify-between">
        <div>
          <p className="font-bold text-[#17233C]">Kids College</p>
          <p className="text-xs text-slate-500">Bursary Portal</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">
            {user?.firstName} {user?.lastName}
          </span>
          <button
            onClick={() => {
              removeToken();
              localStorage.removeItem("user");
              router.push("/login");
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