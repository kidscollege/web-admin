"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function PrincipalAttendancePage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    api
      .get("/academics/classes")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setClasses(list);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          removeToken();
          router.push("/login");
        }
      });
  }, [router]);

  const load = async () => {
    if (!classId) {
      alert("Select a class");
      return;
    }
    setLoading(true);
    try {
      const res = await api.get("/attendance", {
        params: { classId, date },
      });
      setRecords(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err: any) {
      alert(err.response?.data?.message || "Could not load attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[#2E1A5A]">Attendance</h1>
        <p className="text-sm text-slate-500 mt-1">View class attendance</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="border border-purple-200 rounded-xl px-3 py-2.5 text-sm flex-1"
        >
          <option value="">Select class</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-purple-200 rounded-xl px-3 py-2.5 text-sm"
        />
        <button
          onClick={load}
          className="bg-[#7C3AED] text-white px-5 py-2.5 rounded-full text-sm"
        >
          Load
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 p-4">
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : records.length === 0 ? (
          <p className="text-slate-500">No attendance records.</p>
        ) : (
          records.map((r) => (
            <div key={r.id || r.studentId} className="py-3 border-b last:border-0 flex justify-between">
              <span>
                {r.student
                  ? `${r.student.firstName} ${r.student.lastName}`
                  : r.studentName}
              </span>
              <span className="text-sm font-medium">{r.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}