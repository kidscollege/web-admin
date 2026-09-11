"use client";

import { useEffect } from "react";

export default function RoleRedirect() {
  useEffect(() => {
    const path = window.location.pathname;

    // public pages
    if (
      path === "/" ||
      path === "/login" ||
      path.startsWith("/about") ||
      path.startsWith("/contact") ||
      path.startsWith("/admissions")
    ) {
      return;
    }

    const raw = localStorage.getItem("user");
    if (!raw) return;

    let role = "";
    try {
      role = String(JSON.parse(raw)?.role || "").toUpperCase();
    } catch {
      return;
    }

    const send = (url: string) => {
      if (!path.startsWith(url)) {
        window.location.replace(url);
      }
    };

    if (role === "BURSAR") send("/bursary");
    else if (role === "TEACHER") send("/teacher");
    else if (role === "PARENT") send("/parent");
    else if (role === "PRINCIPAL") send("/principal");
  }, []);

  return null;
}