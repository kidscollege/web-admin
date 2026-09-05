"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function ProcurementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"suppliers" | "requests" | "inventory">(
    "suppliers"
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);

  // Modals
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [supplierForm, setSupplierForm] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
  });

  const [requestForm, setRequestForm] = useState({
    notes: "",
    items: [{ description: "", quantity: 1, unitPrice: 0 }],
  });

  const [inventoryForm, setInventoryForm] = useState({
    name: "",
    sku: "",
    category: "Stationery",
    quantity: 0,
    unit: "Pcs",
    minStock: 5,
    location: "",
  });

  const [stockForm, setStockForm] = useState({
    quantity: 0,
  });

  const fetchData = async () => {
    try {
      const [suppliersRes, requestsRes, inventoryRes, lowStockRes] =
        await Promise.all([
          api.get("/procurement/suppliers"),
          api.get("/procurement/requests"),
          api.get("/procurement/inventory"),
          api.get("/procurement/inventory/low-stock"),
        ]);

      setSuppliers(suppliersRes.data || []);
      setRequests(requestsRes.data || []);
      setInventory(inventoryRes.data || []);
      setLowStock(lowStockRes.data || []);
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
    fetchData();
  }, []);

  // ===== SUPPLIERS =====
  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/procurement/suppliers", supplierForm);
      setShowSupplierModal(false);
      setSupplierForm({
        name: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
      });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create supplier");
    } finally {
      setSubmitting(false);
    }
  };

  // ===== PURCHASE REQUESTS =====
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/procurement/requests", {
        notes: requestForm.notes || undefined,
        items: requestForm.items.map((item) => ({
          description: item.description,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        })),
      });
      setShowRequestModal(false);
      setRequestForm({
        notes: "",
        items: [{ description: "", quantity: 1, unitPrice: 0 }],
      });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create request");
    } finally {
      setSubmitting(false);
    }
  };

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/procurement/requests/${id}/status`, { status });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  // ===== INVENTORY =====
  const handleCreateInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/procurement/inventory", {
        ...inventoryForm,
        quantity: Number(inventoryForm.quantity),
        minStock: Number(inventoryForm.minStock),
      });
      setShowInventoryModal(false);
      setInventoryForm({
        name: "",
        sku: "",
        category: "Stationery",
        quantity: 0,
        unit: "Pcs",
        minStock: 5,
        location: "",
      });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create inventory item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setSubmitting(true);
    try {
      await api.patch(`/procurement/inventory/${selectedItem.id}/stock`, {
        quantity: Number(stockForm.quantity),
      });
      setShowStockModal(false);
      setSelectedItem(null);
      setStockForm({ quantity: 0 });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update stock");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-700";
      case "PENDING_APPROVAL":
        return "bg-amber-100 text-amber-700";
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      case "ORDERED":
        return "bg-blue-100 text-blue-700";
      case "RECEIVED":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const tabs = [
    { key: "suppliers", label: "Suppliers" },
    { key: "requests", label: "Purchase Requests" },
    { key: "inventory", label: "Inventory" },
  ] as const;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Procurement</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage suppliers, purchase requests and inventory
        </p>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 text-sm">
          <strong>{lowStock.length}</strong> item(s) are low on stock.
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
          Loading...
        </div>
      ) : (
        <>
          {/* ================= SUPPLIERS ================= */}
          {activeTab === "suppliers" && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowSupplierModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  + Add Supplier
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {suppliers.length === 0 ? (
                  <p className="text-gray-500 col-span-full">No suppliers found</p>
                ) : (
                  suppliers.map((s) => (
                    <div
                      key={s.id}
                      className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
                    >
                      <h3 className="font-semibold text-gray-800">{s.name}</h3>
                      <div className="text-sm text-gray-600 mt-2 space-y-1">
                        <p>Contact: {s.contactPerson || "—"}</p>
                        <p>Phone: {s.phone || "—"}</p>
                        <p>Email: {s.email || "—"}</p>
                        {s.address && <p>Address: {s.address}</p>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================= PURCHASE REQUESTS ================= */}
          {activeTab === "requests" && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  + New Request
                </button>
              </div>

              {/* Desktop */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hidden md:block">
                {requests.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No purchase requests found
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left px-6 py-3 font-medium text-gray-600">
                            Request No
                          </th>
                          <th className="text-left px-6 py-3 font-medium text-gray-600">
                            Total
                          </th>
                          <th className="text-left px-6 py-3 font-medium text-gray-600">
                            Status
                          </th>
                          <th className="text-left px-6 py-3 font-medium text-gray-600">
                            Notes
                          </th>
                          <th className="text-left px-6 py-3 font-medium text-gray-600">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {requests.map((r) => (
                          <tr key={r.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">{r.requestNo}</td>
                            <td className="px-6 py-4">
                              ₦{Number(r.totalAmount || 0).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  r.status
                                )}`}
                              >
                                {r.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {r.notes || "—"}
                            </td>
                            <td className="px-6 py-4">
                              {r.status === "DRAFT" && (
                                <button
                                  onClick={() =>
                                    updateRequestStatus(r.id, "PENDING_APPROVAL")
                                  }
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  Submit
                                </button>
                              )}
                              {r.status === "PENDING_APPROVAL" && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      updateRequestStatus(r.id, "APPROVED")
                                    }
                                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() =>
                                      updateRequestStatus(r.id, "REJECTED")
                                    }
                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Mobile */}
              <div className="md:hidden space-y-4">
                {requests.length === 0 ? (
                  <div className="bg-white rounded-xl p-6 text-center text-gray-500">
                    No purchase requests found
                  </div>
                ) : (
                  requests.map((r) => (
                    <div
                      key={r.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">{r.requestNo}</p>
                          <p className="text-sm text-gray-500">
                            ₦{Number(r.totalAmount || 0).toLocaleString()}
                          </p>
                        </div>
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            r.status
                          )}`}
                        >
                          {r.status}
                        </span>
                      </div>
                      {r.notes && (
                        <p className="text-sm text-gray-600 mb-3">{r.notes}</p>
                      )}
                      {r.status === "DRAFT" && (
                        <button
                          onClick={() =>
                            updateRequestStatus(r.id, "PENDING_APPROVAL")
                          }
                          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium"
                        >
                          Submit for Approval
                        </button>
                      )}
                      {r.status === "PENDING_APPROVAL" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateRequestStatus(r.id, "APPROVED")}
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateRequestStatus(r.id, "REJECTED")}
                            className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================= INVENTORY ================= */}
          {activeTab === "inventory" && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowInventoryModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  + Add Item
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {inventory.length === 0 ? (
                  <p className="text-gray-500 col-span-full">No inventory items</p>
                ) : (
                  inventory.map((item) => {
                    const isLow =
                      item.minStock != null && item.quantity <= item.minStock;
                    return (
                      <div
                        key={item.id}
                        className={`bg-white rounded-xl border p-5 shadow-sm ${
                          isLow ? "border-amber-300" : "border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          {isLow && (
                            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">
                              Low Stock
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                          <p>SKU: {item.sku || "—"}</p>
                          <p>Category: {item.category || "—"}</p>
                          <p>
                            Qty: <strong>{item.quantity}</strong> {item.unit || ""}
                          </p>
                          <p>Min Stock: {item.minStock ?? "—"}</p>
                          <p>Location: {item.location || "—"}</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setStockForm({ quantity: 0 });
                            setShowStockModal(true);
                          }}
                          className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg text-sm font-medium"
                        >
                          Update Stock
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* ===== SUPPLIER MODAL ===== */}
      {showSupplierModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold">Add Supplier</h3>
              <button
                onClick={() => setShowSupplierModal(false)}
                className="text-gray-400 text-xl"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateSupplier} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  required
                  value={supplierForm.name}
                  onChange={(e) =>
                    setSupplierForm({ ...supplierForm, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Contact Person
                </label>
                <input
                  value={supplierForm.contactPerson}
                  onChange={(e) =>
                    setSupplierForm({
                      ...supplierForm,
                      contactPerson: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    value={supplierForm.phone}
                    onChange={(e) =>
                      setSupplierForm({ ...supplierForm, phone: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={supplierForm.email}
                    onChange={(e) =>
                      setSupplierForm({ ...supplierForm, email: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  value={supplierForm.address}
                  onChange={(e) =>
                    setSupplierForm({ ...supplierForm, address: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSupplierModal(false)}
                  className="flex-1 border border-gray-300 py-2.5 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== REQUEST MODAL ===== */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold">New Purchase Request</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 text-xl"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateRequest} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Item Description *
                </label>
                <input
                  required
                  value={requestForm.items[0].description}
                  onChange={(e) =>
                    setRequestForm({
                      ...requestForm,
                      items: [
                        { ...requestForm.items[0], description: e.target.value },
                      ],
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={requestForm.items[0].quantity}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        items: [
                          {
                            ...requestForm.items[0],
                            quantity: Number(e.target.value),
                          },
                        ],
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Unit Price (₦) *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={requestForm.items[0].unitPrice}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        items: [
                          {
                            ...requestForm.items[0],
                            unitPrice: Number(e.target.value),
                          },
                        ],
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <input
                  value={requestForm.notes}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, notes: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 border border-gray-300 py-2.5 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Create Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== INVENTORY MODAL ===== */}
      {showInventoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold">Add Inventory Item</h3>
              <button
                onClick={() => setShowInventoryModal(false)}
                className="text-gray-400 text-xl"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateInventory} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  required
                  value={inventoryForm.name}
                  onChange={(e) =>
                    setInventoryForm({ ...inventoryForm, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">SKU</label>
                  <input
                    value={inventoryForm.sku}
                    onChange={(e) =>
                      setInventoryForm({ ...inventoryForm, sku: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={inventoryForm.category}
                    onChange={(e) =>
                      setInventoryForm({
                        ...inventoryForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Stationery</option>
                    <option>Cleaning</option>
                    <option>Sports</option>
                    <option>Lab Equipment</option>
                    <option>Furniture</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Qty</label>
                  <input
                    type="number"
                    value={inventoryForm.quantity}
                    onChange={(e) =>
                      setInventoryForm({
                        ...inventoryForm,
                        quantity: Number(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unit</label>
                  <input
                    value={inventoryForm.unit}
                    onChange={(e) =>
                      setInventoryForm({ ...inventoryForm, unit: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Min</label>
                  <input
                    type="number"
                    value={inventoryForm.minStock}
                    onChange={(e) =>
                      setInventoryForm({
                        ...inventoryForm,
                        minStock: Number(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  value={inventoryForm.location}
                  onChange={(e) =>
                    setInventoryForm({
                      ...inventoryForm,
                      location: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInventoryModal(false)}
                  className="flex-1 border border-gray-300 py-2.5 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== UPDATE STOCK MODAL ===== */}
      {showStockModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold">Update Stock</h3>
              <button
                onClick={() => {
                  setShowStockModal(false);
                  setSelectedItem(null);
                }}
                className="text-gray-400 text-xl"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateStock} className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <p>
                  Item: <strong>{selectedItem.name}</strong>
                </p>
                <p>
                  Current Qty: <strong>{selectedItem.quantity}</strong>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Quantity Change *
                </label>
                <input
                  required
                  type="number"
                  value={stockForm.quantity}
                  onChange={(e) =>
                    setStockForm({ quantity: Number(e.target.value) })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use positive number to add stock, negative to remove (e.g. 10 or
                  -5)
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowStockModal(false);
                    setSelectedItem(null);
                  }}
                  className="flex-1 border border-gray-300 py-2.5 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}