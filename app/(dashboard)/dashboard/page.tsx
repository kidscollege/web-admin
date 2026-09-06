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
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="rounded-xl border border-[#E5EAF1] bg-white px-6 py-4 text-sm text-[#738096] shadow-sm">Loading dashboard...</div>
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
    <div className="mx-auto max-w-[1600px]">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#B07D1F]">Good morning</p>
          <h2 className="text-3xl font-bold tracking-tight text-[#17233C]">School overview</h2>
          <p className="mt-2 text-sm text-[#738096]">A clear view of the people, progress, and priorities across Kids College.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#17366F] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#102B5E]">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" /></svg>
          Quick action
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="group rounded-xl border border-[#E5EAF1] bg-white p-5 shadow-[0_4px_18px_rgba(23,35,60,0.035)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(23,35,60,0.08)]"
          >
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium text-[#738096]">
                  {card.title}
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-[#17233C]">
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-[#9AA5B5]">{card.subtitle}</p>
              </div>
              <div
                className={`${card.color} rounded-xl p-3 text-white shadow-lg shadow-current/10`}
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

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        {overview?.currentSession && (
          <div className="relative overflow-hidden rounded-xl border border-[#DCE6F4] bg-[#17366F] p-6 text-white shadow-[0_12px_30px_rgba(23,54,111,0.12)]">
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#DDB45D]">Academic rhythm</p>
              <h3 className="mt-3 text-xl font-bold">Current academic session</h3>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <div className="rounded-lg bg-white/10 px-4 py-2 font-semibold ring-1 ring-white/15">{overview.currentSession.name}</div>
                <p className="text-sm text-blue-100">{new Date(overview.currentSession.startDate).toLocaleDateString()} — {new Date(overview.currentSession.endDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border-[22px] border-[#DDB45D]/20" />
            <div className="absolute -bottom-20 right-20 h-48 w-48 rounded-full border-[18px] border-white/10" />
          </div>
        )}
        <div className="rounded-xl border border-[#E5EAF1] bg-white p-6 shadow-[0_4px_18px_rgba(23,35,60,0.035)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#A3ADBD]">At a glance</p>
              <h3 className="mt-2 text-lg font-bold text-[#17233C]">Today at Kids College</h3>
            </div>
            <span className="rounded-full bg-[#FFF7E8] px-2.5 py-1 text-xs font-semibold text-[#A36B12]">Live</span>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="border-l-2 border-[#2D7C66] pl-3"><p className="text-2xl font-bold text-[#17233C]">{overview?.students?.active || 0}</p><p className="mt-1 text-xs text-[#8994A7]">Active learners</p></div>
            <div className="border-l-2 border-[#C9952E] pl-3"><p className="text-2xl font-bold text-[#17233C]">{overview?.admissions?.pending || 0}</p><p className="mt-1 text-xs text-[#8994A7]">Applications pending</p></div>
          </div>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#EEF1F5]"><div className="h-full w-[72%] rounded-full bg-[#C9952E]" /></div>
          <p className="mt-2 text-xs text-[#8994A7]">Keep the school day moving with a quick review of priorities.</p>
        </div>
      </div>
    </div>
  );
}