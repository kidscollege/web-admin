"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function BursaryInvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    studentId: "",
    description: "Tuition",
    amount: "",
    dueDate: "",
  });

  const naira = (n: any) =>
    `₦${Number(n || 0).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
    })}`;

  const fetchInvoices = async () => {
    const res = await api.get("/finance/invoices", {
      params: status ? { status } : undefined,
    });
    const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
    setInvoices(list);
  };

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }

    Promise.all([
      api.get("/finance/invoices", {
        params: status ? { status } : undefined,
      }),
      api.get("/students", { params: { limit: 200 } }),
    ])
      .then(([invRes, stuRes]) => {
        const list = Array.isArray(invRes.data)
          ? invRes.data
          : invRes.data?.data || [];
        const stu = Array.isArray(stuRes.data)
          ? stuRes.data
          : stuRes.data?.data || [];
        setInvoices(list);
        setStudents(stu);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          removeToken();
          router.push("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [status, router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId || !form.amount) {
      alert("Select student and enter amount");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/finance/invoices", {
        studentId: form.studentId,
        description: form.description,
        amount: Number(form.amount),
        dueDate: form.dueDate || undefined,
      });
      alert("Invoice created");
      setShowModal(false);
      setForm({
        studentId: "",
        description: "Tuition",
        amount: "",
        dueDate: "",
      });
      await fetchInvoices();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create invoice");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#17233C]">Invoices</h1>
          <p className="text-sm text-slate-500 mt-1">Student fee invoices</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#17366F] text-white px-4 py-2.5 rounded-lg text-sm"
        >
          + Create invoice
        </button>
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form
            onSubmit={handleCreate}
            className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-md p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Create invoice</h3>
              <button type="button" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <select
              required
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              className="w-full border rounded-lg px-3 py-2.5 text-sm"
            >
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} ({s.admissionNumber})
                </option>
              ))}
            </select>

            <input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Description"
              className="w-full border rounded-lg px-3 py-2.5 text-sm"
            />

            <input
              type="number"
              required
              min="1"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="Amount"
              className="w-full border rounded-lg px-3 py-2.5 text-sm"
            />

            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full border rounded-lg px-3 py-2.5 text-sm"
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#17366F] text-white py-2.5 rounded-lg text-sm disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create invoice"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}