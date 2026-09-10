"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function StaffPage() {
  const router = useRouter();
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

 const [form, setForm] = useState({
  firstName: "",
  lastName: "",
  middleName: "",
  gender: "Male",
  phone: "",
  email: "",
  designation: "Teacher",
  employmentDate: "",
  address: "",
  createLogin: true,
  role: "TEACHER",
});

  const fetchStaff = async () => {
    try {
      const res = await api.get("/hr/staff", {
        params: { search: search || undefined },
      });
      setStaffList(res.data || []);
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
    fetchStaff();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetchStaff();
  };

  const openCreateModal = () => {
    setEditingStaff(null);
    setForm({
     firstName: "",
  lastName: "",
  middleName: "",
  gender: "Male",
  phone: "",
  email: "",
  designation: "Teacher",
  employmentDate: "",
  address: "",
  createLogin: true,
  role: "TEACHER",
    });
    setShowModal(true);
  };

  const openEditModal = (staff: any) => {
    setEditingStaff(staff);
    setForm({
      firstName: staff.firstName || "",
      lastName: staff.lastName || "",
      middleName: staff.middleName || "",
      gender: staff.gender || "Male",
      phone: staff.phone || "",
      email: staff.email || "",
      designation: staff.designation || "Teacher",
      employmentDate: staff.employmentDate
        ? staff.employmentDate.split("T")[0]
        : "",
      address: staff.address || "",
      createLogin: false,
      role: staff.role || "TEACHER",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);

  try {
    if (editingStaff) {
      await api.patch(`/hr/staff/${editingStaff.id}`, {
        firstName: form.firstName,
        lastName: form.lastName,
        middleName: form.middleName || undefined,
        gender: form.gender,
        phone: form.phone || undefined,
        email: form.email || undefined,
        designation: form.designation,
        employmentDate: form.employmentDate || undefined,
        address: form.address || undefined,
      });
      alert("Staff updated successfully");
    } else {
      const res = await api.post("/hr/staff", {
        firstName: form.firstName,
        lastName: form.lastName,
        middleName: form.middleName || undefined,
        gender: form.gender,
        phone: form.phone || undefined,
        email: form.email || undefined,
        designation: form.designation,
        employmentDate: form.employmentDate || undefined,
        address: form.address || undefined,
        createLogin: form.createLogin,
        role: form.role,
      });

      const login = res.data?.login;
      if (login?.temporaryPassword) {
        alert(
          `Staff created successfully.\n\nLogin Email: ${login.email}\nTemporary Password: ${login.temporaryPassword}\n\nCopy and share this password now.`
        );
      } else {
        alert("Staff created successfully");
      }
    }

    setShowModal(false);
    setEditingStaff(null);
    fetchStaff();
  } catch (err: any) {
    alert(err.response?.data?.message || "Failed to save staff");
  } finally {
    setSubmitting(false);
  }
};

  const handleDelete = async (staff: any) => {
    if (
      !confirm(
        `Are you sure you want to terminate ${staff.firstName} ${staff.lastName}? This is a soft delete.`
      )
    ) {
      return;
    }

    try {
      await api.delete(`/hr/staff/${staff.id}`);
      fetchStaff();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete staff");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "ON_LEAVE":
        return "bg-amber-100 text-amber-700";
      case "SUSPENDED":
        return "bg-red-100 text-red-700";
      case "TERMINATED":
      case "RESIGNED":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Staff</h2>
          <p className="text-sm text-gray-500 mt-1">Manage school staff records</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition w-full sm:w-auto"
        >
          + Add Staff
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name, staff number or email..."
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
          <div className="p-8 text-center text-gray-500">Loading staff...</div>
        ) : staffList.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No staff found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Staff No</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Designation</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Phone</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {staff.staffNumber}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {staff.firstName} {staff.middleName} {staff.lastName}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {staff.designation || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{staff.phone || "—"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          staff.status
                        )}`}
                      >
                        {staff.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => openEditModal(staff)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        {staff.status !== "TERMINATED" && staff.status !== "RESIGNED" && (
                          <button
                            onClick={() => handleDelete(staff)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Terminate
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
            Loading staff...
          </div>
        ) : staffList.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-white rounded-xl">
            No staff found
          </div>
        ) : (
          staffList.map((staff) => (
            <div
              key={staff.id}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-800">
                    {staff.firstName} {staff.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{staff.staffNumber}</p>
                </div>
                <span
                  className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    staff.status
                  )}`}
                >
                  {staff.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-1 mb-3">
                <p>Designation: {staff.designation || "—"}</p>
                <p>Phone: {staff.phone || "—"}</p>
                {staff.email && <p>Email: {staff.email}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(staff)}
                  className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg text-sm font-medium"
                >
                  Edit
                </button>
                {staff.status !== "TERMINATED" && staff.status !== "RESIGNED" && (
                  <button
                    onClick={() => handleDelete(staff)}
                    className="flex-1 border border-red-600 text-red-600 py-2 rounded-lg text-sm font-medium"
                  >
                    Terminate
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
                {editingStaff ? "Edit Staff" : "Add New Staff"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingStaff(null);
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Designation</label>
                  <select
                    value={form.designation}
                    onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Teacher</option>
                    <option>Senior Teacher</option>
                    <option>Principal</option>
                    <option>Vice Principal</option>
                    <option>Bursar</option>
                    <option>Admin</option>
                    <option>HR</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Employment Date</label>
                  <input
                    type="date"
                    value={form.employmentDate}
                    onChange={(e) =>
                      setForm({ ...form, employmentDate: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

{!editingStaff && (
  <>
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={form.createLogin}
        onChange={(e) =>
          setForm({ ...form, createLogin: e.target.checked })
        }
      />
      Create login account
    </label>

    {form.createLogin && (
      <div>
        <label className="block text-sm font-medium mb-1">Login Role</label>
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="TEACHER">Teacher</option>
          <option value="BURSAR">Bursar</option>
          <option value="PRINCIPAL">Principal</option>
          <option value="HR_ADMIN">HR Admin</option>
          <option value="MANAGEMENT">Management</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Email is required when creating login.
        </p>
      </div>
    )}
  </>
)}




              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingStaff(null);
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
                    : editingStaff
                    ? "Update Staff"
                    : "Save Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}