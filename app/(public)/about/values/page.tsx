import Link from "next/link";

const values = [
  {
    title: "Excellence",
    description: "We strive for the highest standard in learning, character, and service.",
  },
  {
    title: "Integrity",
    description: "We teach honesty, accountability, and respect in every interaction.",
  },
  {
    title: "Compassion",
    description: "We create a caring environment where each child feels valued and supported.",
  },
  {
    title: "Discipline",
    description: "We nurture responsibility, focus, and consistent effort in school life.",
  },
  {
    title: "Creativity",
    description: "We encourage innovation, imagination, and confidence in expression.",
  },
  {
    title: "Community",
    description: "We build a school culture where families, teachers, and students work together.",
  },
];

export default function ValuesPage() {
  return (
    <div>
      <section className="bg-white border-b border-purple-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-[#7C3AED] text-sm font-semibold mb-2">About Us</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2E1A5A]">
            Our Values
          </h1>
          <p className="text-slate-500 mt-3 max-w-2xl">
            The values we teach shape the kind of people our learners become.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-white rounded-[2rem] border border-purple-100 p-6 shadow-sm"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold mb-4">
                ★
              </div>
              <h2 className="text-xl font-extrabold text-[#2E1A5A] mb-2">{value.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-[#7C3AED] text-white rounded-[2rem] p-8 text-center">
          <h2 className="text-2xl font-extrabold">Values that shape our future</h2>
          <p className="text-purple-100 mt-2 max-w-2xl mx-auto">
            We believe strong character and sound learning go hand in hand.
          </p>
          <Link
            href="/about"
            className="inline-block mt-6 bg-white text-[#7C3AED] px-6 py-3 rounded-full font-semibold hover:bg-purple-50 transition"
          >
            Back to About
          </Link>
        </div>
      </section>
    </div>
  );
}
