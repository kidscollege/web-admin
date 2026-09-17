import Link from "next/link";

export const metadata = {
  title: "System Status | Kids College",
  description: "Current development status and roadmap for the Kids College school management system.",
};

const completedAreas = [
  {
    title: "Timetable",
    detail: "Admin scheduling, teacher timetable views, conflict detection, tests, and sample-data cleanup are complete.",
  },
  {
    title: "Finance",
    detail: "Fee plans, invoices, payments, Paystack, installments, refunds, reconciliation, statements, scholarships, waivers, and reports are implemented.",
  },
  {
    title: "Admissions foundation",
    detail: "Public applications, tracking, controlled lifecycle stages, interviews, admission conversion, parent linking, and audit history are operational.",
  },
  {
    title: "Platform foundation",
    detail: "Authentication, role-based access, PostgreSQL/Prisma data management, dashboards, validation, and audit controls are in place.",
  },
];

const activeWork = [
  "Formal offer letters and admission documents",
  "Interview notes and outcomes",
  "Admission notifications and communication history",
  "Secure document storage and applicant reporting",
  "Duplicate applicant and admission deadline controls",
];

const remainingAreas = [
  {
    title: "Academics",
    detail: "Grading schemes, report cards, transcripts, result approval, promotion, class rollover, transfers, and academic analytics.",
  },
  {
    title: "Teacher portal",
    detail: "Gradebook, lesson planning, assignments, workload views, result workflows, notifications, and teacher reports.",
  },
  {
    title: "Parent and student portals",
    detail: "Results, attendance, timetables, assignments, fees, payments, receipts, statements, and notifications.",
  },
  {
    title: "Super Admin portal",
    detail: "User and role administration, permissions, school settings, audit review, integrations, backups, and system controls.",
  },
  {
    title: "Platform operations",
    detail: "Email/SMS notifications, secure file storage, PDF documents, exports, monitoring, backups, deployment, and end-to-end testing.",
  },
];

const deliveryOrder = [
  "Finish admissions communication, documents, and reports.",
  "Complete academics, grading, results, promotion, and report cards.",
  "Complete the teacher portal workflows.",
  "Expand parent and student self-service portals.",
  "Build the Super Admin portal and system settings.",
  "Complete procurement, HR, notifications, documents, and production operations.",
];

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7C3AED]">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-extrabold text-[#2E1A5A] sm:text-3xl">{title}</h2>
      <p className="mt-3 leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}

export default function StatusPage() {
  return (
    <div className="overflow-hidden">
      <section className="border-b border-purple-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-4xl">
            <p className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#7C3AED]">
              Owner&apos;s project brief
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-[#2E1A5A] sm:text-6xl">
              Kids College School Management System
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600 sm:text-xl">
              A live view of what the system contains, what has been completed, what is currently being developed, and what remains before production readiness.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-amber-100 px-4 py-2 font-semibold text-amber-800">Admissions phase active</span>
              <span className="rounded-full bg-emerald-100 px-4 py-2 font-semibold text-emerald-800">Finance hardened</span>
              <span className="rounded-full bg-blue-100 px-4 py-2 font-semibold text-blue-800">Updated 17 September 2026</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <SectionTitle
          eyebrow="The system"
          title="One platform for school operations"
          description="The product combines the school website, admissions, academics, attendance, finance, staff operations, teacher tools, parent access, and administrative dashboards in one role-controlled application."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Backend", "NestJS, Prisma, and PostgreSQL provide the business rules and system source of truth."],
            ["Web application", "Next.js, React, and TypeScript provide the public website and role dashboards."],
            ["Security", "JWT authentication, role guards, validation, and audit logs protect sensitive workflows."],
            ["Portals", "Admin, principal, bursary, HR, teacher, parent, public, and future student experiences."],
          ].map(([title, detail]) => (
            <div key={title} className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
              <h3 className="font-bold text-[#2E1A5A]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-purple-100 bg-[#F8F5FF]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <SectionTitle
            eyebrow="Completed"
            title="The strongest parts of the platform"
            description="These areas have been implemented, tested, and integrated into the current system foundation."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {completedAreas.map((area) => (
              <div key={area.title} className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">✓</span>
                  <div>
                    <h3 className="font-bold text-[#2E1A5A]">{area.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{area.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <SectionTitle
              eyebrow="In progress"
              title="Admissions workflow completion"
              description="The admissions lifecycle is already operational. The remaining work is focused on making it a complete professional workflow for applicants, parents, and school staff."
            />
            <div className="space-y-3">
              {activeWork.map((item) => (
                <div key={item} className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                  <span className="font-bold text-amber-600">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-[#2E1A5A] p-7 text-white shadow-xl shadow-purple-200 sm:p-9">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-purple-200">Owner view</p>
            <h2 className="mt-3 text-2xl font-extrabold">The project has moved beyond a basic prototype.</h2>
            <p className="mt-4 text-sm leading-relaxed text-purple-100">
              Finance has been treated as a high-risk operational area and hardened with transactional payments, refunds, installments, reconciliation, and audit controls. Timetable scheduling is complete. Admissions is the current delivery focus.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-purple-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <SectionTitle
            eyebrow="Roadmap"
            title="What remains to be built"
            description="The remaining work is organized around completing the school’s daily workflows and then adding the platform services needed for reliable production use."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {remainingAreas.map((area) => (
              <div key={area.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="font-bold text-[#2E1A5A]">{area.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{area.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <SectionTitle
          eyebrow="Recommended order"
          title="The next delivery sequence"
          description="Each phase should be completed and accepted by the school before the next major phase is closed."
        />
        <div className="grid gap-3 md:grid-cols-2">
          {deliveryOrder.map((item, index) => (
            <div key={item} className="flex gap-4 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 font-bold text-[#7C3AED]">{index + 1}</span>
              <p className="pt-1 text-sm leading-relaxed text-slate-700">{item}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-sm leading-relaxed text-blue-950">
          <strong>Production readiness:</strong> Before launch, the system also needs user acceptance testing with real school scenarios, secure document storage, notifications, backups, monitoring, deployment procedures, and broader end-to-end testing.
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-full bg-[#7C3AED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6D28D9]">Back to school website</Link>
          <Link href="/admissions" className="rounded-full border border-purple-200 px-5 py-3 text-sm font-semibold text-[#4B2E83] transition hover:bg-purple-50">View admissions</Link>
        </div>
      </section>
    </div>
  );
}
