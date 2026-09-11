"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function PrincipalAcademicsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"sessions" | "classes" | "subjects">("sessions");
  const [sessions, setSessions] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }

    Promise.all([
      api.get("/academics/sessions"),
      api.get("/academics/classes"),
      api.get("/academics/subjects"),
    ])
      .then(([s, c, sub]) => {
        setSessions(Array.isArray(s.data) ? s.data : s.data?.data || []);
        setClasses(Array.isArray(c.data) ? c.data : c.data?.data || []);
        setSubjects(Array.isArray(sub.data) ? sub.data : sub.data?.data || []);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          removeToken();
          router.push("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const tabs = [
    { key: "sessions", label: "Sessions" },
    { key: "classes", label: "Classes" },
    { key: "subjects", label: "Subjects" },
  ] as const;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[#2E1A5A]">Academics</h1>
        <p className="text-sm text-slate-500 mt-1">View academic structure</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm ${
              tab === t.key
                ? "bg-[#7C3AED] text-white"
                : "bg-white border border-purple-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 p-4">
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : tab === "sessions" ? (
          sessions.length === 0 ? (
            <p className="text-slate-500">No sessions.</p>
          ) : (
            sessions.map((s) => (
              <div key={s.id} className="py-3 border-b last:border-0">
                <p className="font-semibold">{s.name}</p>
                <p className="text-xs text-slate-500">
                  {s.isCurrent ? "Current session" : "Past/upcoming"}
                </p>
              </div>
            ))
          )
        ) : tab === "classes" ? (
          classes.length === 0 ? (
            <p className="text-slate-500">No classes.</p>
          ) : (
            classes.map((c) => (
              <div key={c.id} className="py-3 border-b last:border-0">
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-slate-500">{c.level || "—"}</p>
              </div>
            ))
          )
        ) : subjects.length === 0 ? (
          <p className="text-slate-500">No subjects.</p>
        ) : (
          subjects.map((s) => (
            <div key={s.id} className="py-3 border-b last:border-0">
              <p className="font-semibold">{s.name}</p>
              <p className="text-xs text-slate-500">{s.code || "—"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}