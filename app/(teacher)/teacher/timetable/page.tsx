"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TeacherTimetablePage() {
  const router = useRouter();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }

    api.get("/teacher/timetable")
      .then((response) => setEntries(response.data || []))
      .catch((error) => {
        if (error.response?.status === 401) {
          removeToken();
          router.push("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return <div className="rounded-2xl bg-white p-8 text-center text-slate-500">Loading timetable...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#2E1A5A]">My timetable</h1>
        <p className="mt-1 text-sm text-slate-500">Your scheduled classes and teaching periods</p>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-purple-100 bg-white p-8 text-center text-sm text-slate-500">
          No timetable entries have been published for you yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {days.map((day, index) => {
            const dayEntries = entries.filter((entry) => entry.dayOfWeek === index + 1);
            return (
              <section key={day} className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
                <h2 className="font-bold text-[#2E1A5A]">{day}</h2>
                <div className="mt-4 space-y-3">
                  {dayEntries.length === 0 ? (
                    <p className="text-sm text-slate-400">No classes</p>
                  ) : dayEntries.map((entry) => (
                    <div key={entry.id} className="rounded-xl border border-purple-50 bg-purple-50/40 p-3">
                      <p className="font-semibold text-[#2E1A5A]">{entry.subject?.name}</p>
                      <p className="mt-1 text-sm text-slate-600">{entry.startTime} - {entry.endTime}</p>
                      <p className="text-sm text-slate-500">{entry.class?.name}{entry.section?.name ? ` ${entry.section.name}` : ""}</p>
                      {entry.room && <p className="text-xs text-slate-400">{entry.room}</p>}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}