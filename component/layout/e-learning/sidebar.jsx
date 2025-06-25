"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  Settings,
  FolderOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SidebarLMS({ open, user }) {
  const pathname = usePathname();
  const role = user?.status || "MURID";

  const menus = {
    ADMIN: [
      { label: "Beranda", icon: LayoutDashboard, href: "/admin/home" },
      { label: "Kelola User", icon: Users, href: "/admin/users" },
      { label: "Konten", icon: FolderOpen, href: "/admin/konten" },
      { label: "Pengaturan", icon: Settings, href: "/admin/settings" },
    ],
    GURU: [
      { label: "Beranda", icon: LayoutDashboard, href: "/LMS/guru/home" },
      { label: "Pelajaran", icon: BookOpen, href: "/LMS/guru/pelajaran" },
      { label: "Murid", icon: Users, href: "/LMS/guru/murid" },
      { label: "Pengaturan", icon: Settings, href: "/LMS/guru/pengaturan" },
    ],
    MURID: [
      { label: "Beranda", icon: LayoutDashboard, href: "/murid/home" },
      { label: "Materi", icon: BookOpen, href: "/murid/materi" },
      { label: "Tugas", icon: ClipboardList, href: "/murid/tugas" },
    ],
  };

  const sidebarContent = (
    <nav className="flex flex-col space-y-1 md:pt-21 pt-8">
      {menus[role]?.map(({ label, icon: Icon, href }) => {
        const isActive = pathname.startsWith(href);

        return (
          <Link
            key={label}
            href={href}
            className={`relative flex items-center h-12 px-3 py-2 rounded-md transition-colors duration-200 w-full
              ${
                isActive
                  ? "bg-gray-200 border-l-4 border-[var(--secondary)] text-[var(--secondary)]"
                  : "hover:bg-gray-200 text-var(--teks)"
              }
            `}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <AnimatePresence>
              {open && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="ml-4 text-sm font-medium whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`bg-white text-[var(--teks)] h-full px-2 transition-all duration-300 hidden md:block`}
        style={{ width: open ? "16rem" : "5rem" }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-10 left-0 z-49 h-full w-64 bg-white text-[var(--teks)] px-4 py-6 shadow-md md:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
