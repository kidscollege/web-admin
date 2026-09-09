const events = [
  {
    title: "School Open Day",
    date: "12 October 2026",
    summary: "Families are invited to explore classrooms, meet teachers, and learn more about the school experience.",
  },
  {
    title: "Inter-House Sports Festival",
    date: "22 November 2026",
    summary: "Students compete in a day of teamwork, fitness, and school spirit.",
  },
  {
    title: "STEM & Innovation Week",
    date: "15 January 2027",
    summary: "A week of creative projects, science challenges, and student-led exploration.",
  },
];

export default function NewsEventsPage() {
  return (
    <div>
      <section className="bg-white border-b border-purple-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-[#7C3AED] text-sm font-semibold mb-2">News & Events</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2E1A5A]">
            News & Events
          </h1>
          <p className="text-slate-500 mt-3 max-w-2xl">
            Stay connected with the school community and the latest happenings.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="space-y-6">
          {events.map((event) => (
            <div
              key={event.title}
              className="bg-white rounded-[2rem] border border-purple-100 p-6 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-2xl font-extrabold text-[#2E1A5A]">{event.title}</h2>
                <span className="inline-flex rounded-full bg-purple-100 text-[#7C3AED] px-3 py-1 text-xs font-semibold">
                  {event.date}
                </span>
              </div>
              <p className="mt-4 text-slate-600 leading-relaxed">{event.summary}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
