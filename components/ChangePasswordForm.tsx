"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

type ChangePasswordFormProps = {
  portalName: string;
};

export default function ChangePasswordForm({ portalName }: ChangePasswordFormProps) {
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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

    if (!getToken()) {
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
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      label: "Current Password",
      value: currentPassword,
      setValue: setCurrentPassword,
      visible: showCurrent,
      setVisible: setShowCurrent,
    },
    {
      label: "New Password",
      value: newPassword,
      setValue: setNewPassword,
      visible: showNew,
      setVisible: setShowNew,
    },
    {
      label: "Confirm New Password",
      value: confirmPassword,
      setValue: setConfirmPassword,
      visible: showConfirm,
      setVisible: setShowConfirm,
    },
  ];

  return (
    <div className="max-w-md">
      <h1 className="mb-2 text-2xl font-extrabold text-[#2E1A5A]">
        Change Password
      </h1>
      <p className="mb-6 text-sm text-slate-500">
        Update your {portalName} portal password
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm"
      >
        {fields.map((field) => (
          <div key={field.label}>
            <label className="mb-1 block text-sm font-medium">
              {field.label}
            </label>
            <div className="relative">
              <input
                type={field.visible ? "text" : "password"}
                required
                value={field.value}
                onChange={(event) => field.setValue(event.target.value)}
                className="w-full rounded-xl border border-purple-200 px-3 py-2.5 pr-16 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                type="button"
                onClick={() => field.setVisible(!field.visible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#7C3AED]"
              >
                {field.visible ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        ))}

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}
        {message && (
          <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{message}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#7C3AED] py-2.5 text-sm font-semibold text-white hover:bg-[#6D28D9] disabled:opacity-50"
        >
          {loading ? "Saving..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
