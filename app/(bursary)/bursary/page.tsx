"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function BursaryDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/finance/invoices")
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
        setInvoices(list);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          removeToken();
          router.push("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const pending = invoices.filter(
    (i) => i.status === "PENDING" || i.status === "PARTIAL" || i.status === "OVERDUE"
  );
  const paid = invoices.filter((i) => i.status === "PAID");
  const collected = invoices.reduce(
    (sum, i) => sum + Number(i.amountPaid || 0),
    0
  );
  const outstanding = invoices.reduce(
    (sum, i) => sum + Number(i.balance || 0),
    0
  );

  const naira = (n: number) =>
    `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;

  if (loading) {
    return <p className="text-slate-500">Loading bursary dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#17233C]">Bursary Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Fees, invoices, and payments
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-slate-500">Pending invoices</p>
          <p className="text-2xl font-bold mt-1">{pending.length}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-slate-500">Paid invoices</p>
          <p className="text-2xl font-bold mt-1">{paid.length}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-slate-500">Amount collected</p>
          <p className="text-2xl font-bold mt-1">{naira(collected)}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-slate-500">Outstanding</p>
          <p className="text-2xl font-bold mt-1">{naira(outstanding)}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/bursary/invoices"
          className="bg-[#17366F] text-white px-4 py-2.5 rounded-lg text-sm text-center"
        >
          View invoices
        </Link>
        <Link
          href="/bursary/payments"
          className="border px-4 py-2.5 rounded-lg text-sm text-center"
        >
          Record payment
        </Link>
      </div>
    </div>
  );
}