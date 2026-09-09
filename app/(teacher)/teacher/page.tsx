"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/teacher/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          removeToken();
          router.push("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#2E1A5A]">
          Welcome{data?.teacher?.firstName ? `, ${data.teacher.firstName}` : ""}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Your teaching assignments
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Assignments</p>
          <p className="text-3xl font-bold text-[#7C3AED] mt-2">
            {data?.assignmentsCount || 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#2E1A5A]">Class Assignments</h2>
          <Link
            href="/teacher/attendance"
            className="text-sm text-[#7C3AED] hover:underline"
          >
            Mark Attendance
          </Link>
        </div>

        {data?.assignments?.length ? (
          <div className="space-y-3">
            {data.assignments.map((item: any) => (
              <div
                key={item.id}
                className="border border-purple-50 rounded-xl p-4"
              >
                <p className="font-semibold text-[#2E1A5A]">
                  {item.className}
                  {item.sectionName ? ` ${item.sectionName}` : ""}
                </p>
                <p className="text-sm text-slate-500">
                  Subject: {item.subjectName || "—"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">
            No class assignments yet. Ask admin to assign you to a class/subject.
          </p>
        )}
      </div>
    </div>
  );
}