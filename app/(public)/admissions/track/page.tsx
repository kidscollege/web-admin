"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function TrackApplicationPage() {
  const [applicationNo, setApplicationNo] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await api.get("/admissions/track", {
        params: {
          applicationNo: applicationNo.trim(),
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
        },
      });
      setResult(res.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Unable to find application. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-blue-100 text-blue-700";
      case "UNDER_REVIEW":
        return "bg-amber-100 text-amber-700";
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "ADMITTED":
        return "bg-emerald-100 text-emerald-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      <section className="bg-white border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <Link
            href="/admissions"
            className="text-sm text-[#7C3AED] hover:underline"
          >
            ← Back to Admissions
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2E1A5A] mt-3">
            Track Application
          </h1>
          <p className="text-slate-500 mt-2 max-w-2xl">
            Enter your application number and parent phone or email to check
            your admission status.
          </p>
        </div>
      </section>

      <section className="max-w-xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-[2rem] border border-purple-100 p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Application Number *
              </label>
              <input
                required
                value={applicationNo}
                onChange={(e) => setApplicationNo(e.target.value)}
                placeholder="e.g. APP260001"
                className="w-full border border-purple-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Parent Phone
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone used during application"
                className="w-full border border-purple-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Parent Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email used during application"
                className="w-full border border-purple-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <p className="text-xs text-slate-500">
              Provide at least phone or email.
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-3 rounded-full text-sm font-semibold transition disabled:opacity-50"
            >
              {loading ? "Checking..." : "Track Application"}
            </button>
          </form>

          {result && (
            <div className="mt-6 border-t border-purple-100 pt-6 space-y-3">
              <h2 className="font-bold text-lg text-[#2E1A5A]">
                Application Details
              </h2>

              <div className="text-sm space-y-2">
                <p>
                  <span className="text-slate-500">Application No:</span>{" "}
                  <strong>{result.applicationNo}</strong>
                </p>
                <p>
                  <span className="text-slate-500">Applicant:</span>{" "}
                  <strong>
                    {result.firstName} {result.middleName || ""} {result.lastName}
                  </strong>
                </p>
                <p>
                  <span className="text-slate-500">Class:</span>{" "}
                  <strong>{result.applyingClass || "—"}</strong>
                </p>
                <p>
                  <span className="text-slate-500">Parent:</span>{" "}
                  <strong>{result.parentName || "—"}</strong>
                </p>
                <p>
                  <span className="text-slate-500">Submitted:</span>{" "}
                  <strong>
                    {result.createdAt
                      ? new Date(result.createdAt).toLocaleDateString()
                      : "—"}
                  </strong>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-slate-500">Status:</span>
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(
                      result.status
                    )}`}
                  >
                    {result.status}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}