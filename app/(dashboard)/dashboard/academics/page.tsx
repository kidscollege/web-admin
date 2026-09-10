"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function AcademicsPage() {
  const router = useRouter();
const [activeTab, setActiveTab] = useState<
  "sessions" | "terms" | "classes" | "subjects" | "assignments"
>("sessions");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [sessions, setSessions] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  // Modals
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);

  const [editingSession, setEditingSession] = useState<any | null>(null);
  const [editingClass, setEditingClass] = useState<any | null>(null);
  const [editingSubject, setEditingSubject] = useState<any | null>(null);

  const [sessionForm, setSessionForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
  });

  const [staffList, setStaffList] = useState<any[]>([]);
const [classSubjects, setClassSubjects] = useState<any[]>([]);
const [assignForm, setAssignForm] = useState({
  classId: "",
  subjectId: "",
  teacherId: "",
});
const [savingAssign, setSavingAssign] = useState(false);

  const [classForm, setClassForm] = useState({
    sessionId: "",
    name: "",
    level: "Junior",
    capacity: 40,
  });

  const [terms, setTerms] = useState<any[]>([]);
const [termForm, setTermForm] = useState({
  sessionId: "",
  name: "First Term",
  startDate: "",
  endDate: "",
  isCurrent: true,
});
const [savingTerm, setSavingTerm] = useState(false);

  const [subjectForm, setSubjectForm] = useState({
    name: "",
    code: "",
    description: "",
  });

  const fetchData = async () => {
  try {
    const [
      sessionsRes,
      classesRes,
      subjectsRes,
      termsRes,
      assignRes,
    ] = await Promise.all([
      api.get("/academics/sessions"),
      api.get("/academics/classes"),
      api.get("/academics/subjects"),
      api.get("/academics/terms"),
      api.get("/academics/class-subjects"),
    ]);

    setSessions(sessionsRes.data || []);
    setClasses(classesRes.data || []);
    setSubjects(subjectsRes.data || []);
    setTerms(termsRes.data || []);
    setClassSubjects(assignRes.data || []);

    // Staff is separate so a missing /staff endpoint
    // doesn't break the entire Academics page.
    try {
      const staffRes = await api.get("/staff");
      setStaffList(staffRes.data?.data || staffRes.data || []);
    } catch (staffErr) {
      console.warn("Staff endpoint unavailable:", staffErr);
      setStaffList([]);
    }
  } catch (err: any) {
    console.error("Failed to load academics data:", err);

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
  }, []);


  const handleCreateTerm = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!termForm.sessionId || !termForm.name || !termForm.startDate || !termForm.endDate) {
    alert("Please fill session, name, start date and end date");
    return;
  }

  setSavingTerm(true);
  try {
    await api.post("/academics/terms", {
      sessionId: termForm.sessionId,
      name: termForm.name,
      startDate: termForm.startDate,
      endDate: termForm.endDate,
      isCurrent: termForm.isCurrent,
    });
    alert("Term created");
    setTermForm({
      sessionId: "",
      name: "First Term",
      startDate: "",
      endDate: "",
      isCurrent: true,
    });
    // reload terms
    const termsRes = await api.get("/academics/terms");
    setTerms(termsRes.data || []);
  } catch (err: any) {
    alert(err.response?.data?.message || "Failed to create term");
  } finally {
    setSavingTerm(false);
  }
};

