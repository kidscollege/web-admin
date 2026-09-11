"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function HrStaffPage() {
  const router = useRouter();
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    designation: "Teacher",
    createLogin: true,
    role: "TEACHER",
  });

  const fetchStaff = async () => {
    const res = await api.get("/hr/staff");
    setStaffList(Array.isArray(res.data) ? res.data : res.data?.data || []);
  };

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    fetchStaff()
      .catch((err) => {
        if (err.response?.status === 401) {
          removeToken();
          router.push("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post("/hr/staff", form);
      const login = res.data?.login;
      if (login?.temporaryPassword) {
        alert(
          `Staff created.\nEmail: ${login.email}\nPassword: ${login.temporaryPassword}`
        );
      } else {
        alert("Staff created");
      }
      setShowModal(false);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        designation: "Teacher",
        createLogin: true,
        role: "TEACHER",
      });
      await fetchStaff();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create staff");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2E1A5A]">Staff</h1>
          <p className="text-sm text-slate-500 mt-1">Create and manage staff</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#7C3AED] text-white px-5 py-2.5 rounded-full text-sm"
        >
          + Add staff
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden">
        {loading ? (
          <p className="p-6 text-slate-500">Loading...</p>
        ) : staffList.length === 0 ? (
          <p className="p-6 text-slate-500">No staff found.</p>
        ) : (
          <div className="divide-y">
            {staffList.map((s) => (
              <div key={s.id} className="px-4 py-3">
                <p className="font-semibold">
                  {s.firstName} {s.lastName}
                </p>
                <p className="text-xs text-slate-500">
                  {s.staffNumber} · {s.designation || "—"} · {s.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form
            onSubmit={handleCreate}
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-5 space-y-3"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold">Add staff</h3>
              <button type="button" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <input required placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full border rounded-xl px-3 py-2.5 text-sm" />
            <input required placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full border rounded-xl px-3 py-2.5 text-sm" />
            <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border rounded-xl px-3 py-2.5 text-sm" />
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border rounded-xl px-3 py-2.5 text-sm" />
            <select value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className="w-full border rounded-xl px-3 py-2.5 text-sm">
              <option>Teacher</option>
              <option>Bursar</option>
              <option>Principal</option>
              <option>HR</option>
              <option>Admin</option>
            </select>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full border rounded-xl px-3 py-2.5 text-sm">
              <option value="TEACHER">TEACHER</option>
              <option value="BURSAR">BURSAR</option>
              <option value="PRINCIPAL">PRINCIPAL</option>
              <option value="HR_ADMIN">HR_ADMIN</option>
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.createLogin} onChange={(e) => setForm({ ...form, createLogin: e.target.checked })} />
              Create login account
            </label>
            <button disabled={submitting} className="w-full bg-[#7C3AED] text-white py-2.5 rounded-full text-sm">
              {submitting ? "Saving..." : "Save staff"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}