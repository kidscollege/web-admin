"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function StudentResultsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [terms, setTerms] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedTermId, setSelectedTermId] = useState("");
  const [resultData, setResultData] = useState<any>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const loadFilters = async () => {
      try {
        const [studentsRes, sessionsRes] = await Promise.all([
          api.get("/students", { params: { limit: 100 } }),
          api.get("/academics/sessions"),
        ]);

        setStudents(studentsRes.data?.data || []);

        const currentSession = (sessionsRes.data || []).find(
          (s: any) => s.isCurrent
        );
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
      }
    };

    loadFilters();
  }, [router]);

  const loadResults = async () => {
    if (!selectedStudentId) {
      alert("Please select a student");
      return;
    }

    setLoading(true);
    setResultData(null);

    try {
      const res = await api.get(`/results/students/${selectedStudentId}`, {
        params: selectedTermId ? { termId: selectedTermId } : undefined,
      });
      setResultData(res.data);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  // Group scores by subject for nicer display
  const groupedBySubject = () => {
    if (!resultData?.scores) return [];

    const map: Record<string, any> = {};

    resultData.scores.forEach((item: any) => {
      const subjectName = item.assessment?.subject?.name || "Unknown Subject";
      if (!map[subjectName]) {
        map[subjectName] = {
          subject: subjectName,
          scores: [],
        };
      }
      map[subjectName].scores.push(item);
    });

    return Object.values(map);
  };

  return (
    <div>
      {/* Header */}
     {/* Header */}
<div className="mb-6">
  <Link
    href="/dashboard/results"
    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-2"
  >
    ← Back to Results
  </Link>
  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
    Student Results
  </h2>
  <p className="text-sm text-gray-500 mt-1">
    View full scores and report for a student
  </p>
</div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Student *</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
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
            <label className="block text-sm font-medium mb-1">Term (optional)</label>
            <select
              value={selectedTermId}
              onChange={(e) => setSelectedTermId(e.target.value)}
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

          <div className="flex items-end">
            <button
              onClick={loadResults}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load Results"}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {resultData && (
        <div className="space-y-6">
          {/* Student Info Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">
              {resultData.student?.firstName} {resultData.student?.lastName}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Admission No: {resultData.student?.admissionNumber}
            </p>
            <p className="text-sm text-gray-500">
              Total records: {resultData.scores?.length || 0}
            </p>
          </div>

          {resultData.scores?.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500">
              No scores found for this student
              {selectedTermId ? " in the selected term" : ""}.
            </div>
          ) : (
            <>
              {/* Grouped by Subject */}
              {groupedBySubject().map((group: any) => (
                <div
                  key={group.subject}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  <div className="bg-gray-50 px-5 py-3 border-b">
                    <h4 className="font-semibold text-gray-800">{group.subject}</h4>
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b">
                        <tr>
                          <th className="text-left px-5 py-3 font-medium text-gray-600">
                            Assessment
                          </th>
                          <th className="text-left px-5 py-3 font-medium text-gray-600">
                            Term
                          </th>
                          <th className="text-left px-5 py-3 font-medium text-gray-600">
                            Score
                          </th>
                          <th className="text-left px-5 py-3 font-medium text-gray-600">
                            Max
                          </th>
                          <th className="text-left px-5 py-3 font-medium text-gray-600">
                            Remark
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {group.scores.map((item: any) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-5 py-3 font-medium">
                              {item.assessment?.name}
                            </td>
                            <td className="px-5 py-3 text-gray-600">
                              {item.assessment?.term?.name || "—"}
                            </td>
                            <td className="px-5 py-3 font-semibold text-gray-800">
                              {item.score}
                            </td>
                            <td className="px-5 py-3 text-gray-600">
                              {item.assessment?.maxScore}
                            </td>
                            <td className="px-5 py-3 text-gray-600">
                              {item.remark || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden divide-y divide-gray-100">
                    {group.scores.map((item: any) => (
                      <div key={item.id} className="p-4">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-medium text-gray-800">
                            {item.assessment?.name}
                          </p>
                          <p className="font-bold text-gray-800">
                            {item.score}/{item.assessment?.maxScore}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {item.assessment?.term?.name}
                        </p>
                        {item.remark && (
                          <p className="text-sm text-gray-600 mt-1">
                            Remark: {item.remark}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Flat list alternative (all scores) */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-3">
                  All Scores (Summary)
                </h4>
                <div className="space-y-2">
                  {resultData.scores.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm border-b border-gray-100 pb-2"
                    >
                      <div>
                        <span className="font-medium">
                          {item.assessment?.subject?.name}
                        </span>{" "}
                        — {item.assessment?.name}
                        <span className="text-gray-500 text-xs ml-2">
                          ({item.assessment?.term?.name})
                        </span>
                      </div>
                      <div className="font-semibold text-gray-800 mt-1 sm:mt-0">
                        {item.score} / {item.assessment?.maxScore}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {!resultData && !loading && (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
          Select a student and click <strong>Load Results</strong> to view their
          scores.
        </div>
      )}
    </div>
  );
}