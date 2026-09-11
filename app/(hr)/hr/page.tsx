"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function HrDashboardPage() {
  const router = useRouter();
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    api
      .get("/hr/staff")
      .then((res) => setStaff(Array.isArray(res.data) ? res.data : res.data?.data || []))
      .catch((err) => {
        if (err.response?.status === 401) {
          removeToken();
          router.push("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const active = staff.filter((s) => s.status === "ACTIVE").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#2E1A5A]">HR Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Staff and employment records</p>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-purple-100 p-5">
            <p className="text-xs text-slate-500">Total staff</p>
            <p className="text-2xl font-bold">{staff.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-purple-100 p-5">
            <p className="text-xs text-slate-500">Active</p>
            <p className="text-2xl font-bold">{active}</p>
          </div>
        </div>
      )}

      <Link
        href="/hr/staff"
        className="inline-block bg-[#7C3AED] text-white px-5 py-2.5 rounded-full text-sm"
      >
        Manage staff
      </Link>
    </div>
  );
}