"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function PrincipalAdmissionsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [appsRes, statsRes] = await Promise.all([
        api.get("/admissions/applications", {
          params: statusFilter ? { status: statusFilter } : undefined,
        }),
        api.get("/admissions/stats"),
      ]);
      setApplications(appsRes.data || []);
      setStats(statsRes.data || null);
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
    fetchData();
  }, [statusFilter]);

  const handleReview = async (status: "UNDER_REVIEW" | "APPROVED" | "REJECTED") => {
    if (!selectedApp) return;
    setSubmitting(true);
    try {
      await api.patch(`/admissions/applications/${selectedApp.id}/review`, {
        status,
      });
      alert(`Application ${status.replace("_", " ").toLowerCase()}`);
      setSelectedApp(null);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Review failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdmit = async () => {
    if (!selectedApp) return;
    setSubmitting(true);
    try {
      const res = await api.post(
        `/admissions/applications/${selectedApp.id}/admit`
      );
      const login = res.data?.parentAccount;
      if (login?.temporaryPassword) {
        alert(
          `Student admitted.\n\nParent email: ${login.email}\nTemporary password: ${login.temporaryPassword}`
        );
      } else {
        alert("Student admitted");
      }
      setSelectedApp(null);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Admit failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[#2E1A5A]">Admissions</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review applications and admit students
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            ["Submitted", stats.submitted],
            ["Under review", stats.underReview],
            ["Approved", stats.approved],
            ["Admitted", stats.admitted],
          ].map(([label, value]) => (
            <div
              key={label as string}
              className="bg-white rounded-2xl border border-purple-100 p-4"
            >
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-xl font-bold">{value || 0}</p>
            </div>
          ))}
        </div>
      )}

      <select
        value={statusFilter}
        onChange={(e) => {
          setLoading(true);
          setStatusFilter(e.target.value);
        }}
        className="border border-purple-200 rounded-xl px-3 py-2.5 text-sm"
      >
        <option value="">All statuses</option>
        <option value="SUBMITTED">Submitted</option>
        <option value="UNDER_REVIEW">Under review</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
        <option value="ADMITTED">Admitted</option>
      </select>

      <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden">
        {loading ? (
          <p className="p-6 text-slate-500">Loading applications...</p>
        ) : applications.length === 0 ? (
          <p className="p-6 text-slate-500">No applications found.</p>
        ) : (
          <div className="divide-y">
            {applications.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className="w-full text-left px-4 py-4 hover:bg-purple-50"
              >
                <p className="font-semibold">
                  {app.firstName} {app.lastName}
                </p>
                <p className="text-xs text-slate-500">
                  {app.applicationNo} · {app.applyingClass || "No class"} ·{" "}
                  {app.status}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg p-5 space-y-4">
            <div className="flex justify-between">
              <h3 className="font-semibold text-[#2E1A5A]">
                {selectedApp.applicationNo}
              </h3>
              <button onClick={() => setSelectedApp(null)}>✕</button>
            </div>

            <p>
              {selectedApp.firstName} {selectedApp.lastName}
            </p>
            <p className="text-sm text-slate-500">
              Class: {selectedApp.applyingClass || "—"}
            </p>
            <p className="text-sm text-slate-500">
              Parent: {selectedApp.parentName} · {selectedApp.parentPhone}
            </p>
            <p className="text-sm">Status: {selectedApp.status}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedApp.status === "SUBMITTED" && (
                <button
                  disabled={submitting}
                  onClick={() => handleReview("UNDER_REVIEW")}
                  className="bg-amber-500 text-white py-2.5 rounded-xl text-sm"
                >
                  Mark under review
                </button>
              )}

              {(selectedApp.status === "SUBMITTED" ||
                selectedApp.status === "UNDER_REVIEW") && (
                <>
                  <button
                    disabled={submitting}
                    onClick={() => handleReview("APPROVED")}
                    className="bg-green-600 text-white py-2.5 rounded-xl text-sm"
                  >
                    Approve
                  </button>
                  <button
                    disabled={submitting}
                    onClick={() => handleReview("REJECTED")}
                    className="bg-red-500 text-white py-2.5 rounded-xl text-sm"
                  >
                    Reject
                  </button>
                </>
              )}

              {selectedApp.status === "APPROVED" && (
                <button
                  disabled={submitting}
                  onClick={handleAdmit}
                  className="col-span-1 sm:col-span-2 bg-[#7C3AED] text-white py-2.5 rounded-xl text-sm"
                >
                  {submitting ? "Admitting..." : "Admit student"}
                </button>
              )}
            </div>

            <div className="text-xs text-slate-500 border-t pt-3">
              SUBMITTED → Under review / Approve / Reject<br />
              UNDER_REVIEW → Approve / Reject<br />
              APPROVED → Admit student
            </div>
          </div>
        </div>
      )}
    </div>
  );
}