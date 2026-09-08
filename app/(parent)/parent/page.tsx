"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function ParentDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/parent/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          removeToken();
          router.push("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#2E1A5A]">
          Welcome{data?.parent?.firstName ? `, ${data.parent.firstName}` : ""}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          View your children’s school information
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Children</p>
          <p className="text-3xl font-bold text-[#7C3AED] mt-2">
            {data?.childrenCount || 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#2E1A5A]">My Children</h2>
          <Link
            href="/parent/children"
            className="text-sm text-[#7C3AED] hover:underline"
          >
            View all
          </Link>
        </div>

        {data?.children?.length ? (
          <div className="space-y-3">
            {data.children.map((child: any) => (
              <div
                key={child.id}
                className="border border-purple-50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div>
                  <p className="font-semibold text-[#2E1A5A]">
                    {child.firstName} {child.lastName}
                  </p>
                  <p className="text-sm text-slate-500">
                    {child.admissionNumber}
                    {child.className ? ` · ${child.className}` : ""}
                  </p>
                </div>
                <Link
                  href={`/parent/children/${child.id}`}
                  className="text-sm bg-[#7C3AED] text-white px-4 py-2 rounded-full text-center"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No linked children found.</p>
        )}
      </div>
    </div>
  );
}