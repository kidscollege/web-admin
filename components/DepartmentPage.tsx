"use client";

import Link from "next/link";

interface DepartmentPageProps {
  title: string;
  description: string;
  sections: string[];
}

export default function DepartmentPage({
  title,
  description,
  sections,
}: DepartmentPageProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <div
            key={section}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <h3 className="font-semibold text-gray-800">{section}</h3>
            <p className="mt-2 text-sm text-gray-500">
              Manage {section.toLowerCase()} records and activities.
            </p>
          </div>
        ))}
      </div>

      <Link
        href="/dashboard/departments"
        className="mt-6 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        Back to Departments
      </Link>
    </div>
  );
}
