"use client";
import { Menu, UserCircle } from "lucide-react";
import Image from "next/image";

export default function NavbarLMS({ setOpen, user }) {
  const profileUrl = user?.profile;

  return (
    <header className="flex items-center justify-between bg-[var(--background)] shadow px-4 md:px-6 py-4 md:py-5 z-50 fixed top-0 left-0 right-0">
      {/* Kiri: Tombol & Judul */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="text-gray-700"
        >
          <Menu className="w-6 h-6" />
        </button>

        <h1 className="text-lg md:text-2xl font-bold text-[var(--teks)]">SIJA SMART</h1>
      </div>

      {/* Kanan: Foto Profil */}
      <div className="flex items-center gap-2 md:gap-3">
        {profileUrl ? (
          <Image
            src={profileUrl}
            alt="Profile"
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
        ) : (
          <UserCircle className="w-8 h-8 md:w-9 md:h-9 text-[var(--teks)]" />
        )}
      </div>
    </header>
  );
}
