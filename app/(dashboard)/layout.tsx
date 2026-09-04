"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getToken, removeToken } from "@/lib/auth";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    name: "Students",
    href: "/dashboard/students",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  },
  {
    name: "Academics",
    href: "/dashboard/academics",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    name: "Finance",
    href: "/dashboard/finance",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    name: "Results",
    href: "/dashboard/results",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  },
  {
    name: "Attendance",
    href: "/dashboard/attendance",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    name: "Staff",
    href: "/dashboard/staff",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    name: "Admissions",
    href: "/dashboard/admissions",
    icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
  },
  {
    name: "Procurement",
    href: "/dashboard/procurement",
    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  },
  {
    name: "Departments",
    href: "/dashboard/departments",
    icon: "M3 7h18M5 7v10a2 2 0 002 2h10a2 2 0 002-2V7M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-5 4v4m3-4v4",
    children: [
      { name: "Academics", href: "/dashboard/departments/academics" },
      { name: "Human Resources & Admin", href: "/dashboard/departments/human-resources-admin" },
      { name: "Administrative & Support", href: "/dashboard/departments/administrative-support" },
      { name: "Finance & Data", href: "/dashboard/departments/finance-data" },
      { name: "Health & Welfare", href: "/dashboard/departments/health-welfare" },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [departmentsOpen, setDepartmentsOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setDepartmentsOpen(pathname.startsWith("/dashboard/departments"));

    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setSidebarOpen(desktop);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [router]);

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("user");
    router.push("/login");
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F6FB] text-slate-800">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-full flex-col border-r border-slate-800 bg-[#0F172A] text-slate-200 shadow-2xl shadow-slate-950/20 transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-[280px] translate-x-0" : "w-[280px] -translate-x-full lg:translate-x-0 lg:w-[90px]"}
        `}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-5">
          <h1 className="text-xl font-bold tracking-tight text-white">
            {sidebarOpen || isDesktop ? (
              <>
                Kids<span className="text-slate-300">College</span>
              </>
            ) : (
              "KC"
            )}
          </h1>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const hasChildren = "children" in item && item.children;
            return (
              <div key={item.href}>
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    onClick={closeSidebarOnMobile}
                    className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive || (hasChildren && departmentsOpen)
                        ? "bg-slate-800 text-white shadow-md shadow-slate-900/30"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <svg
                      className="h-5 w-5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.7}
                        d={item.icon}
                      />
                    </svg>
                    <span className={`${sidebarOpen ? "block" : "lg:hidden"}`}>{item.name}</span>
                  </Link>
                  {hasChildren && sidebarOpen && (
                    <button
                      type="button"
                      onClick={() => setDepartmentsOpen((open) => !open)}
                      className="-ml-11 mr-2 rounded p-1 text-slate-400 hover:text-white"
                      aria-label="Toggle department menu"
                    >
                      <svg className={`h-4 w-4 transition-transform ${departmentsOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>
                {hasChildren && departmentsOpen && sidebarOpen && (
                  <div className="ml-11 mt-1 space-y-1 border-l border-slate-700 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={closeSidebarOnMobile}
                        className={`block rounded-lg px-3 py-2 text-xs font-medium transition ${
                          pathname === child.href
                            ? "bg-slate-800 text-white"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4">
          {user && (
            <div className={`mb-3 px-2 ${sidebarOpen ? "block" : "lg:hidden"}`}>
              <p className="text-sm font-medium text-white">
                {user.firstName} {user.lastName}
              </p>
              <p className="mt-1 text-xs text-slate-400">{user.role}</p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className={`${sidebarOpen ? "inline" : "lg:hidden"}`}>Logout</span>
          </button>
        </div>
      </aside>

      <div
        className={`
          flex min-h-screen flex-1 flex-col transition-all duration-300
          ${sidebarOpen ? "lg:ml-[280px]" : "lg:ml-[90px]"}
        `}
      >
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open sidebar"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <h2 className="truncate text-lg font-semibold text-slate-800 sm:text-xl">
              {menuItems.find((item) => item.href === pathname)?.name || "Dashboard"}
            </h2>

            <div className="hidden text-sm font-medium text-slate-500 sm:block">
              School Management System
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}