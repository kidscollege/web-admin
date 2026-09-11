"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function BursaryInvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const fetchInvoices = async () => {
    try {
      const res = await api.get("/finance/invoices", {
        params: status ? { status } : undefined,
      });
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setInvoices(list);
    } catch (err: any) {
      if (err.response?.status === 401) {
        removeToken();
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    fetchInvoices();
  }, [status]);

  const naira = (n: any) =>
    `₦${Number(n || 0).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
    })}`;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#17233C]">Invoices</h1>
        <p className="text-sm text-slate-500 mt-1">Student fee invoices</p>
      </div>

      <select
        value={status}
        onChange={(e) => {
          setLoading(true);
          setStatus(e.target.value);
        }}
        className="border rounded-lg px-3 py-2 text-sm"
      >
        <option value="">All statuses</option>
        <option value="PENDING">Pending</option>
        <option value="PARTIAL">Partial</option>
        <option value="PAID">Paid</option>
        <option value="OVERDUE">Overdue</option>
      </select>

      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <p className="p-6 text-slate-500">Loading invoices...</p>
        ) : invoices.length === 0 ? (
          <p className="p-6 text-slate-500">No invoices found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3">Invoice</th>
                  <th className="text-left px-4 py-3">Student</th>
                  <th className="text-left px-4 py-3">Total</th>
                  <th className="text-left px-4 py-3">Paid</th>
                  <th className="text-left px-4 py-3">Balance</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b">
                    <td className="px-4 py-3">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3">
                      {inv.student
                        ? `${inv.student.firstName} ${inv.student.lastName}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">{naira(inv.totalAmount)}</td>
                    <td className="px-4 py-3">{naira(inv.amountPaid)}</td>
                    <td className="px-4 py-3">{naira(inv.balance)}</td>
                    <td className="px-4 py-3">{inv.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}