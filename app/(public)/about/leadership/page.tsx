import Link from "next/link";

const leaders = [
  {
    name: "Mrs. Adebisi Okafor",
    role: "Principal",
    bio: "She leads the school with a focus on academic excellence, pastoral care, and student growth.",
  },
  {
    name: "Mr. Daniel Efe",
    role: "Academic Director",
    bio: "He oversees curriculum quality, teacher development, and student achievement standards.",
  },
  {
    name: "Mrs. Ifeoma Nwosu",
    role: "Pastoral Care Lead",
    bio: "She ensures a supportive and safe school environment for every child and family.",
  },
];

export default function LeadershipPage() {
  return (
    <div>
      <section className="bg-white border-b border-purple-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-[#7C3AED] text-sm font-semibold mb-2">About Us</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2E1A5A]">
            Leadership & Administration
          </h1>
          <p className="text-slate-500 mt-3 max-w-2xl">
            Our leadership team is committed to guiding a school culture rooted in
            care, excellence, and purpose.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-3 gap-6">
          {leaders.map((person) => (
            <div
              key={person.name}
              className="bg-white rounded-[2rem] border border-purple-100 p-6 shadow-sm"
            >
              <div className="w-14 h-14 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold text-xl mb-4">
                {person.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <h2 className="text-xl font-extrabold text-[#2E1A5A]">{person.name}</h2>
              <p className="text-sm font-semibold text-[#7C3AED] mt-1">{person.role}</p>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">{person.bio}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-[#F8F5FF] rounded-[2rem] border border-purple-100 p-8 text-center">
          <h2 className="text-2xl font-extrabold text-[#2E1A5A]">Our approach</h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            We combine strong governance, academic oversight, and a caring school
            culture to create a learning environment where children can thrive.
          </p>
          <Link
            href="/about"
            className="inline-block mt-6 bg-[#7C3AED] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#6D28D9] transition"
          >
            Back to About
          </Link>
        </div>
      </section>
    </div>
  );
}
