"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function TeacherAttendancePage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [terms, setTerms] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [termId, setTermId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState<Record<string, string>>({});

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    Promise.all([
      api.get("/teacher/assignments"),
      api.get('/teacher/terms'), // if protected for teachers, we’ll adjust
    ])
      .then(([a, t]) => {
        setAssignments(a.data || []);
        setTerms(t.data || []);
      })
      .catch((err) => {
        // fallback if terms endpoint is admin-only
        if (err.response?.status === 401) {
          removeToken();
          router.push("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const loadStudents = async (assignmentId: string) => {
    setSelectedAssignment(assignmentId);
    setStudents([]);
    setRecords({});

    const item = assignments.find((a) => a.id === assignmentId);
    if (!item) return;

    try {
      const res = await api.get(`/teacher/classes/${item.classId}/students`, {
        params: item.sectionId ? { sectionId: item.sectionId } : undefined,
      });
      const list = res.data || [];
      setStudents(list);

      const initial: Record<string, string> = {};
      list.forEach((s: any) => {
        initial[s.id] = "PRESENT";
      });
      setRecords(initial);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to load students");
    }
  };

  const handleSave = async () => {
    const item = assignments.find((a) => a.id === selectedAssignment);
    if (!item) {
      alert("Select a class assignment");
      return;
    }
    if (!termId) {
      alert("Select a term");
      return;
    }
    if (!date) {
      alert("Select a date");
      return;
    }

    setSaving(true);
    try {
      await api.post("/teacher/attendance", {
        classId: item.classId,
        sectionId: item.sectionId || undefined,
        termId,
        date,
        records: students.map((s) => ({
          studentId: s.id,
          status: records[s.id] || "PRESENT",
        })),
      });
      alert("Attendance saved successfully");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-slate-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#2E1A5A]">Mark Attendance</h1>
        <p className="text-sm text-slate-500 mt-1">
          Select your class, term, and date
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Class / Subject</label>
          <select
            value={selectedAssignment}
            onChange={(e) => loadStudents(e.target.value)}
            className="w-full border border-purple-200 rounded-xl px-3 py-2.5 text-sm"
          >
            <option value="">Select assignment</option>
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {(a.class?.name || a.className || "Class") +
                  (a.section?.name || a.sectionName
                    ? ` ${a.section?.name || a.sectionName}`
                    : "") +
                  " - " +
                  (a.subject?.name || a.subjectName || "Subject")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Term</label>
          <select
            value={termId}
            onChange={(e) => setTermId(e.target.value)}
            className="w-full border border-purple-200 rounded-xl px-3 py-2.5 text-sm"
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
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-purple-200 rounded-xl px-3 py-2.5 text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm">
        {!selectedAssignment ? (
          <p className="text-slate-500 text-sm">Select a class to load students.</p>
        ) : students.length === 0 ? (
          <p className="text-slate-500 text-sm">No students found in this class.</p>
        ) : (
          <div className="space-y-3">
            {students.map((s) => (
              <div
                key={s.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-purple-50 py-3"
              >
                <div>
                  <p className="font-medium text-[#2E1A5A]">
                    {s.firstName} {s.lastName}
                  </p>
                  <p className="text-xs text-slate-500">{s.admissionNumber}</p>
                </div>

                <select
                  value={records[s.id] || "PRESENT"}
                  onChange={(e) =>
                    setRecords((prev) => ({ ...prev, [s.id]: e.target.value }))
                  }
                  className="border border-purple-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="PRESENT">Present</option>
                  <option value="ABSENT">Absent</option>
                  <option value="LATE">Late</option>
                  <option value="EXCUSED">Excused</option>
                </select>
              </div>
            ))}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-5 py-2.5 rounded-full text-sm font-semibold disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}