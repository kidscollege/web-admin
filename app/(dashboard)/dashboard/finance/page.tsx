"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function FinancePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "invoices" | "structures" | "reports"
  >("invoices");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [invoices, setInvoices] = useState<any[]>([]);
  const [feeStructures, setFeeStructures] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [reportByTerm, setReportByTerm] = useState<any[]>([]);
  const [reportByClass, setReportByClass] = useState<any[]>([]);

 



  const [terms, setTerms] = useState<any[]>([]);
const [classes, setClasses] = useState<any[]>([]);
const [sessions, setSessions] = useState<any[]>([]);

const [reportFilters, setReportFilters] = useState({
  termId: "",
  classId: "",
  sessionId: "",
});

const [reportResult, setReportResult] = useState<any>(null);
const [reportLoading, setReportLoading] = useState(false);
  // Modals
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showStructureModal, setShowStructureModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [editingStructure, setEditingStructure] = useState<any | null>(null);

  const [invoiceForm, setInvoiceForm] = useState({
    studentId: "",
    dueDate: "",
    items: [{ description: "Tuition Fee", amount: "" }],
  });

  const [structureForm, setStructureForm] = useState({
    name: "",
    description: "",
    amount: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    method: "CASH",
    notes: "",
  });

  const fetchData = async () => {
  try {
    const [invoicesRes, structuresRes, studentsRes, sessionsRes, classesRes] =
      await Promise.all([
        api.get("/finance/invoices"),
        api.get("/finance/fee-structures"),
        api.get("/students"),
        api.get("/academics/sessions"),
        api.get("/academics/classes"),
      ]);

    setInvoices(invoicesRes.data || []);
    setFeeStructures(structuresRes.data || []);
    setStudents(studentsRes.data?.data || []);
    setSessions(sessionsRes.data || []);
    setClasses(classesRes.data || []);

    // Load terms from current session (or first session)
    const sessionList = sessionsRes.data || [];
    const currentSession =
      sessionList.find((s: any) => s.isCurrent) || sessionList[0];

    if (currentSession) {
      const termsRes = await api.get(
        `/academics/sessions/${currentSession.id}/terms`
      );
      setTerms(termsRes.data || []);
    }
  } catch (err: any) {
    if (err.response?.status === 401) {
      removeToken();
      router.push("/login");
    }
  } finally {
    setLoading(false);
  }
};

