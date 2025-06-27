"use client";

import { Instagram, Mail, Youtube, MapPin } from "lucide-react";
import { handleEmail } from "@/utils/email";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });

  return (
    <div className="overflow-hidden">
      <motion.div
        ref={ref}
        initial={{ y: 100, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="bg-[var(--background)] text-[var(--teks)] border-t border-solid border-[var(--primary)] py-10 px-6 md:px-12 flex flex-col md:flex-row gap-8 md:gap-0"
      >
        {/* Logo (Desktop Only) */}
        <div className="hidden md:flex justify-center md:justify-start items-center border-b md:border-b-0 md:border-r border-solid border-[var(--teks-secondary)] px-0 md:px-16 pb-6 md:pb-0 flex flex-col">
          <Image src="/landingPage/assets/logo sija.png" alt="Logo" width={80} height={80} />
          <h1 className="text-base font-bold text-[var(--teks)] text-center">
            Sistem Informasi Jaringan dan Aplikasi
          </h1>
        </div>

        {/* Menu + Contact */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-0 md:px-20 gap-10 md:gap-0">
          {/* Social Media */}
          <div className="flex flex-col gap-3 items-center order-2 md:order-2">
            <p className="font-bold text-2xl text-center">
              Stay <span className="text-[var(--primary)]">Connected</span>!!
            </p>
            <ul className="flex gap-6 text-2xl justify-center">
              <li>
                <a
                  href="https://www.instagram.com/tkjsija_smkn1cimahi?igsh=MXN3aWNia3A5aDZjdA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="hover:text-[var(--primary)]" />
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com/@tkjsijasmknegeri1cimahi?si=Cumwy_BkaZ6QUKZk"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Youtube className="hover:text-[var(--primary)]" />
                </a>
              </li>
              <li>
                <a
                  href="https://g.co/kgs/921dFTg"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <MapPin className="hover:text-[var(--primary)]" />
                </a>
              </li>
              <li>
                <button
                  onClick={handleEmail}
                  type="button"
                  aria-label="Email"
                  className="hover:text-[var(--primary)]"
                >
                  <Mail />
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-4 items-center text-center order-1 md:order-1">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 max-w-md">
              {[
                { label: "Beranda", href: "#Beranda" },
                { label: "Tentang Kami", href: "#Tentang Kami" },
                { label: "Produk", href: "#Produk" },
                { label: "Dokumentasi", href: "#Dokumentasi" },
                { label: "Organigram", href: "#Organigram" },
                { label: "Kontak", href: "#Kontak" },
              ].map((item) => (
                <li key={item.label} className="w-auto">
                  <a
                    href={item.href}
                    className="group text-base font-medium text-[var(--teks)] transition-colors duration-300"
                  >
                    {item.label}
                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[var(--teks)] rounded-full"></span>
                  </a>
                </li>
              ))}
            </ul>

            <p className="text-sm text-[var(--teks-secondary)]">
              &copy; 2025 @SIJA SMKN 1 CIMAHI
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
