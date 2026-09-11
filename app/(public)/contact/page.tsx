"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    countryCode: "+234",
    phone: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.phone) {
      if (!/^\+\d{1,3}$/.test(form.countryCode)) {
        return;
      }

      if (!/^\d+$/.test(form.phone) || form.phone.length < 7 || form.phone.length > 14) {
        return;
      }

      if (form.countryCode === "+234" && form.phone.length !== 10) {
        return;
      }
    }

    setSent(true);
  };

  return (
    <div>
      {/* Header */}
      <section className="bg-white border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-[#7C3AED] text-sm font-semibold mb-2">Contact</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2E1A5A]">
            Contact Kids College
          </h1>
          <p className="text-slate-500 mt-3 max-w-2xl">
            We would love to hear from you. Reach out for admissions or general
            enquiries.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] border border-purple-100 p-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-[#2E1A5A] mb-4">
                School Information
              </h2>
              <div className="space-y-3 text-sm text-slate-600">
                <p>
                  <strong>Address:</strong> Trinity Avenue, Off Ugbor Road, Benin
                  City
                </p>
                <p>
                  <strong>Email:</strong> info@kidscollege.ng
                </p>
                <p>
                  <strong>Phone:</strong> +234 800 000 0000
                </p>
                <p>
                  <strong>Office Hours:</strong> Mon – Fri, 8:00 AM – 4:00 PM
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-purple-100 p-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-[#2E1A5A] mb-4">
                Admissions Enquiry
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                For admission questions, call the school office or send us a
                message using the form.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-[2rem] border border-purple-100 p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-[#2E1A5A] mb-4">
              Send a Message
            </h2>

            {sent ? (
              <div className="bg-purple-50 text-[#6D28D9] rounded-2xl p-4 text-sm">
                Thank you. Your message has been received. We will get back to
                you shortly.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-purple-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email *
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full border border-purple-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <div className="grid grid-cols-[minmax(96px,0.35fr)_1fr] gap-2">
                      <input
                        value={form.countryCode}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            countryCode: e.target.value.replace(/[^+\d]/g, "").slice(0, 4),
                          })
                        }
                        inputMode="tel"
                        maxLength={4}
                        placeholder="+234"
                        aria-label="Country code"
                        className="w-full border border-purple-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <input
                        value={form.phone}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            phone: e.target.value.replace(/\D/g, "").slice(0, 14),
                          })
                        }
                        inputMode="numeric"
                        maxLength={14}
                        placeholder="8012345678"
                        aria-label="Phone number without country code"
                        className="w-full border border-purple-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Nigeria requires 10 digits after +234. Other countries allow 7 to 14 digits.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full border border-purple-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-3 rounded-full text-sm font-semibold transition"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}