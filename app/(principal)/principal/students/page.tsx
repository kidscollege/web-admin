"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function PrincipalStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any | null>(null);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students", {
        params: { search: search || undefined, limit: 100 },
      });
      setStudents(res.data?.data || res.data || []);
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
    fetchStudents();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[#2E1A5A]">Students</h1>
        <p className="text-sm text-slate-500 mt-1">View student records</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          fetchStudents();
        }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or admission number"
          className="flex-1 border border-purple-200 rounded-xl px-4 py-2.5 text-sm"
        />
        <button className="bg-[#7C3AED] text-white px-5 py-2.5 rounded-full text-sm">
          Search
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-slate-500">Loading students...</p>
        ) : students.length === 0 ? (
          <p className="p-6 text-slate-500">No students found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-purple-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3">Admission No</th>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Class</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b">
                    <td className="px-4 py-3">{s.admissionNumber}</td>
                    <td className="px-4 py-3">
                      {s.firstName} {s.lastName}
                    </td>
                    <td className="px-4 py-3">
                      {s.currentClass?.name || "Unassigned"}
                    </td>
                    <td className="px-4 py-3">{s.status}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(s)}
                        className="text-[#7C3AED] text-sm font-medium"
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

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-5 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-[#2E1A5A]">Student details</h3>
              <button onClick={() => setSelected(null)}>✕</button>
            </div>
            <p>
              <b>Name:</b> {selected.firstName} {selected.lastName}
            </p>
            <p>
              <b>Admission No:</b> {selected.admissionNumber}
            </p>
            <p>
              <b>Gender:</b> {selected.gender || "—"}
            </p>
            <p>
              <b>Class:</b> {selected.currentClass?.name || "Unassigned"}
            </p>
            <p>
              <b>Status:</b> {selected.status}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}