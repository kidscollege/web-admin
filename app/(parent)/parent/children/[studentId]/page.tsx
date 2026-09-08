"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function ParentChildDetailsPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const router = useRouter();

  const [attendance, setAttendance] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"attendance" | "results" | "fees">("attendance");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    Promise.all([
      api.get(`/parent/children/${studentId}/attendance`),
      api.get(`/parent/children/${studentId}/results`),
      api.get(`/parent/children/${studentId}/invoices`),
    ])
      .then(([a, r, i]) => {
        setAttendance(a.data || []);
        setResults(r.data || []);
        setInvoices(i.data || []);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          removeToken();
          router.push("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [studentId, router]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-slate-500">
        Loading child details...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <Link href="/parent/children" className="text-sm text-[#7C3AED] hover:underline">
          ← Back to children
        </Link>
        <h1 className="text-2xl font-extrabold text-[#2E1A5A] mt-2">
          Child Details
        </h1>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {[
          { key: "attendance", label: "Attendance" },
          { key: "results", label: "Results" },
          { key: "fees", label: "Fees" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              tab === item.key
                ? "bg-[#7C3AED] text-white"
                : "bg-white border border-purple-100 text-slate-600"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "attendance" && (
        <div className="bg-white rounded-2xl border border-purple-100 p-5">
          {attendance.length === 0 ? (
            <p className="text-slate-500 text-sm">No attendance records yet.</p>
          ) : (
            <div className="space-y-2">
              {attendance.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center justify-between border-b border-purple-50 py-2 text-sm"
                >
                  <span>{new Date(row.date).toLocaleDateString()}</span>
                  <span className="font-medium">{row.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "results" && (
        <div className="bg-white rounded-2xl border border-purple-100 p-5">
          {results.length === 0 ? (
            <p className="text-slate-500 text-sm">No results yet.</p>
          ) : (
            <div className="space-y-2">
              {results.map((row) => (
                <div
                  key={row.id}
                  className="border-b border-purple-50 py-2 text-sm"
                >
                  <p className="font-medium">
                    {row.assessment?.subject?.name || "Subject"} ·{" "}
                    {row.assessment?.name}
                  </p>
                  <p className="text-slate-500">
                    Score: {row.score ?? "—"} / {row.assessment?.maxScore ?? "—"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "fees" && (
        <div className="bg-white rounded-2xl border border-purple-100 p-5">
          {invoices.length === 0 ? (
            <p className="text-slate-500 text-sm">No invoices yet.</p>
          ) : (
            <div className="space-y-3">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="border border-purple-50 rounded-xl p-3 text-sm"
                >
                  <p className="font-medium">{inv.invoiceNumber}</p>
                  <p>Total: ₦{Number(inv.totalAmount).toLocaleString()}</p>
                  <p>Paid: ₦{Number(inv.amountPaid).toLocaleString()}</p>
                  <p>Balance: ₦{Number(inv.balance).toLocaleString()}</p>
                  <p>Status: {inv.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}