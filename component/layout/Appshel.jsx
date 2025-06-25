"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./landingPage/navbar";
import Footer from "./landingPage/footer";
import NavbarLMS from "./e-learning/navbar";
import SidebarLMS from "./e-learning/sidebar";

export default function AppShell({ children }) {
  const pathname = usePathname();

  // Path yang tidak menampilkan layout apa pun
  const excludedPaths = [
    "/auth",
    "/auth/password",
    "/auth/password/reset",
  ];

  const isExcluded = excludedPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isRoot = pathname === "/";

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/getMe");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Gagal mengambil data user:", err);
      }
    };

    if (!isExcluded && !isRoot) {
      fetchUser();
    }
  }, [isExcluded, isRoot]);

  // 1. Halaman yang tanpa layout
  if (isExcluded) {
    return <>{children}</>;
  }

  // 2. Landing page
  if (isRoot) {
    return (
      <>
        <Navbar />
        {children}
        <Footer />
      </>
    );
  }

  // 3. Halaman LMS (dengan NavbarLMS + SidebarLMS)
  return (
    <div className="h-screen flex flex-col">
      <NavbarLMS setOpen={setOpen} user={user} />
      <div className="flex flex-1">
        {/* Sidebar (bisa di-toggle) */}
        <div className="fixed z-40 h-screen">
          <SidebarLMS open={open} user={user} />
        </div>

        {/* Konten utama */}
        <main className="flex-1 md:ml-20 md:mt-19 p-4 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
