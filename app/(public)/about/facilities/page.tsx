import Link from "next/link";

const facilities = [
  {
    title: "Bright Classrooms",
    description: "Comfortable learning spaces designed for focus, collaboration, and discovery.",
  },
  {
    title: "Library and Reading Areas",
    description: "A growing collection of age-appropriate books that encourages curiosity and independent learning.",
  },
  {
    title: "Science and ICT Spaces",
    description: "Practical spaces where learners can explore science, technology, and problem-solving.",
  },
  {
    title: "Outdoor Play Areas",
    description: "Safe, active spaces that support movement, teamwork, and healthy development.",
  },
];

export default function FacilitiesPage() {
  return (
    <div>
      <section className="border-b border-purple-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <Link href="/about" className="text-sm font-medium text-[#7C3AED] hover:underline">
            ← Back to About
          </Link>
          <p className="mt-6 text-sm font-semibold text-[#7C3AED]">About Us</p>
          <h1 className="mt-2 text-3xl font-extrabold text-[#2E1A5A] sm:text-4xl">
            Our Facilities
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">
            Purposeful spaces that help every learner feel supported, engaged, and ready to grow.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {facilities.map((facility) => (
            <article key={facility.title} className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#2E1A5A]">{facility.title}</h2>
              <p className="mt-3 leading-relaxed text-slate-600">{facility.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}