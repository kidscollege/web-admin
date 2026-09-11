"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function BursaryPaymentsPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    invoiceId: "",
    amount: "",
    method: "CASH",
    notes: "",
  });

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }

    api
      .get("/finance/invoices")
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
        setInvoices(
          list.filter((i: any) => i.status !== "PAID" && i.status !== "CANCELLED")
        );
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          removeToken();
          router.push("/login");
        }
      });
  }, [router]);

  const selected = invoices.find((i) => i.id === form.invoiceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.invoiceId || !form.amount) {
      alert("Select an invoice and enter amount");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/finance/payments", {
        invoiceId: form.invoiceId,
        amount: Number(form.amount),
        method: form.method,
        notes: form.notes || undefined,
      });
      alert("Payment recorded successfully");
      setForm({ invoiceId: "", amount: "", method: "CASH", notes: "" });
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#17233C]">Record Payment</h1>
        <p className="text-sm text-slate-500 mt-1">
          Apply a payment to a student invoice
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border p-5 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Invoice</label>
          <select
            value={form.invoiceId}
            onChange={(e) => setForm({ ...form, invoiceId: e.target.value })}
            className="w-full border rounded-lg px-3 py-2.5 text-sm"
            required
          >
            <option value="">Select invoice</option>
            {invoices.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.invoiceNumber} — {inv.student?.firstName}{" "}
                {inv.student?.lastName} (Bal ₦{Number(inv.balance || 0)})
              </option>
            ))}
          </select>
        </div>

        {selected && (
          <p className="text-sm text-slate-500">
            Balance: ₦{Number(selected.balance || 0).toLocaleString()}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            min="1"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full border rounded-lg px-3 py-2.5 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Method</label>
          <select
            value={form.method}
            onChange={(e) => setForm({ ...form, method: e.target.value })}
            className="w-full border rounded-lg px-3 py-2.5 text-sm"
          >
            <option value="CASH">Cash</option>
            <option value="BANK_TRANSFER">Bank transfer</option>
            <option value="PAYSTACK">Paystack</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <input
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full border rounded-lg px-3 py-2.5 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#17366F] text-white py-2.5 rounded-lg text-sm disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save payment"}
        </button>
      </form>
    </div>
  );
}