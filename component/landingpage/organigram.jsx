"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";
import { motion } from "framer-motion";

export default function OrganigramPage() {
  const [struktur, setStruktur] = useState([]);

  useEffect(() => {
    fetch("/api/konten/organigram")
      .then((res) => res.json())
      .then((data) => setStruktur(data))
      .catch((err) => console.error("Gagal fetch struktur:", err));
  }, []);

  return (
    <section className="px-4 md:px-16 py-24 max-w-7xl mx-auto" id="Organigram">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h1 className="text-base md:text-lg font-bold text-gray-600 flex items-center gap-4 text-center md:text-left">
          Struktur Organigram
          <span className="w-24 border-b-2 border-[var(--secondary)]" />
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-[var(--primary)] mt-2 text-left">
          Pahlawan Tanpa Tanda Jasa
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {struktur.map((guru, index) => (
          <motion.div
            key={guru.id || index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col items-center p-4 text-center"
          >
            {guru.foto ? (
              <Image
                src={guru.foto}
                alt={guru.nama}
                width={100}
                height={100}
                className="w-24 h-24 rounded-full object-cover mb-3"
              />
            ) : (
              <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 mb-3">
                <User size={40} />
              </div>
            )}
            <h3 className="font-semibold text-lg">{guru.nama}</h3>
            <p className="text-sm text-gray-500">{guru.jabatan}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
