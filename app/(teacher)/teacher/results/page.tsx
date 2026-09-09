"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function TeacherResultsPage() {
  const router = useRouter();

  const [assignments, setAssignments] = useState<any[]>([]);
  const [terms, setTerms] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [scores, setScores] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [assignmentId, setAssignmentId] = useState("");
  const [termId, setTermId] = useState("");
  const [assessmentId, setAssessmentId] = useState("");
  const [maxScore, setMaxScore] = useState<number | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    name: "CA1",
    maxScore: "20",
    weight: "20",
  });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    Promise.all([api.get("/teacher/assignments"), api.get("/teacher/terms")])
      .then(([a, t]) => {
        setAssignments(a.data || []);
        setTerms(t.data || []);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          removeToken();
          router.push("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const currentAssignment = assignments.find((a) => a.id === assignmentId);
  const classId = currentAssignment?.classId || currentAssignment?.class?.id;
  const sectionId = currentAssignment?.sectionId || currentAssignment?.section?.id;
  const subjectId = currentAssignment?.subjectId || currentAssignment?.subject?.id;

  const loadAssessments = async (subjId = subjectId, tId = termId) => {
    if (!subjId || !tId) {
      setAssessments([]);
      return;
    }
    const res = await api.get("/teacher/assessments", {
      params: { subjectId: subjId, termId: tId },
    });
    setAssessments(res.data || []);
  };

  const loadScores = async (aId = assessmentId) => {
    if (!aId || !classId) {
      setRows([]);
      setScores({});
      setMaxScore(null);
      return;
    }

    const res = await api.get(`/teacher/assessments/${aId}/scores`, {
      params: {
        classId,
        ...(sectionId ? { sectionId } : {}),
      },
    });

    setMaxScore(res.data?.assessment?.maxScore ?? null);
    const list = res.data?.rows || [];
    setRows(list);

    const mapped: Record<string, string> = {};
    list.forEach((r: any) => {
      mapped[r.studentId] = r.score == null ? "" : String(r.score);
    });
    setScores(mapped);
  };

  const handleCreateAssessment = async () => {
    if (!subjectId || !termId) {
      alert("Select class/subject and term first");
      return;
    }

    try {
      const res = await api.post("/teacher/assessments", {
        subjectId,
        termId,
        name: newAssessment.name,
        maxScore: Number(newAssessment.maxScore),
        weight: Number(newAssessment.weight),
      });
      setShowCreate(false);
      await loadAssessments();
      setAssessmentId(res.data.id);
      await loadScores(res.data.id);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create assessment");
    }
  };

  const handleSave = async () => {
    if (!assessmentId || !classId) {
      alert("Select assessment and class");
      return;
    }

    setSaving(true);
    try {
      await api.post(`/teacher/assessments/${assessmentId}/scores`, {
        classId,
        sectionId,
        scores: rows.map((r) => ({
          studentId: r.studentId,
          score: scores[r.studentId] === "" ? null : Number(scores[r.studentId]),
        })),
      });
      alert("Scores saved successfully");
      await loadScores(assessmentId);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save scores");
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
        <h1 className="text-2xl font-extrabold text-[#2E1A5A]">Enter Results</h1>
        <p className="text-sm text-slate-500 mt-1">
          Select class/subject, term, and assessment to enter scores
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Class / Subject</label>
          <select
            value={assignmentId}
            onChange={async (e) => {
              setAssignmentId(e.target.value);
              setAssessmentId("");
              setRows([]);
              if (termId) {
                const item = assignments.find((a) => a.id === e.target.value);
                const subj = item?.subjectId || item?.subject?.id;
                if (subj) {
                  const res = await api.get("/teacher/assessments", {
                    params: { subjectId: subj, termId },
                  });
                  setAssessments(res.data || []);
                }
              }
            }}
            className="w-full border border-purple-200 rounded-xl px-3 py-2.5 text-sm"
          >
            <option value="">Select assignment</option>
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {(a.className || a.class?.name || "Class") +
                  " - " +
                  (a.subjectName || a.subject?.name || "Subject")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Term</label>
          <select
            value={termId}
            onChange={async (e) => {
              setTermId(e.target.value);
              setAssessmentId("");
              setRows([]);
              if (subjectId && e.target.value) {
                const res = await api.get("/teacher/assessments", {
                  params: { subjectId, termId: e.target.value },
                });
                setAssessments(res.data || []);
              }
            }}
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
          <label className="block text-sm font-medium mb-1">Assessment</label>
          <div className="flex gap-2">
            <select
              value={assessmentId}
              onChange={async (e) => {
                setAssessmentId(e.target.value);
                if (e.target.value) await loadScores(e.target.value);
              }}
              className="w-full border border-purple-200 rounded-xl px-3 py-2.5 text-sm"
            >
              <option value="">Select assessment</option>
              {assessments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} (Max {a.maxScore})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="px-3 py-2 rounded-xl text-sm border border-purple-200 text-[#7C3AED]"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {showCreate && (
        <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm space-y-3">
          <h3 className="font-semibold text-[#2E1A5A]">Create Assessment</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              value={newAssessment.name}
              onChange={(e) =>
                setNewAssessment({ ...newAssessment, name: e.target.value })
              }
              placeholder="CA1 / Exam"
              className="border border-purple-200 rounded-xl px-3 py-2.5 text-sm"
            />
            <input
              type="number"
              value={newAssessment.maxScore}
              onChange={(e) =>
                setNewAssessment({ ...newAssessment, maxScore: e.target.value })
              }
              placeholder="Max score"
              className="border border-purple-200 rounded-xl px-3 py-2.5 text-sm"
            />
            <input
              type="number"
              value={newAssessment.weight}
              onChange={(e) =>
                setNewAssessment({ ...newAssessment, weight: e.target.value })
              }
              placeholder="Weight %"
              className="border border-purple-200 rounded-xl px-3 py-2.5 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateAssessment}
              className="bg-[#7C3AED] text-white px-4 py-2 rounded-full text-sm"
            >
              Save Assessment
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="border border-purple-200 px-4 py-2 rounded-full text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm">
        {!assessmentId ? (
          <p className="text-slate-500 text-sm">
            Select or create an assessment to enter scores.
          </p>
        ) : rows.length === 0 ? (
          <p className="text-slate-500 text-sm">No students found in this class.</p>
        ) : (
          <div className="space-y-3">
            {maxScore != null && (
              <p className="text-sm text-slate-500">Max score: {maxScore}</p>
            )}

            {rows.map((r) => (
              <div
                key={r.studentId}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-purple-50 py-3"
              >
                <div>
                  <p className="font-medium text-[#2E1A5A]">
                    {r.firstName} {r.lastName}
                  </p>
                  <p className="text-xs text-slate-500">{r.admissionNumber}</p>
                </div>
                <input
                  type="number"
                  value={scores[r.studentId] ?? ""}
                  onChange={(e) =>
                    setScores((prev) => ({
                      ...prev,
                      [r.studentId]: e.target.value,
                    }))
                  }
                  className="w-full sm:w-32 border border-purple-200 rounded-lg px-3 py-2 text-sm"
                  placeholder="Score"
                />
              </div>
            ))}

            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-5 py-2.5 rounded-full text-sm font-semibold disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Scores"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}