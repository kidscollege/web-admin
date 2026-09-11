"use client";

import { useState } from "react";

type CredentialModalProps = {
  title: string;
  email: string;
  temporaryPassword: string;
  onClose: () => void;
};

export default function CredentialModal({
  title,
  email,
  temporaryPassword,
  onClose,
}: CredentialModalProps) {
  const [copied, setCopied] = useState(false);

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(temporaryPassword);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="credential-modal-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#7C3AED]">
              Login created
            </p>
            <h2 id="credential-modal-title" className="mt-1 text-xl font-extrabold text-[#2E1A5A]">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close credential dialog"
            className="rounded-full p-1 text-xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            &times;
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <p className="text-xs font-medium text-slate-500">Login email</p>
            <p className="mt-1 break-all text-sm font-semibold text-slate-800">{email}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500">Temporary password</p>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-purple-100 bg-purple-50 p-2">
              <code className="min-w-0 flex-1 break-all px-2 text-sm font-semibold text-[#2E1A5A]">
                {temporaryPassword}
              </code>
              <button
                type="button"
                onClick={copyPassword}
                aria-label="Copy temporary password"
                title="Copy password"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#7C3AED] shadow-sm hover:bg-purple-100"
              >
                {copied ? (
                  <span className="text-xs font-bold">✓</span>
                ) : (
                  <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="11" height="11" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Copy and share this password securely. It may not be shown again.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#6D28D9]"
        >
          Done
        </button>
      </div>
    </div>
  );
}
