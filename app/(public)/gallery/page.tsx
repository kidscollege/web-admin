const galleryItems = [
  { title: "School Community", image: "/logo.png" },
  { title: "Learning Spaces", image: "/logo.png" },
  { title: "Student Life", image: "/logo.png" },
  { title: "Creative Activities", image: "/logo.png" },
  { title: "Campus Moments", image: "/logo.png" },
  { title: "School Events", image: "/logo.png" },
];

export default function GalleryPage() {
  return (
    <div>
      <section className="bg-white border-b border-purple-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-[#7C3AED] text-sm font-semibold mb-2">Gallery</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2E1A5A]">
            School Gallery
          </h1>
          <p className="text-slate-500 mt-3 max-w-2xl">
            A glimpse into life, learning, and community at Kids College.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-[2rem] overflow-hidden border border-purple-100 shadow-sm"
            >
              <div className="h-60 bg-gradient-to-br from-purple-100 to-yellow-50 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-28 h-28 object-contain"
                />
              </div>
              <div className="p-5">
                <h2 className="text-lg font-extrabold text-[#2E1A5A]">{item.title}</h2>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
