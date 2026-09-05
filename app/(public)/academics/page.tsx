export default function PublicAcademicsPage() {
  return (
    <div>
      <section className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <h1 className="text-3xl sm:text-4xl font-bold">Academics</h1>
          <p className="text-slate-500 mt-3 max-w-2xl">
            A structured academic journey from early years through senior secondary.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Early Years",
            desc: "Play-based foundation learning for Nursery and Kindergarten.",
          },
          {
            title: "Basic Education",
            desc: "Strong literacy, numeracy, and core subject development.",
          },
          {
            title: "Secondary School",
            desc: "Focused preparation for exams, leadership, and future careers.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}