import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-flex rounded-full bg-purple-100 text-[#7C3AED] px-3 py-1 text-xs font-semibold mb-4">
              Welcome to Kids College
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#2E1A5A] leading-tight">
              First Among
              <span className="block text-[#7C3AED]">Equals</span>
            </h1>
            <p className="mt-5 text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
              We raise confident children through strong academics, character
              formation, and a caring school environment in Benin City.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/admissions/apply"
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-6 py-3 rounded-full font-semibold text-center transition"
              >
                Apply for Admission
              </Link>
              <Link
                href="/about"
                className="border border-purple-200 text-[#4B2E83] px-6 py-3 rounded-full font-semibold text-center hover:bg-purple-50 transition"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute -top-6 -right-4 w-28 h-28 rounded-full bg-yellow-200/70 blur-xl" />
            <div className="absolute bottom-4 -left-4 w-24 h-24 rounded-full bg-purple-200/80 blur-xl" />
            <div className="relative bg-white rounded-[2rem] p-4 shadow-xl shadow-purple-100 border border-purple-50">
              <Image
                src="/logo.png"
                alt="Kids College"
                width={320}
                height={320}
                className="rounded-[1.5rem] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              title: "Strong Academics",
              desc: "A structured curriculum that builds confidence from early years to secondary.",
            },
            {
              title: "Caring Teachers",
              desc: "Dedicated educators focused on both learning and character.",
            },
            {
              title: "Safe Environment",
              desc: "A nurturing school community where every child can thrive.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-3xl border border-purple-100 p-6 shadow-sm"
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
      </section>

      {/* Levels */}
      <section className="bg-white border-y border-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[#2E1A5A]">Our School</h2>
            <p className="text-slate-500 mt-2">
              Learning pathways for every stage
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Nursery",
              "Kindergarten",
              "Lower Basic",
              "Middle Basic",
              "Junior Secondary",
              "Senior Secondary",
            ].map((level) => (
              <div
                key={level}
                className="rounded-3xl bg-[#F8F5FF] border border-purple-100 p-5 text-center"
              >
                <p className="font-semibold text-[#4B2E83]">{level}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Speech style section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="bg-white rounded-[2rem] border border-purple-100 p-7 sm:p-9 shadow-sm">
            <p className="text-[#7C3AED] font-semibold mb-3">Principal’s Welcome</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2E1A5A] mb-4">
              A place where every child is seen, guided, and inspired.
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              At Kids College, we combine academic excellence with character
              development. Our goal is to raise confident learners who are
              prepared for the future and grounded in strong values.
            </p>
            <Link
              href="/about"
              className="inline-block mt-6 bg-[#7C3AED] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#6D28D9] transition"
            >
              Read More
            </Link>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-yellow-50 rounded-[2rem] p-8 min-h-[280px] flex items-center justify-center border border-purple-100">
            <div className="text-center">
              <Image
                src="/logo.png"
                alt="Kids College"
                width={160}
                height={160}
                className="mx-auto mb-4"
              />
              <p className="font-bold text-[#2E1A5A]">Kids College</p>
              <p className="text-sm text-slate-500">Benin City</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="rounded-[2rem] bg-[#7C3AED] text-white p-8 sm:p-12 text-center shadow-xl shadow-purple-200">
          <h2 className="text-3xl font-extrabold">Admissions Now Open</h2>
          <p className="text-purple-100 mt-3 max-w-2xl mx-auto">
            Give your child a strong foundation at Kids College. Submit an
            application online in minutes.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/admissions/apply"
              className="bg-white text-[#7C3AED] px-6 py-3 rounded-full font-semibold hover:bg-purple-50 transition"
            >
              Apply Now
            </Link>
            <Link
              href="/contact"
              className="border border-white/30 px-6 py-3 rounded-full font-semibold hover:bg-white/10 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}