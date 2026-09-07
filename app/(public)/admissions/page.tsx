import Link from "next/link";

export default function AdmissionsPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-white border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-[#7C3AED] text-sm font-semibold mb-2">Admissions</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2E1A5A]">
            Join the Kids College Family
          </h1>
          <p className="text-slate-500 mt-3 max-w-2xl">
            Start your child’s journey with a school committed to excellence,
            character, and care.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-12">
        {/* Process */}
        <div>
          <h2 className="text-2xl font-extrabold text-[#2E1A5A] mb-6">
            Admission Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                step: "1",
                title: "Submit Application",
                desc: "Fill the online form with student and parent details.",
              },
              {
                step: "2",
                title: "Review",
                desc: "Our admissions team reviews the application carefully.",
              },
              {
                step: "3",
                title: "Approval",
                desc: "Successful applicants are approved for admission.",
              },
              {
                step: "4",
                title: "Enrollment",
                desc: "Complete enrollment and join the school community.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-[2rem] border border-purple-100 p-5 shadow-sm"
              >
                <div className="w-9 h-9 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-sm font-bold mb-3">
                  {item.step}
                </div>
                <h3 className="font-bold text-[#2E1A5A] mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[2rem] border border-purple-100 p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-[#2E1A5A] mb-4">
              Who Can Apply?
            </h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Nursery and Kindergarten pupils</li>
              <li>• Primary 1-3 students</li>
              <li>• Primary 4-6 students</li>
              <li>• Junior and Senior Secondary students</li>
            </ul>
          </div>

          <div className="bg-white rounded-[2rem] border border-purple-100 p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-[#2E1A5A] mb-4">
              Documents Needed
            </h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Birth certificate</li>
              <li>• Passport photograph</li>
              <li>• Previous school report (if applicable)</li>
              <li>• Parent/Guardian contact details</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#7C3AED] text-white rounded-[2rem] p-8 text-center shadow-lg shadow-purple-200">
          <h2 className="text-2xl font-extrabold">Ready to Apply?</h2>
          <p className="text-purple-100 mt-2">
            Submit your application online in a few minutes.
          </p>
          <Link
            href="/admissions/apply"
            className="inline-block mt-6 bg-white text-[#7C3AED] px-6 py-3 rounded-full font-semibold hover:bg-purple-50 transition"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </div>
  );
}