"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function PrincipalDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    students: 0,
    staff: 0,
    pendingApps: 0,
    classes: 0,
  });

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }

    Promise.all([
      api.get("/students", { params: { limit: 1 } }),
      api.get("/hr/staff"),
      api.get("/admissions/stats"),
      api.get("/academics/classes"),
    ])
      .then(([stu, staff, apps, classes]) => {
        const studentTotal =
          stu.data?.total ??
          (Array.isArray(stu.data) ? stu.data.length : stu.data?.data?.length) ??
          0;
        const staffList = Array.isArray(staff.data)
          ? staff.data
          : staff.data?.data || [];
        const classList = Array.isArray(classes.data)
          ? classes.data
          : classes.data?.data || [];

        setStats({
          students: Number(studentTotal) || 0,
          staff: staffList.length,
          pendingApps: Number(apps.data?.submitted || apps.data?.pending || 0),
          classes: classList.length,
        });
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          removeToken();
          router.push("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const cards = [
    { label: "Students", value: stats.students },
    { label: "Staff", value: stats.staff },
    { label: "Pending applications", value: stats.pendingApps },
    { label: "Classes", value: stats.classes },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#2E1A5A]">
          Principal Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Academic oversight across Kids College
        </p>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <div
              key={c.label}
              className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm"
            >
              <p className="text-xs text-slate-500">{c.label}</p>
              <p className="text-2xl font-bold mt-1">{c.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}