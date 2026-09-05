"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Academics", href: "/academics" },
  { name: "Admissions", href: "/admissions" },
  { name: "Contact", href: "/contact" },
];

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F8F5FF] text-slate-800">
      {/* Top strip */}
      <div className="bg-[#4B2E83] text-white text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <p>Admissions Open for 2025/2026 Session</p>
          <p className="text-purple-100">
            Trinity Avenue, Off Ugbor Road, Benin City · +234 800 000 0000
          </p>
        </div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Kids College Logo"
              width={48}
              height={48}
              className="rounded-full object-contain"
            />
            <div className="leading-tight">
              <p className="font-bold text-[#4B2E83] text-lg">Kids College</p>
              <p className="text-[11px] text-slate-500">First Among Equals</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition ${
                  pathname === link.href
                    ? "text-[#7C3AED]"
                    : "text-slate-600 hover:text-[#7C3AED]"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/admissions/apply"
              className="bg-[#7C3AED] text-white px-4 py-2 rounded-full hover:bg-[#6D28D9] transition"
            >
              Apply Now
            </Link>
            <Link
              href="/login"
              className="border border-purple-200 text-[#4B2E83] px-4 py-2 rounded-full hover:bg-purple-50 transition"
            >
              Staff Login
            </Link>
          </nav>

          {/* Mobile button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-xl border border-purple-200 text-[#4B2E83]"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-purple-100 bg-white">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-medium ${
                    pathname === link.href
                      ? "bg-purple-50 text-[#7C3AED]"
                      : "text-slate-700 hover:bg-purple-50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/admissions/apply"
                onClick={() => setOpen(false)}
                className="block text-center bg-[#7C3AED] text-white px-3 py-2.5 rounded-full text-sm font-medium"
              >
                Apply Now
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block text-center border border-purple-200 text-[#4B2E83] px-3 py-2.5 rounded-full text-sm font-medium"
              >
                Staff Login
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-[#2E1A5A] text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="Kids College"
                width={44}
                height={44}
                className="rounded-full bg-white p-1"
              />
              <div>
                <p className="font-bold text-lg">Kids College</p>
                <p className="text-xs text-purple-200">First Among Equals</p>
              </div>
            </div>
            <p className="text-purple-100/80 text-sm leading-relaxed max-w-md">
              A nurturing school community raising confident learners through
              strong academics, character, and care.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Explore</h4>
            <div className="space-y-2 text-sm text-purple-100/80">
              <div>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </div>
              <div>
                <Link href="/academics" className="hover:text-white">
                  Academics
                </Link>
              </div>
              <div>
                <Link href="/admissions" className="hover:text-white">
                  Admissions
                </Link>
              </div>
              <div>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <div className="space-y-2 text-sm text-purple-100/80">
              <p>Trinity Avenue, Off Ugbor Road</p>
              <p>Benin City</p>
              <p>info@kidscollege.ng</p>
              <p>+234 800 000 0000</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-4 text-center text-xs text-purple-200/70">
          © {new Date().getFullYear()} Kids College. All rights reserved.
        </div>
      </footer>
    </div>
  );
}