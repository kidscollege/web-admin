"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function ParentChildrenPage() {
  const router = useRouter();
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/parent/children")
      .then((res) => setChildren(res.data || []))
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
        Loading children...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-[#2E1A5A]">My Children</h1>

      {children.length === 0 ? (
        <div className="bg-white rounded-2xl border border-purple-100 p-6 text-slate-500">
          No children linked to this parent account.
        </div>
      ) : (
        children.map((item) => (
          <div
            key={item.student.id}
            className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-semibold text-lg text-[#2E1A5A]">
                  {item.student.firstName} {item.student.lastName}
                </p>
                <p className="text-sm text-slate-500">
                  {item.student.admissionNumber}
                  {item.student.className ? ` · ${item.student.className}` : ""}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Relationship: {item.relationship || "Guardian"}
                </p>
              </div>

              <Link
                href={`/parent/children/${item.student.id}`}
                className="bg-[#7C3AED] text-white px-4 py-2 rounded-full text-sm text-center"
              >
                Open Profile
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}