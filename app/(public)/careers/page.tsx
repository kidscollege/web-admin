import Link from "next/link";

const roles = [
  {
    title: "Primary School Teacher",
    summary: "Teach and mentor learners in a supportive, standards-based environment.",
  },
  {
    title: "Secondary School Teacher",
    summary: "Guide learners through academic growth, assessment, and character development.",
  },
  {
    title: "School Administrator",
    summary: "Support school operations, family engagement, and day-to-day coordination.",
  },
  {
    title: "Support Staff",
    summary: "Contribute to the smooth running of school experiences and services.",
  },
];

export default function CareersPage() {
  return (
    <div>
      <section className="bg-white border-b border-purple-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-[#7C3AED] text-sm font-semibold mb-2">Careers</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2E1A5A]">
            Join the Kids College Team
          </h1>
          <p className="text-slate-500 mt-3 max-w-2xl">
            We are building a school community of educators and professionals who
            are passionate about helping children thrive.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <div
              key={role.title}
              className="bg-white rounded-[2rem] border border-purple-100 p-6 shadow-sm"
            >
              <h2 className="text-xl font-extrabold text-[#2E1A5A] mb-3">{role.title}</h2>
              <p className="text-slate-600 leading-relaxed text-sm">{role.summary}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-[#F8F5FF] rounded-[2rem] border border-purple-100 p-8 text-center">
          <h2 className="text-2xl font-extrabold text-[#2E1A5A]">Interested in working with us?</h2>
          <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
            Send your CV and a short introduction to the school admin office. We would consider
            passionate and qualified candidates for available roles.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/contact"
              className="bg-[#7C3AED] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#6D28D9] transition"
            >
              Contact Hiring Team
            </Link>
            <Link
              href="/about"
              className="border border-purple-200 text-[#4B2E83] px-6 py-3 rounded-full font-semibold hover:bg-purple-50 transition"
            >
              Learn About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
