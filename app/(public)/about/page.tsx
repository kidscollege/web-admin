import Link from "next/link";

export default function AboutPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-white border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-[#7C3AED] text-sm font-semibold mb-2">About Us</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2E1A5A]">
            About Kids College
          </h1>
          <p className="text-slate-500 mt-3 max-w-2xl">
            A nurturing school community in Benin City raising confident learners
            through academics, character, and care.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[2rem] border border-purple-100 p-7 shadow-sm">
            <h2 className="text-2xl font-extrabold text-[#2E1A5A] mb-3">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              To provide a safe and inspiring learning environment where every
              child can grow academically, develop strong character, and build
              confidence for the future.
            </p>
          </div>

          <div className="bg-white rounded-[2rem] border border-purple-100 p-7 shadow-sm">
            <h2 className="text-2xl font-extrabold text-[#2E1A5A] mb-3">Our Vision</h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              To be a leading school known for raising disciplined, creative, and
              future-ready students who stand out as first among equals.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-[#2E1A5A] mb-6">
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: "Quality Teaching",
                desc: "Experienced teachers committed to both academic success and personal growth.",
              },
              {
                title: "Safe Environment",
                desc: "A secure and supportive school culture where children feel valued.",
              },
              {
                title: "Holistic Learning",
                desc: "We balance academics with character, creativity, and leadership.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-[2rem] border border-purple-100 p-6 shadow-sm"
              >
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold mb-4">
                  ★
                </div>
                <h3 className="font-bold text-lg text-[#2E1A5A] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#7C3AED] text-white rounded-[2rem] p-8 text-center">
          <h2 className="text-2xl font-extrabold">Ready to join Kids College?</h2>
          <p className="text-purple-100 mt-2">
            Applications are open for the new academic session.
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