const handleAssignTeacher = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!assignForm.classId || !assignForm.subjectId || !assignForm.teacherId) {
    alert("Select class, subject and teacher");
    return;
  }

  setSavingAssign(true);
  try {
    await api.post("/academics/class-subjects", assignForm);
    alert("Teacher assigned successfully");
    setAssignForm({ classId: "", subjectId: "", teacherId: "" });
    const res = await api.get("/academics/class-subjects");
    setClassSubjects(res.data || []);
  } catch (err: any) {
    alert(err.response?.data?.message || "Failed to assign teacher");
  } finally {
    setSavingAssign(false);
  }
};

  // ===== SESSION HANDLERS =====
  const openSessionModal = (session?: any) => {
    if (session) {
      setEditingSession(session);
      setSessionForm({
        name: session.name || "",
        startDate: session.startDate ? session.startDate.split("T")[0] : "",
        endDate: session.endDate ? session.endDate.split("T")[0] : "",
        isCurrent: session.isCurrent || false,
      });
    } else {
      setEditingSession(null);
      setSessionForm({ name: "", startDate: "", endDate: "", isCurrent: false });
    }
    setShowSessionModal(true);
  };

  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingSession) {
        await api.patch(`/academics/sessions/${editingSession.id}`, sessionForm);
      } else {
        await api.post("/academics/sessions", sessionForm);
      }
      setShowSessionModal(false);
      setEditingSession(null);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save session");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSession = async (session: any) => {
    if (!confirm(`Delete session "${session.name}"?`)) return;
    try {
      await api.delete(`/academics/sessions/${session.id}`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete session");
    }
  };

  // ===== CLASS HANDLERS =====
  const openClassModal = (cls?: any) => {
    if (cls) {
      setEditingClass(cls);
      setClassForm({
        sessionId: cls.sessionId || "",
        name: cls.name || "",
        level: cls.level || "Junior",
        capacity: cls.capacity || 40,
      });
    } else {
      setEditingClass(null);
      setClassForm({ sessionId: "", name: "", level: "Junior", capacity: 40 });
    }
    setShowClassModal(true);
  };

  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...classForm, capacity: Number(classForm.capacity) };
      if (editingClass) {
        await api.patch(`/academics/classes/${editingClass.id}`, payload);
      } else {
        await api.post("/academics/classes", payload);
      }
      setShowClassModal(false);
      setEditingClass(null);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save class");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClass = async (cls: any) => {
    if (!confirm(`Delete class "${cls.name}"?`)) return;
    try {
      await api.delete(`/academics/classes/${cls.id}`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete class");
    }
  };

  

  // ===== SUBJECT HANDLERS =====
  const openSubjectModal = (subject?: any) => {
    if (subject) {
      setEditingSubject(subject);
      setSubjectForm({
        name: subject.name || "",
        code: subject.code || "",
        description: subject.description || "",
      });
    } else {
      setEditingSubject(null);
      setSubjectForm({ name: "", code: "", description: "" });
    }
    setShowSubjectModal(true);
  };

  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingSubject) {
        await api.patch(`/academics/subjects/${editingSubject.id}`, subjectForm);
      } else {
        await api.post("/academics/subjects", subjectForm);
      }
      setShowSubjectModal(false);
      setEditingSubject(null);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save subject");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubject = async (subject: any) => {
    if (!confirm(`Delete subject "${subject.name}"?`)) return;
    try {
      await api.delete(`/academics/subjects/${subject.id}`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete subject");
    }
  };

  const tabs = [
  { key: "sessions", label: "Sessions" },
  { key: "terms", label: "Terms" },
  { key: "classes", label: "Classes" },
  { key: "subjects", label: "Subjects" },
  { key: "assignments", label: "Assignments" },
] as const;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Academics</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage sessions, classes, and subjects
        </p>
      </div>

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
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">Loading...</div>
      ) : (
        <>
          {/* SESSIONS */}
          {activeTab === "sessions" && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => openSessionModal()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  + Add Session
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {sessions.length === 0 ? (
                  <p className="text-gray-500 col-span-full">No sessions found</p>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-800">{session.name}</h3>
                        {session.isCurrent && (
                          <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-4">
                        {new Date(session.startDate).toLocaleDateString()} —{" "}
                        {new Date(session.endDate).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openSessionModal(session)}
                          className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSession(session)}
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

{/* TERMS */}
{activeTab === "terms" && (
  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Terms</h3>

    <form
      onSubmit={handleCreateTerm}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-5"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Session</label>
        <select
          value={termForm.sessionId}
          onChange={(e) =>
            setTermForm({ ...termForm, sessionId: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
        >
          <option value="">Select session</option>
          {sessions.map((s: any) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Term Name</label>
        <select
          value={termForm.name}
          onChange={(e) =>
            setTermForm({ ...termForm, name: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
        >
          <option>First Term</option>
          <option>Second Term</option>
          <option>Third Term</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Start Date</label>
        <input
          type="date"
          value={termForm.startDate}
          onChange={(e) =>
            setTermForm({ ...termForm, startDate: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">End Date</label>
        <input
          type="date"
          value={termForm.endDate}
          onChange={(e) =>
            setTermForm({ ...termForm, endDate: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
        />
      </div>

      <div className="flex items-end">
        <button
          type="submit"
          disabled={savingTerm}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {savingTerm ? "Saving..." : "Add Term"}
        </button>
      </div>
    </form>

    {terms.length === 0 ? (
      <p className="text-sm text-gray-500">No terms created yet.</p>
    ) : (
      <div className="space-y-2">
        {terms.map((term: any) => (
          <div
            key={term.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-100 rounded-lg px-3 py-2 text-sm"
          >
            <div>
              <p className="font-medium text-gray-800">{term.name}</p>
              <p className="text-gray-500">
                {term.session?.name || "Session"} ·{" "}
                {term.startDate
                  ? new Date(term.startDate).toLocaleDateString()
                  : "—"}{" "}
                -{" "}
                {term.endDate
                  ? new Date(term.endDate).toLocaleDateString()
                  : "—"}
              </p>
            </div>
            {term.isCurrent && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full mt-2 sm:mt-0">
                Current
              </span>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
)}


          {/* CLASSES */}
          {activeTab === "classes" && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => openClassModal()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  + Add Class
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {classes.length === 0 ? (
                  <p className="text-gray-500 col-span-full">No classes found</p>
                ) : (
                  classes.map((cls) => (
                    <div
                      key={cls.id}
                      className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
                    >
                      <h3 className="font-semibold text-gray-800">{cls.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Level: {cls.level || "—"}</p>
                      <p className="text-sm text-gray-500 mb-4">
                        Session: {cls.session?.name || "—"}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openClassModal(cls)}
                          className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClass(cls)}
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

          {/* SUBJECTS */}
          {activeTab === "subjects" && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => openSubjectModal()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  + Add Subject
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {subjects.length === 0 ? (
                  <p className="text-gray-500 col-span-full">No subjects found</p>
                ) : (
                  subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800">{subject.name}</h3>
                        {subject.code && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {subject.code}
                          </span>
                        )}
                      </div>
                      {subject.description && (
                        <p className="text-sm text-gray-500 mb-4">{subject.description}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => openSubjectModal(subject)}
                          className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSubject(subject)}
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

          {activeTab === "assignments" && (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Assign Teacher to Class / Subject
      </h3>

      <form
        onSubmit={handleAssignTeacher}
        className="grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        <select
          value={assignForm.classId}
          onChange={(e) =>
            setAssignForm({ ...assignForm, classId: e.target.value })
          }
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
        >
          <option value="">Select class</option>
          {classes.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={assignForm.subjectId}
          onChange={(e) =>
            setAssignForm({ ...assignForm, subjectId: e.target.value })
          }
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
        >
          <option value="">Select subject</option>
          {subjects.map((s: any) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={assignForm.teacherId}
          onChange={(e) =>
            setAssignForm({ ...assignForm, teacherId: e.target.value })
          }
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
        >
          <option value="">Select teacher</option>
          {staffList.map((t: any) => (
            <option key={t.id} value={t.id}>
              {t.firstName} {t.lastName}
              {t.designation ? ` (${t.designation})` : ""}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={savingAssign}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {savingAssign ? "Saving..." : "Assign Teacher"}
        </button>
      </form>
    </div>

    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Current Assignments
      </h3>

      {classSubjects.length === 0 ? (
        <p className="text-sm text-gray-500">No assignments yet.</p>
      ) : (
        <div className="space-y-2">
          {classSubjects.map((item: any) => (
            <div
              key={item.id}
              className="border border-gray-100 rounded-lg px-3 py-2 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {item.class?.name || "Class"} — {item.subject?.name || "Subject"}
                </p>
                <p className="text-gray-500">
                  Teacher:{" "}
                  {item.teacher
                    ? `${item.teacher.firstName} ${item.teacher.lastName}`
                    : "Unassigned"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}



        </>
      )}

      {/* SESSION MODAL */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold">
                {editingSession ? "Edit Session" : "Add Session"}
              </h3>
              <button onClick={() => setShowSessionModal(false)} className="text-gray-400 text-xl">
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveSession} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Session Name *</label>
                <input
                  required
                  value={sessionForm.name}
                  onChange={(e) => setSessionForm({ ...sessionForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={sessionForm.startDate}
                    onChange={(e) =>
                      setSessionForm({ ...sessionForm, startDate: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={sessionForm.endDate}
                    onChange={(e) =>
                      setSessionForm({ ...sessionForm, endDate: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={sessionForm.isCurrent}
                  onChange={(e) =>
                    setSessionForm({ ...sessionForm, isCurrent: e.target.checked })
                  }
                />
                Set as current session
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
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

      {/* CLASS MODAL */}
      {showClassModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold">
                {editingClass ? "Edit Class" : "Add Class"}
              </h3>
              <button onClick={() => setShowClassModal(false)} className="text-gray-400 text-xl">
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveClass} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Session *</label>
                <select
                  required
                  value={classForm.sessionId}
                  onChange={(e) => setClassForm({ ...classForm, sessionId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select session</option>
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Class Name *</label>
                <input
                  required
                  value={classForm.name}
                  onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Level</label>
                <select
  value={classForm.level}
  onChange={(e) => setClassForm({ ...classForm, level: e.target.value })}
  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="Kindergarten">Kindergarten</option>
  <option value="Nursery">Nursery</option>
  <option value="Primary">Primary</option>
  <option value="Junior">Junior Secondary</option>
  <option value="Senior">Senior Secondary</option>
</select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Capacity</label>
                  <input
                    type="number"
                    value={classForm.capacity}
                    onChange={(e) =>
                      setClassForm({ ...classForm, capacity: Number(e.target.value) })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
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

      {/* SUBJECT MODAL */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold">
                {editingSubject ? "Edit Subject" : "Add Subject"}
              </h3>
              <button onClick={() => setShowSubjectModal(false)} className="text-gray-400 text-xl">
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveSubject} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject Name *</label>
                <input
                  required
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Code</label>
                <input
                  value={subjectForm.code}
                  onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  value={subjectForm.description}
                  onChange={(e) =>
                    setSubjectForm({ ...subjectForm, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
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
    </div>
  );
}