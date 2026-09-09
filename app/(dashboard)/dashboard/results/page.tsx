"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function ResultsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"assessments" | "scores">("assessments");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [assessments, setAssessments] = useState<any[]>([]);
  const [terms, setTerms] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any | null>(null);
  const [assessmentScores, setAssessmentScores] = useState<any[]>([]);
  const [loadingScores, setLoadingScores] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<any | null>(null);

  const [assessmentForm, setAssessmentForm] = useState({
    termId: "",
    subjectId: "",
    name: "CA1",
    maxScore: 20,
    weight: 20,
    assessmentDate: "",
  });

  const [scoreForm, setScoreForm] = useState({
    studentId: "",
    assessmentId: "",
    score: "",
    remark: "",
  });

  const fetchData = async () => {
    try {
      const [assessmentsRes, subjectsRes, studentsRes, sessionsRes] =
        await Promise.all([
          api.get("/results/assessments"),
          api.get("/academics/subjects"),
          api.get("/students"),
          api.get("/academics/sessions"),
        ]);

      setAssessments(assessmentsRes.data || []);
      setSubjects(subjectsRes.data || []);
      setStudents(studentsRes.data?.data || []);

      const currentSession = (sessionsRes.data || []).find((s: any) => s.isCurrent);
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

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    fetchData();
  }, []);

  const openAssessmentModal = (assessment?: any) => {
    if (assessment) {
      setEditingAssessment(assessment);
      setAssessmentForm({
        termId: assessment.termId || "",
        subjectId: assessment.subjectId || "",
        name: assessment.name || "CA1",
        maxScore: assessment.maxScore || 20,
        weight: assessment.weight || 20,
        assessmentDate: assessment.assessmentDate
          ? assessment.assessmentDate.split("T")[0]
          : "",
      });
    } else {
      setEditingAssessment(null);
      setAssessmentForm({
        termId: "",
        subjectId: "",
        name: "CA1",
        maxScore: 20,
        weight: 20,
        assessmentDate: "",
      });
    }
    setShowAssessmentModal(true);
  };

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...assessmentForm,
        maxScore: Number(assessmentForm.maxScore),
        weight: Number(assessmentForm.weight),
      };

      if (editingAssessment) {
        await api.patch(`/results/assessments/${editingAssessment.id}`, payload);
      } else {
        await api.post("/results/assessments", payload);
      }

      setShowAssessmentModal(false);
      setEditingAssessment(null);
      setAssessmentForm({
        termId: "",
        subjectId: "",
        name: "CA1",
        maxScore: 20,
        weight: 20,
        assessmentDate: "",
      });
      fetchData();
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          (editingAssessment ? "Failed to update assessment" : "Failed to create assessment")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAssessment = async (assessment: any) => {
    if (!confirm(`Delete assessment "${assessment.name}"? This will also remove its recorded scores.`)) {
      return;
    }

    try {
      await api.delete(`/results/assessments/${assessment.id}`);
      if (selectedAssessment?.id === assessment.id) {
        setSelectedAssessment(null);
        setAssessmentScores([]);
      }
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete assessment");
    }
  };

  const openScoreModal = (assessment?: any, existingScore?: any) => {
    if (assessment) {
      setScoreForm({
        studentId: existingScore?.studentId || "",
        assessmentId: assessment.id,
        score: existingScore ? String(existingScore.score) : "",
        remark: existingScore?.remark || "",
      });
    } else {
      setScoreForm({
        studentId: "",
        assessmentId: "",
        score: "",
        remark: "",
      });
    }
    setShowScoreModal(true);
  };

  const handleRecordScore = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/results/scores", {
        studentId: scoreForm.studentId,
        assessmentId: scoreForm.assessmentId,
        score: Number(scoreForm.score),
        remark: scoreForm.remark || undefined,
      });
      setShowScoreModal(false);
      setScoreForm({
        studentId: "",
        assessmentId: "",
        score: "",
        remark: "",
      });

      // Refresh scores if we are viewing an assessment
      if (selectedAssessment) {
        loadAssessmentScores(selectedAssessment.id);
      }

      alert("Score saved successfully");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save score");
    } finally {
      setSubmitting(false);
    }
  };

  const loadAssessmentScores = async (assessmentId: string) => {
    setLoadingScores(true);
    try {
      const res = await api.get(`/results/assessments/${assessmentId}`);
      setAssessmentScores(res.data?.scores || []);
      setSelectedAssessment(res.data);
    } catch (err: any) {
      alert("Failed to load scores");
    } finally {
      setLoadingScores(false);
    }
  };

  const viewAssessmentScores = (assessment: any) => {
    setSelectedAssessment(assessment);
    loadAssessmentScores(assessment.id);
  };

  return (
    <div>
      {/* Header */}
     {/* Header */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
  <div>
    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Results</h2>
    <p className="text-sm text-gray-500 mt-1">
      Manage assessments and student scores
    </p>
  </div>

  <a
    href="/dashboard/results/student"
    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition text-center w-full sm:w-auto"
  >
    View Student Results
  </a>
</div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[
          { key: "assessments", label: "Assessments" },
          { key: "scores", label: "Record / Edit Score" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as any);
              setSelectedAssessment(null);
            }}
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
          {/* ================= ASSESSMENTS ================= */}
          {activeTab === "assessments" && !selectedAssessment && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => openAssessmentModal()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  + Create Assessment
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {assessments.length === 0 ? (
                  <p className="text-gray-500 col-span-full">No assessments found</p>
                ) : (
                  assessments.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                          Max: {item.maxScore}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Subject: {item.subject?.name || "—"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Term: {item.term?.name || "—"}
                      </p>
                      {item.weight && (
                        <p className="text-xs text-gray-400 mt-2">
                          Weight: {item.weight}%
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mb-4">
                        Scores recorded: {item._count?.scores || 0}
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => viewAssessmentScores(item)}
                          className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
                        >
                          View Scores
                        </button>
                        <button
                          onClick={() => openAssessmentModal(item)}
                          className="flex-1 border border-amber-300 text-amber-700 py-2 rounded-lg text-sm font-medium hover:bg-amber-50"
                        >
                          Edit
                        </button>
                      </div>

                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => openScoreModal(item)}
                          className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                          Add Score
                        </button>
                        <button
                          onClick={() => handleDeleteAssessment(item)}
                          className="flex-1 border border-red-300 text-red-700 py-2 rounded-lg text-sm font-medium hover:bg-red-50"
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

          {/* ================= VIEW SCORES FOR ONE ASSESSMENT ================= */}
          {activeTab === "assessments" && selectedAssessment && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <button
                    onClick={() => setSelectedAssessment(null)}
                    className="text-sm text-blue-600 hover:underline mb-1"
                  >
                    ← Back to Assessments
                  </button>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {selectedAssessment.name} — {selectedAssessment.subject?.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedAssessment.term?.name} · Max Score:{" "}
                    {selectedAssessment.maxScore}
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => openAssessmentModal(selectedAssessment)}
                    className="border border-amber-300 text-amber-700 px-3 py-2 rounded-lg text-sm font-medium"
                  >
                    Edit Assessment
                  </button>
                  <button
                    onClick={() => openScoreModal(selectedAssessment)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    + Add / Edit Score
                  </button>
                </div>
              </div>

              {loadingScores ? (
                <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                  Loading scores...
                </div>
              ) : assessmentScores.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                  No scores recorded yet for this assessment
                </div>
              ) : (
                <>
                  {/* Desktop */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hidden md:block">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="text-left px-6 py-3 font-medium text-gray-600">
                              Student
                            </th>
                            <th className="text-left px-6 py-3 font-medium text-gray-600">
                              Score
                            </th>
                            <th className="text-left px-6 py-3 font-medium text-gray-600">
                              Remark
                            </th>
                            <th className="text-left px-6 py-3 font-medium text-gray-600">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {assessmentScores.map((item: any) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                {item.student
                                  ? `${item.student.firstName} ${item.student.lastName}`
                                  : "—"}
                                <p className="text-xs text-gray-500">
                                  {item.student?.admissionNumber}
                                </p>
                              </td>
                              <td className="px-6 py-4 font-medium">
                                {item.score} / {selectedAssessment.maxScore}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {item.remark || "—"}
                              </td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() =>
                                    openScoreModal(selectedAssessment, item)
                                  }
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  Edit
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="md:hidden space-y-3">
                    {assessmentScores.map((item: any) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {item.student
                                ? `${item.student.firstName} ${item.student.lastName}`
                                : "Student"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.student?.admissionNumber}
                            </p>
                          </div>
                          <p className="font-bold text-gray-800">
                            {item.score}/{selectedAssessment.maxScore}
                          </p>
                        </div>
                        {item.remark && (
                          <p className="text-sm text-gray-600 mb-3">
                            Remark: {item.remark}
                          </p>
                        )}
                        <button
                          onClick={() => openScoreModal(selectedAssessment, item)}
                          className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg text-sm font-medium"
                        >
                          Edit Score
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ================= RECORD / EDIT SCORE TAB ================= */}
          {activeTab === "scores" && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm max-w-lg">
              <h3 className="font-semibold text-gray-800 mb-4">
                Record or Edit Student Score
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                If a score already exists for the student + assessment, it will be
                updated.
              </p>
              <form onSubmit={handleRecordScore} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Assessment *</label>
                  <select
                    required
                    value={scoreForm.assessmentId}
                    onChange={(e) =>
                      setScoreForm({ ...scoreForm, assessmentId: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select assessment</option>
                    {assessments.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} — {a.subject?.name} ({a.term?.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Student *</label>
                  <select
                    required
                    value={scoreForm.studentId}
                    onChange={(e) =>
                      setScoreForm({ ...scoreForm, studentId: e.target.value })
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
                  <label className="block text-sm font-medium mb-1">Score *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={scoreForm.score}
                    onChange={(e) =>
                      setScoreForm({ ...scoreForm, score: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Remark</label>
                  <input
                    value={scoreForm.remark}
                    onChange={(e) =>
                      setScoreForm({ ...scoreForm, remark: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Score"}
                </button>
              </form>
            </div>
          )}
        </>
      )}

      {/* Create Assessment Modal */}
      {showAssessmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold">
                {editingAssessment ? "Edit Assessment" : "Create Assessment"}
              </h3>
              <button
                onClick={() => {
                  setShowAssessmentModal(false);
                  setEditingAssessment(null);
                }}
                className="text-gray-400 text-xl"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateAssessment} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Term *</label>
                <select
                  required
                  value={assessmentForm.termId}
                  onChange={(e) =>
                    setAssessmentForm({ ...assessmentForm, termId: e.target.value })
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
                <label className="block text-sm font-medium mb-1">Subject *</label>
                <select
                  required
                  value={assessmentForm.subjectId}
                  onChange={(e) =>
                    setAssessmentForm({ ...assessmentForm, subjectId: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select subject</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Assessment Name *</label>
                <select
                  value={assessmentForm.name}
                  onChange={(e) =>
                    setAssessmentForm({ ...assessmentForm, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>CA1</option>
                  <option>CA2</option>
                  <option>Mid-Term</option>
                  <option>Exam</option>
                  <option>Assignment</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Max Score *</label>
                  <input
                    required
                    type="number"
                    value={assessmentForm.maxScore}
                    onChange={(e) =>
                      setAssessmentForm({
                        ...assessmentForm,
                        maxScore: Number(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Weight (%)</label>
                  <input
                    type="number"
                    value={assessmentForm.weight}
                    onChange={(e) =>
                      setAssessmentForm({
                        ...assessmentForm,
                        weight: Number(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={assessmentForm.assessmentDate}
                  onChange={(e) =>
                    setAssessmentForm({
                      ...assessmentForm,
                      assessmentDate: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssessmentModal(false)}
                  className="flex-1 border border-gray-300 py-2.5 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingAssessment ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record / Edit Score Modal */}
      {showScoreModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold">Record / Edit Score</h3>
              <button
                onClick={() => setShowScoreModal(false)}
                className="text-gray-400 text-xl"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleRecordScore} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Assessment *</label>
                <select
                  required
                  value={scoreForm.assessmentId}
                  onChange={(e) =>
                    setScoreForm({ ...scoreForm, assessmentId: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select assessment</option>
                  {assessments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} — {a.subject?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Student *</label>
                <select
                  required
                  value={scoreForm.studentId}
                  onChange={(e) =>
                    setScoreForm({ ...scoreForm, studentId: e.target.value })
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
                <label className="block text-sm font-medium mb-1">Score *</label>
                <input
                  required
                  type="number"
                  min="0"
                  value={scoreForm.score}
                  onChange={(e) =>
                    setScoreForm({ ...scoreForm, score: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Remark</label>
                <input
                  value={scoreForm.remark}
                  onChange={(e) =>
                    setScoreForm({ ...scoreForm, remark: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScoreModal(false)}
                  className="flex-1 border border-gray-300 py-2.5 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Score"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}