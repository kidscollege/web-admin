import Link from "next/link";

export default function OurStoryPage() {
  return (
    <div>
      <section className="bg-white border-b border-purple-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-[#7C3AED] text-sm font-semibold mb-2">About Us</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2E1A5A]">
            Our Story
          </h1>
          <p className="text-slate-500 mt-3 max-w-2xl">
            Kids College began with a simple vision: to raise children who are
            confident, compassionate, and prepared for the world ahead.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 space-y-8">
        <div className="bg-white rounded-[2rem] border border-purple-100 p-8 shadow-sm">
          <p className="text-slate-600 leading-relaxed text-base">
            Established to provide a nurturing and academically rigorous school
            experience, Kids College has grown into a place where children are
            encouraged to learn, lead, create, and serve. We believe a strong
            school foundation should develop the mind, character, and confidence
            of every learner.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#F8F5FF] rounded-[2rem] p-6 border border-purple-100">
            <h2 className="text-xl font-extrabold text-[#2E1A5A] mb-3">How we started</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              We started with a clear mission to offer a child-centered education
              rooted in values, excellence, and care. Over the years, our school
              community has grown while staying true to those original principles.
            </p>
          </div>

          <div className="bg-[#F8F5FF] rounded-[2rem] p-6 border border-purple-100">
            <h2 className="text-xl font-extrabold text-[#2E1A5A] mb-3">What we stand for</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              We stand for academic excellence, discipline, creativity, and a warm
              environment where every child feels seen, valued, and supported.
            </p>
          </div>
        </div>

        <div className="bg-[#7C3AED] text-white rounded-[2rem] p-8 text-center">
          <h2 className="text-2xl font-extrabold">A growing legacy of excellence</h2>
          <p className="text-purple-100 mt-2 max-w-2xl mx-auto">
            We continue to build a school community where children are inspired to
            become thoughtful leaders and lifelong learners.
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
