import Link from "next/link";

const faqs = [
  {
    question: "What age groups do you admit?",
    answer:
      "We admit children across the nursery, primary, and secondary school stages, subject to the relevant admission requirements and available space.",
  },
  {
    question: "How do I apply for admission?",
    answer:
      "Parents can complete the online admission form through our admissions page and submit the required documents and information.",
  },
  {
    question: "Do you offer school transport?",
    answer:
      "Transport arrangements may be available depending on the route and school schedule. Please contact the school for current availability.",
  },
  {
    question: "What curriculum do you follow?",
    answer:
      "Kids College follows a strong academic curriculum designed to build foundational skills, creativity, and values-based learning.",
  },
  {
    question: "Can I visit the school before enrolling?",
    answer:
      "Yes. We welcome school visits and would be glad to show you around the campus and answer your questions.",
  },
  {
    question: "How do I contact the school?",
    answer:
      "You can reach us through the contact page or by calling the school office number listed in the website footer and contact section.",
  },
];

export default function FaqPage() {
  return (
    <div>
      <section className="bg-white border-b border-purple-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-[#7C3AED] text-sm font-semibold mb-2">Support</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2E1A5A]">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-500 mt-3 max-w-2xl">
            Answers to some of the common questions families ask about our school.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div className="space-y-5">
          {faqs.map((item) => (
            <div
              key={item.question}
              className="bg-white border border-purple-100 rounded-[1.5rem] p-6 shadow-sm"
            >
              <h2 className="text-lg font-extrabold text-[#2E1A5A] mb-2">{item.question}</h2>
              <p className="text-slate-600 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-[#F8F5FF] rounded-[2rem] border border-purple-100 p-8 text-center">
          <h2 className="text-2xl font-extrabold text-[#2E1A5A]">Still need help?</h2>
          <p className="text-slate-600 mt-2">
            Reach out to our admissions team and we will be happy to assist you.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/contact"
              className="bg-[#7C3AED] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#6D28D9] transition"
            >
              Contact Us
            </Link>
            <Link
              href="/admissions/apply"
              className="border border-purple-200 text-[#4B2E83] px-6 py-3 rounded-full font-semibold hover:bg-purple-50 transition"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
