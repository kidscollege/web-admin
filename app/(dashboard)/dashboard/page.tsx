"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/dashboard/overview")
      .then((res) => setOverview(res.data))
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
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  const cards = [
  {
    title: "Active Students",
    value: overview?.students?.active || 0,
    subtitle: `Total: ${overview?.students?.total || 0}`,
    color: "bg-blue-500",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    ),
  },
  {
    title: "Active Staff",
    value: overview?.staff?.active || 0,
    subtitle: `Total: ${overview?.staff?.total || 0}`,
    color: "bg-emerald-500",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
      />
    ),
  },
  {
    title: "Pending Applications",
    value: overview?.admissions?.pending || 0,
    subtitle: `Total: ${overview?.admissions?.total || 0}`,
    color: "bg-amber-500",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
      />
    ),
  },
  {
    title: "Pending Invoices",
    value: overview?.finance?.pendingInvoices || 0,
    subtitle: `Total invoices: ${overview?.finance?.totalInvoices || 0}`,
    color: "bg-rose-500",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    ),
  },
  {
    title: "Fees Paid (Count)",
    value: overview?.finance?.totalPayments || 0,
    subtitle: "Successful payments",
    color: "bg-indigo-500",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    title: "Total Amount Collected",
    value: `₦${Number(overview?.finance?.totalRevenue || 0).toLocaleString()}`,
    subtitle: "All successful payments",
    color: "bg-teal-500",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back. Here’s what’s happening in your school today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {card.value}
                </p>
                <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
              </div>
              <div
                className={`${card.color} p-3 rounded-xl text-white shadow-lg`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {card.icon}
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Current Session */}
      {overview?.currentSession && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Current Academic Session
          </h3>
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-semibold">
              {overview.currentSession.name}
            </div>
            <p className="text-sm text-gray-500">
              {new Date(
                overview.currentSession.startDate
              ).toLocaleDateString()}{" "}
              —{" "}
              {new Date(overview.currentSession.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}