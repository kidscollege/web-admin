"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender?: string;
  dateOfBirth?: string;
  status: string;
  currentClassId?: string | null;
  currentClass?: { name: string } | null;
  createdAt: string;
}

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [classes, setClasses] = useState<any[]>([]);

  const [form, setForm] = useState({
    firstName: "",
  lastName: "",
  middleName: "",
  gender: "Male",
  dateOfBirth: "",
  currentClassId: "",
  parentFirstName: "",
  parentLastName: "",
  parentPhone: "",
  parentEmail: "",
  relationship: "Father",
  });

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students", {
        params: { search: search || undefined, limit: 100 },
      });
      setStudents(res.data.data || []);
    } catch (err: any) {
      if (err.response?.status === 401) {
        removeToken();
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const token = getToken();
  if (!token) {
    router.push("/login");
    return;
  }

  const load = async () => {
    try {
      const classesRes = await api.get("/academics/classes");
      setClasses(classesRes.data || []);
    } catch (err) {
      // ignore class load error for now
    }
    fetchStudents();
  };

  load();
}, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetchStudents();
  };

  const openCreateModal = () => {
  setEditingStudent(null);
  setForm({
    firstName: "",
    lastName: "",
    middleName: "",
    gender: "Male",
    dateOfBirth: "",
    currentClassId: "",
    parentFirstName: "",
    parentLastName: "",
    parentPhone: "",
    parentEmail: "",
    relationship: "Father",
  });
  setShowModal(true);
};

const openEditModal = (student: Student) => {
  setEditingStudent(student);
  setForm({
    firstName: student.firstName || "",
    lastName: student.lastName || "",
    middleName: student.middleName || "",
    gender: student.gender || "Male",
    dateOfBirth: student.dateOfBirth
      ? student.dateOfBirth.split("T")[0]
      : "",
    currentClassId: student.currentClassId || "",
    parentFirstName: "",
    parentLastName: "",
    parentPhone: "",
    parentEmail: "",
    relationship: "Father",
  });
  setShowModal(true);
};
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);

  try {
    if (editingStudent) {
      await api.patch(`/students/${editingStudent.id}`, {
        firstName: form.firstName,
        lastName: form.lastName,
        middleName: form.middleName || undefined,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth || undefined,
        currentClassId: form.currentClassId || null,
      });
    } else {
      await api.post("/students", {
        ...form,
        currentClassId: form.currentClassId || undefined,
      });
    }

    setShowModal(false);
    setEditingStudent(null);
    fetchStudents();
  } catch (err: any) {
    alert(err.response?.data?.message || "Failed to save student");
  } finally {
    setSubmitting(false);
  }
};

  const handleDelete = async (student: Student) => {
    if (
      !confirm(
        `Are you sure you want to withdraw ${student.firstName} ${student.lastName}? This is a soft delete.`
      )
    ) {
      return;
    }

    try {
      await api.delete(`/students/${student.id}`);
      fetchStudents();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete student");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Students</h2>
          <p className="text-sm text-gray-500 mt-1">Manage all student records</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition w-full sm:w-auto"
        >
          + Add Student
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name or admission number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition w-full sm:w-auto"
          >
            Search
          </button>
        </div>
      </form>

      {/* Desktop Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hidden md:block">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No students found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Admission No</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Gender</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Class</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {student.admissionNumber}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {student.firstName} {student.middleName} {student.lastName}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{student.gender || "—"}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {student.currentClass?.name || "Unassigned"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          student.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : student.status === "WITHDRAWN"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => openEditModal(student)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        {student.status !== "WITHDRAWN" && (
                          <button
                            onClick={() => handleDelete(student)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Withdraw
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="p-8 text-center text-gray-500 bg-white rounded-xl">
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-white rounded-xl">
            No students found
          </div>
        ) : (
          students.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-800">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{student.admissionNumber}</p>
                </div>
                <span
                  className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                    student.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : student.status === "WITHDRAWN"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {student.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-1 mb-3">
                <p>Gender: {student.gender || "—"}</p>
                <p>Class: {student.currentClass?.name || "Unassigned"}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(student)}
                  className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg text-sm font-medium"
                >
                  Edit
                </button>
                {student.status !== "WITHDRAWN" && (
                  <button
                    onClick={() => handleDelete(student)}
                    className="flex-1 border border-red-600 text-red-600 py-2 rounded-lg text-sm font-medium"
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white">
              <h3 className="text-lg font-semibold">
                {editingStudent ? "Edit Student" : "Add New Student"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingStudent(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name *</label>
                  <input
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name *</label>
                  <input
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Middle Name</label>
                  <input
                    value={form.middleName}
                    onChange={(e) => setForm({ ...form, middleName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>


              <div>
  <label className="block text-sm font-medium mb-1">Class</label>
  <select
    value={form.currentClassId || ""}
    onChange={(e) =>
      setForm({
        ...form,
        currentClassId: e.target.value,
      })
    }
    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">Unassigned</option>
    {classes.map((cls: any) => (
      <option key={cls.id} value={cls.id}>
        {cls.name}
      </option>
    ))}
  </select>
</div>

              {/* Parent fields only when creating */}
              {!editingStudent && (
                <>
                  <hr />
                  <p className="text-sm font-medium text-gray-700">
                    Parent / Guardian Info
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Parent First Name
                      </label>
                      <input
                        value={form.parentFirstName}
                        onChange={(e) =>
                          setForm({ ...form, parentFirstName: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Parent Last Name
                      </label>
                      <input
                        value={form.parentLastName}
                        onChange={(e) =>
                          setForm({ ...form, parentLastName: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Parent Phone</label>
                      <input
                        value={form.parentPhone}
                        onChange={(e) =>
                          setForm({ ...form, parentPhone: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Relationship</label>
                      <select
                        value={form.relationship}
                        onChange={(e) =>
                          setForm({ ...form, relationship: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option>Father</option>
                        <option>Mother</option>
                        <option>Guardian</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingStudent(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : editingStudent
                    ? "Update Student"
                    : "Save Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}