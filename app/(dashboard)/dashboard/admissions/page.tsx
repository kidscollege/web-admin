"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function AdmissionsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
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
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    fetchData();
  }, [statusFilter]);

  const handleReview = async (status: string) => {
    if (!selectedApp) return;
    setSubmitting(true);
    try {
      await api.patch(`/admissions/applications/${selectedApp.id}/review`, {
        status,
      });
      setShowModal(false);
      setSelectedApp(null);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update application");
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

    const parentAccount = res.data?.parentAccount;

    if (parentAccount?.created && parentAccount?.temporaryPassword) {
      alert(
        `Student admitted successfully.\n\nParent login created:\nEmail: ${parentAccount.email}\nTemporary Password: ${parentAccount.temporaryPassword}\n\nPlease copy and share this with the parent.`
      );
    } else if (parentAccount?.email) {
      alert(
        `Student admitted successfully.\n\nParent already exists:\nEmail: ${parentAccount.email}`
      );
    } else {
      alert("Student admitted successfully.");
    }

    setShowModal(false);
    setSelectedApp(null);
    fetchData();
  } catch (err: any) {
    alert(err.response?.data?.message || "Failed to admit applicant");
  } finally {
    setSubmitting(false);
  }
};

  const getStatusColor = (status: string) => {
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
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Admissions</h2>
        <p className="text-sm text-gray-500 mt-1">
          Review and manage admission applications
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: "Total", value: stats.total },
            { label: "Submitted", value: stats.submitted },
            { label: "Under Review", value: stats.underReview },
            { label: "Approved", value: stats.approved },
            { label: "Admitted", value: stats.admitted },
            { label: "Rejected", value: stats.rejected },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm"
            >
              <p className="text-2xl font-bold text-gray-800">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[
          { value: "", label: "All" },
          { value: "SUBMITTED", label: "Submitted" },
          { value: "UNDER_REVIEW", label: "Under Review" },
          { value: "APPROVED", label: "Approved" },
          { value: "ADMITTED", label: "Admitted" },
          { value: "REJECTED", label: "Rejected" },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              statusFilter === filter.value
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
          Loading applications...
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hidden md:block">
            {applications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No applications found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-3 font-medium text-gray-600">App No</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-600">Applicant</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-600">Class</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-600">Parent</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-600">Status</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{app.applicationNo}</td>
                        <td className="px-6 py-4">
                          {app.firstName} {app.lastName}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {app.applyingClass || "—"}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {app.parentName || "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              app.status
                            )}`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {applications.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center text-gray-500">
                No applications found
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {app.firstName} {app.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{app.applicationNo}</p>
                    </div>
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1 mb-3">
                    <p>Class: {app.applyingClass || "—"}</p>
                    <p>Parent: {app.parentName || "—"}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedApp(app);
                      setShowModal(true);
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium"
                  >
                    View Application
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* View / Review Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white">
              <h3 className="text-lg font-semibold">Application Details</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedApp(null);
                }}
                className="text-gray-400 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Application No</p>
                  <p className="font-medium">{selectedApp.applicationNo}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      selectedApp.status
                    )}`}
                  >
                    {selectedApp.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500">Full Name</p>
                  <p className="font-medium">
                    {selectedApp.firstName} {selectedApp.middleName}{" "}
                    {selectedApp.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Gender</p>
                  <p className="font-medium">{selectedApp.gender || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date of Birth</p>
                  <p className="font-medium">
                    {selectedApp.dateOfBirth
                      ? new Date(selectedApp.dateOfBirth).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Applying Class</p>
                  <p className="font-medium">{selectedApp.applyingClass || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Parent Name</p>
                  <p className="font-medium">{selectedApp.parentName || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Parent Phone</p>
                  <p className="font-medium">{selectedApp.parentPhone || "—"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Parent Email</p>
                  <p className="font-medium">{selectedApp.parentEmail || "—"}</p>
                </div>
                {selectedApp.notes && (
                  <div className="col-span-2">
                    <p className="text-gray-500">Notes</p>
                    <p className="font-medium">{selectedApp.notes}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {selectedApp.status !== "ADMITTED" &&
                selectedApp.status !== "REJECTED" && (
                  <div className="border-t pt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">Actions</p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedApp.status === "SUBMITTED" && (
                        <button
                          onClick={() => handleReview("UNDER_REVIEW")}
                          disabled={submitting}
                          className="bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                          Mark Under Review
                        </button>
                      )}
                      {(selectedApp.status === "SUBMITTED" ||
                        selectedApp.status === "UNDER_REVIEW") && (
                        <>
                          <button
                            onClick={() => handleReview("APPROVED")}
                            disabled={submitting}
                            className="bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReview("REJECTED")}
                            disabled={submitting}
                            className="bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {selectedApp.status === "APPROVED" && (
                        <button
                          onClick={handleAdmit}
                          disabled={submitting}
                          className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                          {submitting ? "Admitting..." : "Admit Student"}
                        </button>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
            {/* Help Guide for Admin */}
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-blue-900 mb-3">
          How Admission Actions Work
        </h3>
        <p className="text-sm text-blue-800 mb-3">
          Click <strong>View</strong> on an application to open details and take action.
          Available buttons depend on the current status:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-blue-900">
                <th className="py-2 pr-4 font-semibold">Status</th>
                <th className="py-2 font-semibold">Available Buttons</th>
              </tr>
            </thead>
            <tbody className="text-blue-800">
              <tr className="border-t border-blue-100">
                <td className="py-2 pr-4 font-medium">SUBMITTED</td>
                <td className="py-2">Mark Under Review, Approve, Reject</td>
              </tr>
              <tr className="border-t border-blue-100">
                <td className="py-2 pr-4 font-medium">UNDER_REVIEW</td>
                <td className="py-2">Approve, Reject</td>
              </tr>
              <tr className="border-t border-blue-100">
                <td className="py-2 pr-4 font-medium">APPROVED</td>
                <td className="py-2">Admit Student</td>
              </tr>
              <tr className="border-t border-blue-100">
                <td className="py-2 pr-4 font-medium">ADMITTED / REJECTED</td>
                <td className="py-2">No buttons</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}