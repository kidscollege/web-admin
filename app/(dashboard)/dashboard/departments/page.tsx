import Link from "next/link";

const departments = [
  {
    title: "Academics",
    description: "Manage teaching, learning, classes, and academic progress.",
    href: "/dashboard/departments/academics",
    color: "bg-blue-500",
  },
  {
    title: "Human Resources & Admin",
    description: "Coordinate staff, administration, and people operations.",
    href: "/dashboard/departments/human-resources-admin",
    color: "bg-emerald-500",
  },
  {
    title: "Administrative & Support",
    description: "Organize school operations and support services.",
    href: "/dashboard/departments/administrative-support",
    color: "bg-amber-500",
  },
  {
    title: "Finance & Data",
    description: "Oversee finance, reporting, and school data management.",
    href: "/dashboard/departments/finance-data",
    color: "bg-rose-500",
  },
  {
    title: "Health & Welfare",
    description: "Support student wellbeing, health, and welfare services.",
    href: "/dashboard/departments/health-welfare",
    color: "bg-teal-500",
  },
];

export default function DepartmentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">Departments</h2>
        <p className="mt-1 text-sm text-gray-500">
          Select a department to view its activities and resources.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {departments.map((department) => (
          <Link
            key={department.href}
            href={department.href}
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className={`${department.color} mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold text-white shadow-lg`}>
              {department.title.charAt(0)}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
              {department.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              {department.description}
            </p>
            <span className="mt-5 inline-block text-sm font-medium text-blue-600">
              Open department →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
