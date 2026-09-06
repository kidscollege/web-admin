"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function AttendancePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"mark" | "student" | "class">("mark");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [terms, setTerms] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  // Mark attendance form
  const [markForm, setMarkForm] = useState({
    studentId: "",
    termId: "",
    date: new Date().toISOString().split("T")[0],
    status: "PRESENT",
    remark: "",
  });

  // Student attendance view
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [studentAttendance, setStudentAttendance] = useState<any>(null);

  // Class attendance view
  const [classForm, setClassForm] = useState({
    classId: "",
    termId: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [classAttendance, setClassAttendance] = useState<any>(null);

  const fetchInitialData = async () => {
    try {
      const [sessionsRes, studentsRes, classesRes] = await Promise.all([
        api.get("/academics/sessions"),
        api.get("/students"),
        api.get("/academics/classes"),
      ]);

      setStudents(studentsRes.data?.data || []);
      setClasses(classesRes.data || []);

      const currentSession = (sessionsRes.data || []).find((s: any) => s.isCurrent);
      if (currentSession?.terms) {
        setTerms(currentSession.terms);
        const currentTerm = currentSession.terms.find((t: any) => t.isCurrent);
        if (currentTerm) {
          setMarkForm((prev) => ({ ...prev, termId: currentTerm.id }));
          setClassForm((prev) => ({ ...prev, termId: currentTerm.id }));
        }
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        removeToken();
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentAttendance = async () => {
    if (!selectedStudentId) {
      alert("Please select a student");
      return;
    }
    try {
      const response = await api.get(`/attendance/students/${selectedStudentId}`);
      setStudentAttendance(response.data);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to load student attendance");
    }
  };

  const fetchClassAttendance = async () => {
    if (!classForm.classId || !classForm.termId || !classForm.date) {
      alert("Please select class, term and date");
      return;
    }
    try {
      const response = await api.get(
        `/attendance/classes/${classForm.classId}?termId=${classForm.termId}&date=${classForm.date}`
      );
      setClassAttendance(response.data);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to load class attendance");
    }
  };

  const handleMarkAttendance = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/attendance", markForm);
      alert("Attendance marked successfully");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to mark attendance");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    fetchInitialData();
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PRESENT":
        return "bg-green-100 text-green-700";
      case "ABSENT":
        return "bg-red-100 text-red-700";
      case "LATE":
        return "bg-amber-100 text-amber-700";
      case "EXCUSED":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const tabs = [
    { key: "mark", label: "Mark Attendance" },
    { key: "student", label: "Student Report" },
    { key: "class", label: "Class Report" },
  ] as const;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Attendance</h2>
        <p className="text-sm text-gray-500 mt-1">
          Mark and view student attendance
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
          {/* ================= MARK ATTENDANCE ================= */}
          {activeTab === "mark" && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm max-w-xl">
              <h3 className="font-semibold text-gray-800 mb-4">Mark Attendance</h3>
              <form onSubmit={handleMarkAttendance} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Student *</label>
                  <select
                    required
                    value={markForm.studentId}
                    onChange={(e) =>
                      setMarkForm({ ...markForm, studentId: e.target.value })
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
                  <label className="block text-sm font-medium mb-1">Term *</label>
                  <select
                    required
                    value={markForm.termId}
                    onChange={(e) =>
                      setMarkForm({ ...markForm, termId: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select term</option>
                    {terms.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={markForm.date}
                    onChange={(e) =>
                      setMarkForm({ ...markForm, date: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status *</label>
                  <select
                    value={markForm.status}
                    onChange={(e) =>
                      setMarkForm({ ...markForm, status: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PRESENT">Present</option>
                    <option value="ABSENT">Absent</option>
                    <option value="LATE">Late</option>
                    <option value="EXCUSED">Excused</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Remark</label>
                  <input
                    value={markForm.remark}
                    onChange={(e) =>
                      setMarkForm({ ...markForm, remark: e.target.value })
                    }
                    placeholder="Optional note"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Mark Attendance"}
                </button>
              </form>
            </div>
          )}

          {/* ================= STUDENT REPORT ================= */}
          {activeTab === "student" && (
            <div className="space-y-6">
              {/* Filter Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.admissionNumber} — {s.firstName} {s.lastName}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={fetchStudentAttendance}
                    disabled={!selectedStudentId}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 whitespace-nowrap"
                  >
                    Load Report
                  </button>
                </div>
              </div>

              {studentAttendance && (
                <div className="space-y-4">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {[
                      { label: "Present", value: studentAttendance.summary?.present, color: "text-green-600" },
                      { label: "Absent", value: studentAttendance.summary?.absent, color: "text-red-600" },
                      { label: "Late", value: studentAttendance.summary?.late, color: "text-amber-600" },
                      { label: "Excused", value: studentAttendance.summary?.excused, color: "text-blue-600" },
                      { label: "Total", value: studentAttendance.summary?.total, color: "text-gray-800" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm"
                      >
                        <p className={`text-2xl font-bold ${item.color}`}>
                          {item.value ?? 0}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Records Card */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b bg-gray-50">
                      <p className="font-medium text-gray-800">
                        {studentAttendance.student?.firstName}{" "}
                        {studentAttendance.student?.lastName} (
                        {studentAttendance.student?.admissionNumber})
                      </p>
                    </div>

                    {studentAttendance.records?.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">
                        No attendance records found
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {studentAttendance.records?.map((record: any) => (
                          <div
                            key={record.id}
                            className="px-5 py-3 flex justify-between items-center text-sm"
                          >
                            <div>
                              <p className="font-medium text-gray-800">
                                {new Date(record.date).toLocaleDateString()}
                              </p>
                              {record.remark && (
                                <p className="text-gray-500 text-xs mt-0.5">
                                  {record.remark}
                                </p>
                              )}
                            </div>
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                record.status
                              )}`}
                            >
                              {record.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= CLASS REPORT ================= */}
          {activeTab === "class" && (
            <div className="space-y-6">
              {/* Filter Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <select
                    value={classForm.classId}
                    onChange={(e) =>
                      setClassForm({ ...classForm, classId: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select class</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={classForm.termId}
                    onChange={(e) =>
                      setClassForm({ ...classForm, termId: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select term</option>
                    {terms.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="date"
                    value={classForm.date}
                    onChange={(e) =>
                      setClassForm({ ...classForm, date: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={fetchClassAttendance}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
                >
                  Load Class Attendance
                </button>
              </div>

              {classAttendance && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-3 border-b bg-gray-50">
                    <p className="font-medium text-gray-800">
                      Class Attendance — {classAttendance.date}
                    </p>
                  </div>

                  {classAttendance.attendance?.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      No students found for this class
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {classAttendance.attendance?.map((item: any, index: number) => (
                        <div
                          key={item.student?.id || index}
                          className="px-5 py-3 flex justify-between items-center text-sm"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {item.student?.firstName} {item.student?.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.student?.admissionNumber}
                            </p>
                          </div>
                          {item.status ? (
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">Not marked</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}