const handleReportSearch = async () => {
  setReportLoading(true);
  setReportResult(null);

  try {
    const res = await api.get("/finance/reports/summary", {
      params: {
        termId: reportFilters.termId || undefined,
        classId: reportFilters.classId || undefined,
        sessionId: reportFilters.sessionId || undefined,
      },
    });
    setReportResult(res.data);
  } catch (err: any) {
    alert(err.response?.data?.message || "Failed to load report");
  } finally {
    setReportLoading(false);
  }
};

  const fetchReports = async () => {
    try {
      const [byTermRes, byClassRes] = await Promise.all([
        api.get("/finance/reports/by-term"),
        api.get("/finance/reports/by-class"),
      ]);
      setReportByTerm(byTermRes.data || []);
      setReportByClass(byClassRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === "reports") {
      fetchReports();
    }
  }, [activeTab]);

  // ===== FEE STRUCTURE =====
  const openStructureModal = (item?: any) => {
    if (item) {
      setEditingStructure(item);
      setStructureForm({
        name: item.name || "",
        description: item.description || "",
        amount: String(item.amount || ""),
      });
    } else {
      setEditingStructure(null);
      setStructureForm({ name: "", description: "", amount: "" });
    }
    setShowStructureModal(true);
  };

  const handleSaveStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...structureForm,
        amount: Number(structureForm.amount),
      };

      if (editingStructure) {
        await api.patch(
          `/finance/fee-structures/${editingStructure.id}`,
          payload
        );
      } else {
        await api.post("/finance/fee-structures", payload);
      }

      setShowStructureModal(false);
      setEditingStructure(null);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save fee structure");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStructure = async (item: any) => {
    if (!confirm(`Delete fee structure "${item.name}"?`)) return;
    try {
      await api.delete(`/finance/fee-structures/${item.id}`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete fee structure");
    }
  };

  // ===== INVOICE =====
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/finance/invoices", {
        studentId: invoiceForm.studentId,
        dueDate: invoiceForm.dueDate || undefined,
        items: invoiceForm.items.map((item) => ({
          description: item.description,
          amount: item.amount,
        })),
      });
      setShowInvoiceModal(false);
      setInvoiceForm({
        studentId: "",
        dueDate: "",
        items: [{ description: "Tuition Fee", amount: "" }],
      });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create invoice");
    } finally {
      setSubmitting(false);
    }
  };

  // ===== PAYMENT =====
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    setSubmitting(true);
    try {
      await api.post("/finance/payments", {
        invoiceId: selectedInvoice.id,
        amount: Number(paymentForm.amount),
        method: paymentForm.method,
        notes: paymentForm.notes || undefined,
      });
      setShowPaymentModal(false);
      setSelectedInvoice(null);
      setPaymentForm({ amount: "", method: "CASH", notes: "" });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";
      case "PARTIAL":
        return "bg-amber-100 text-amber-700";
      case "PENDING":
        return "bg-blue-100 text-blue-700";
      case "OVERDUE":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const tabs = [
    { key: "invoices", label: "Invoices" },
    { key: "structures", label: "Fee Structures" },
    { key: "reports", label: "Reports" },
  ] as const;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Finance</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage invoices, fee structures and payment reports
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
          Loading...
        </div>
      ) : (
        <>
          {/* ================= INVOICES ================= */}
          {activeTab === "invoices" && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowInvoiceModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  + Create Invoice
                </button>
              </div>

              {/* Desktop */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hidden md:block">
                {invoices.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No invoices found
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left px-6 py-3 font-medium text-gray-600">
                            Invoice No
                          </th>
                          <th className="text-left px-6 py-3 font-medium text-gray-600">
                            Student
                          </th>
                          <th className="text-left px-6 py-3 font-medium text-gray-600">
                            Total
                          </th>
                          <th className="text-left px-6 py-3 font-medium text-gray-600">
                            Paid
                          </th>
                          <th className="text-left px-6 py-3 font-medium text-gray-600">
                            Balance
                          </th>
                          <th className="text-left px-6 py-3 font-medium text-gray-600">
                            Status
                          </th>
                          <th className="text-left px-6 py-3 font-medium text-gray-600">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {invoices.map((invoice) => (
                          <tr key={invoice.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">
                              {invoice.invoiceNumber}
                            </td>
                            <td className="px-6 py-4">
                              {invoice.student
                                ? `${invoice.student.firstName} ${invoice.student.lastName}`
                                : "—"}
                            </td>
                            <td className="px-6 py-4">
                              ₦{Number(invoice.totalAmount).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              ₦{Number(invoice.amountPaid).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              ₦{Number(invoice.balance).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  invoice.status
                                )}`}
                              >
                                {invoice.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {invoice.status !== "PAID" && (
                                <button
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setPaymentForm({
                                      amount: String(invoice.balance),
                                      method: "CASH",
                                      notes: "",
                                    });
                                    setShowPaymentModal(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  Record Payment
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Mobile */}
              <div className="md:hidden space-y-4">
                {invoices.length === 0 ? (
                  <div className="bg-white rounded-xl p-6 text-center text-gray-500">
                    No invoices found
                  </div>
                ) : (
                  invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {invoice.invoiceNumber}
                          </p>
                          <p className="text-sm text-gray-500">
                            {invoice.student
                              ? `${invoice.student.firstName} ${invoice.student.lastName}`
                              : "—"}
                          </p>
                        </div>
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            invoice.status
                          )}`}
                        >
                          {invoice.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1 mb-3">
                        <p>
                          Total: ₦{Number(invoice.totalAmount).toLocaleString()}
                        </p>
                        <p>
                          Paid: ₦{Number(invoice.amountPaid).toLocaleString()}
                        </p>
                        <p>
                          Balance: ₦{Number(invoice.balance).toLocaleString()}
                        </p>
                      </div>
                      {invoice.status !== "PAID" && (
                        <button
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setPaymentForm({
                              amount: String(invoice.balance),
                              method: "CASH",
                              notes: "",
                            });
                            setShowPaymentModal(true);
                          }}
                          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium"
                        >
                          Record Payment
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================= FEE STRUCTURES ================= */}
          {activeTab === "structures" && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => openStructureModal()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  + Add Fee Structure
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {feeStructures.length === 0 ? (
                  <p className="text-gray-500 col-span-full">
                    No fee structures found
                  </p>
                ) : (
                  feeStructures.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
                    >
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {item.description}
                        </p>
                      )}
                      <p className="text-lg font-bold text-blue-600 mt-3 mb-4">
                        ₦{Number(item.amount).toLocaleString()}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openStructureModal(item)}
                          className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStructure(item)}
                          className="flex-1 border border-red-600 text-red-600 py-2 rounded-lg text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================= REPORTS ================= */}
      {activeTab === "reports" && (
  <div className="space-y-6">
    {/* Filters */}
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Session</label>
          <select
            value={reportFilters.sessionId}
            onChange={(e) =>
              setReportFilters({ ...reportFilters, sessionId: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Sessions</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Term</label>
          <select
            value={reportFilters.termId}
            onChange={(e) =>
              setReportFilters({ ...reportFilters, termId: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Terms</option>
            {terms.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Class</label>
          <select
            value={reportFilters.classId}
            onChange={(e) =>
              setReportFilters({ ...reportFilters, classId: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleReportSearch}
            disabled={reportLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {reportLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>
    </div>

    {/* Result */}
    {reportResult ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Fees Paid</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            ₦{Number(reportResult.total || 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Number of Payments</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">
            {reportResult.count || 0}
          </p>
        </div>
      </div>
    ) : (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
        Select filters and click <strong>Search</strong> to view fees paid.
      </div>
    )}

    {/* Helper examples */}
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
      <p className="font-medium mb-1">Examples:</p>
      <ul className="list-disc list-inside space-y-1">
        <li>Select only <strong>First Term</strong> → total fees for that term</li>
        <li>Select only <strong>JSS 1</strong> → total fees for that class</li>
        <li>Select <strong>JSS 1 + First Term</strong> → class total for that term</li>
        <li>Select a <strong>Session</strong> only → full session total</li>
      </ul>
    </div>
  </div>
)}
        </>
      )}

      {/* ===== CREATE INVOICE MODAL ===== */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white">
              <h3 className="text-lg font-semibold">Create Invoice</h3>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="text-gray-400 text-xl"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateInvoice} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student *</label>
                <select
                  required
                  value={invoiceForm.studentId}
                  onChange={(e) =>
                    setInvoiceForm({ ...invoiceForm, studentId: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select student</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.admissionNumber} — {s.firstName} {s.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={(e) =>
                    setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description *
                </label>
                <input
                  required
                  value={invoiceForm.items[0].description}
                  onChange={(e) =>
                    setInvoiceForm({
                      ...invoiceForm,
                      items: [
                        { ...invoiceForm.items[0], description: e.target.value },
                      ],
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Amount (₦) *
                </label>
                <input
                  required
                  type="number"
                  value={invoiceForm.items[0].amount}
                  onChange={(e) =>
                    setInvoiceForm({
                      ...invoiceForm,
                      items: [
                        { ...invoiceForm.items[0], amount: e.target.value },
                      ],
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="flex-1 border border-gray-300 py-2.5 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Create Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== FEE STRUCTURE MODAL ===== */}
      {showStructureModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold">
                {editingStructure ? "Edit Fee Structure" : "Add Fee Structure"}
              </h3>
              <button
                onClick={() => {
                  setShowStructureModal(false);
                  setEditingStructure(null);
                }}
                className="text-gray-400 text-xl"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveStructure} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  required
                  value={structureForm.name}
                  onChange={(e) =>
                    setStructureForm({ ...structureForm, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <input
                  value={structureForm.description}
                  onChange={(e) =>
                    setStructureForm({
                      ...structureForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Amount (₦) *
                </label>
                <input
                  required
                  type="number"
                  value={structureForm.amount}
                  onChange={(e) =>
                    setStructureForm({
                      ...structureForm,
                      amount: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowStructureModal(false);
                    setEditingStructure(null);
                  }}
                  className="flex-1 border border-gray-300 py-2.5 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== RECORD PAYMENT MODAL ===== */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold">Record Payment</h3>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedInvoice(null);
                }}
                className="text-gray-400 text-xl"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleRecordPayment} className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <p>
                  Invoice: <strong>{selectedInvoice.invoiceNumber}</strong>
                </p>
                <p>
                  Balance:{" "}
                  <strong>
                    ₦{Number(selectedInvoice.balance).toLocaleString()}
                  </strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Amount (₦) *
                </label>
                <input
                  required
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, amount: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Payment Method *
                </label>
                <select
                  value={paymentForm.method}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, method: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CASH">Cash</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="PAYSTACK">Paystack</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <input
                  value={paymentForm.notes}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, notes: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedInvoice(null);
                  }}
                  className="flex-1 border border-gray-300 py-2.5 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Record Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}