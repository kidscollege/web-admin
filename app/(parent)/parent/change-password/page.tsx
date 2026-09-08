"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

export default function ParentChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      setMessage("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      if (err.response?.status === 401) {
        removeToken();
        router.push("/login");
        return;
      }
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-extrabold text-[#2E1A5A] mb-2">
        Change Password
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        Update your parent portal password
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-purple-100 p-6 space-y-4 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-purple-200 rounded-xl px-3 py-2.5 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7C3AED] font-medium"
            >
              {showCurrent ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-purple-200 rounded-xl px-3 py-2.5 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7C3AED] font-medium"
            >
              {showNew ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-purple-200 rounded-xl px-3 py-2.5 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7C3AED] font-medium"
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 rounded-xl p-3 text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 text-green-700 rounded-xl p-3 text-sm">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-2.5 rounded-full text-sm font-semibold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}