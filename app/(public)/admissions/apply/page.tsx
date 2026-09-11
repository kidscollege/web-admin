"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function ApplyPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<any>(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    gender: "Male",
    dateOfBirth: "",
    applyingClass: "Nursery",
    parentName: "",
    countryCode: "+234",
    parentPhone: "",
    parentEmail: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(null);

    const countryCode = form.countryCode.trim();
    const subscriberNumber = form.parentPhone.trim();

    if (!/^\+\d{1,3}$/.test(countryCode)) {
      setError("Enter a valid country code, for example +234.");
      setSubmitting(false);
      return;
    }

    if (!/^\d+$/.test(subscriberNumber)) {
      setError("Phone number must contain digits only.");
      setSubmitting(false);
      return;
    }

    if (countryCode === "+234" && subscriberNumber.length !== 10) {
      setError("Nigerian phone numbers must contain exactly 10 digits after +234.");
      setSubmitting(false);
      return;
    }

    if (subscriberNumber.length < 7 || subscriberNumber.length > 14) {
      setError("Enter a valid phone number with 7 to 14 digits after the country code.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await api.post("/admissions/applications", {
        firstName: form.firstName,
        lastName: form.lastName,
        middleName: form.middleName || undefined,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth || undefined,
        applyingClass: form.applyingClass,
        parentName: form.parentName || undefined,
        parentPhone: `${countryCode}${subscriberNumber}`,
        parentEmail: form.parentEmail || undefined,
        notes: form.notes || undefined,
      });

      setSuccess(res.data);
      setForm({
        firstName: "",
        lastName: "",
        middleName: "",
        gender: "Male",
        dateOfBirth: "",
        applyingClass: "Nursery",
        parentName: "",
        countryCode: "+234",
        parentPhone: "",
        parentEmail: "",
        notes: "",
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to submit application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <Link
            href="/admissions"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Admissions
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mt-3">Apply Now</h1>
          <p className="text-gray-500 mt-2 max-w-2xl">
            Fill the form below to submit an admission application for your child.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {success ? (
          <div className="bg-white border border-green-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-green-700 mb-2">
              Application Submitted Successfully
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Thank you. Your application has been received and is now being
              reviewed by the kids college admissions team.
            </p>
            <div className="bg-green-50 rounded-xl p-4 text-sm text-green-800 space-y-1">
              <p>
                <strong>Application No:</strong> {success.applicationNo}
              </p>
              <p>
                <strong>Applicant:</strong> {success.firstName} {success.lastName}
              </p>
              <p>
                <strong>Status:</strong> {success.status}
              </p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setSuccess(null)}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Submit Another Application
              </button>
              <Link
                href="/"
                className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium text-center hover:bg-gray-50"
              >
                Back to Home
              </Link>

              <Link
  href="/admissions/track"
  className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium text-center hover:bg-gray-50"
>
  Track Application Status
</Link> 
              
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">
            {error && (
              <div className="mb-4 bg-red-50 text-red-700 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h2 className="font-semibold text-lg mb-3">Student Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      First Name *
                    </label>
                    <input
                      required
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Last Name *
                    </label>
                    <input
                      required
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Middle Name
                    </label>
                    <input
                      value={form.middleName}
                      onChange={(e) =>
                        setForm({ ...form, middleName: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Gender *</label>
                    <select
                      value={form.gender}
                      onChange={(e) =>
                        setForm({ ...form, gender: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(e) =>
                        setForm({ ...form, dateOfBirth: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Class Applying For *
                    </label>
                    <select
                      required
                      value={form.applyingClass}
                      onChange={(e) =>
                        setForm({ ...form, applyingClass: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Kindergarten 1">KG 1</option>
                      <option value="Kindergarten 2">KG 2</option>
                      <option value="Nursery 1">Nursery 1</option>
                      <option value="Nursery 2">Nursery 2</option>
                      <option value="Nursery 3">Nursery 3</option>
                      <option value="Primary 1">Primary 1</option>
                      <option value="Primary 2">Primary 2</option>
                      <option value="Primary 3">Primary 3</option>
                      <option value="Primary 4">Primary 4</option>
                      <option value="Primary 5">Primary 5</option>
                      <option value="Primary 6">Primary 6</option>
                      <option value="JS 1">JS 1</option>
                      <option value="JS 2">JS 2</option>
                      <option value="JSS 3">JS 3</option>
                      <option value="SS 1">SS 1</option>
                      <option value="SS 2">SS 2</option>
                      <option value="SS 3">SS 3</option>
                    </select>
                  </div>
                </div>
              </div>

              <hr />

              <div>
                <h2 className="font-semibold text-lg mb-3">
                  Parent / Guardian Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Parent Full Name *
                    </label>
                    <input
                      required
                      value={form.parentName}
                      onChange={(e) =>
                        setForm({ ...form, parentName: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1">
                        Parent Phone *
                      </label>
                      <div className="grid grid-cols-[minmax(96px,0.35fr)_1fr] gap-2">
                        <input
                          required
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
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          required
                          value={form.parentPhone}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              parentPhone: e.target.value.replace(/\D/g, "").slice(0, 14),
                            })
                          }
                          inputMode="numeric"
                          maxLength={14}
                          placeholder="8012345678"
                          aria-label="Phone number without country code"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Enter the country code separately. Nigeria requires 10 digits after +234.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Parent Email
                      </label>
                      <input
                        type="email"
                        value={form.parentEmail}
                        onChange={(e) =>
                          setForm({ ...form, parentEmail: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Additional Notes
                </label>
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any extra information the school should know"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-semibold transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}