"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function PrincipalResultsPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }

    api
      .get("/results/assessments")
      .then((res) => {
        setAssessments(Array.isArray(res.data) ? res.data : res.data?.data || []);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          removeToken();
          router.push("/login");
        } else if (err.response?.status === 404) {
          setAssessments([]);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[#2E1A5A]">Results</h1>
        <p className="text-sm text-slate-500 mt-1">Assessment overview</p>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden">
        {loading ? (
          <p className="p-6 text-slate-500">Loading...</p>
        ) : assessments.length === 0 ? (
          <p className="p-6 text-slate-500">No assessments found.</p>
        ) : (
          <div className="divide-y">
            {assessments.map((a) => (
              <div key={a.id} className="px-4 py-3">
                <p className="font-semibold">{a.name}</p>
                <p className="text-xs text-slate-500">
                  {a.subject?.name || "Subject"} · Max {a.maxScore}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}