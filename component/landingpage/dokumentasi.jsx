"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function DokumentasiPage() {
  const [dokumentasi, setDokumentasi] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentItem = dokumentasi[currentIndex];

  useEffect(() => {
    fetch("/api/konten/dokumentasi")
      .then((res) => res.json())
      .then((data) => {
        // Ubah bentuk data agar sesuai dengan struktur yang digunakan
        const formatted = data.map((item) => ({
          title: item.title,
          img: [item.foto1, item.foto2, item.foto3, item.foto4, item.foto5, item.foto6],
          delay: 5, // bisa ubah kalau perlu
        }));
        setDokumentasi(formatted);
      })
      .catch((err) => console.error("Gagal fetch dokumentasi:", err));
  }, []);

  useEffect(() => {
    if (!currentItem) return;
    const interval = setInterval(() => {
      next();
    }, currentItem.delay * 1000);

    return () => clearInterval(interval);
  }, [currentIndex, currentItem]);

  const next = () => {
    setCurrentIndex((prev) =>
      prev === dokumentasi.length - 1 ? 0 : prev + 1
    );
  };

  const prev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? dokumentasi.length - 1 : prev - 1
    );
  };

  if (dokumentasi.length === 0 || !currentItem) return null;

  return (
    <section id="Dokumentasi" className="py-24 bg-[var(--background)] px-6 md:px-16">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-6"
      >
        <h1 className="text-base md:text-lg font-bold text-gray-600 flex items-center gap-4 text-center md:text-left">
          Dokumentasi
          <span className="w-24 border-b-2 border-[var(--secondary)]" />
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-[var(--primary)] mt-2 text-left">
          Jelajahi Dokumentasi
        </h2>
      </motion.div>

      {/* Konten */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mx-auto md:px-4 relative max-w-7xl"
      >
        <div
          className="relative rounded-3xl overflow-hidden grid grid-cols-4 md:grid-cols-6 grid-rows-2 md:gap-3 gap-1 bg-[var(--background)]"
          style={{ maxHeight: "80vh" }}
        >
          {/* Tombol Prev */}
          <button
            onClick={prev}
            aria-label="Previous"
            className="hidden md:flex absolute top-1/2 left-2 -translate-y-1/2 z-20 bg-white rounded-full w-12 h-12 items-center justify-center hover:bg-gray-300 shadow"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          {/* Tombol Next */}
          <button
            onClick={next}
            aria-label="Next"
            className="hidden md:flex absolute top-1/2 right-2 -translate-y-1/2 z-20 bg-white rounded-full w-12 h-12 items-center justify-center hover:bg-gray-300 shadow"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>

          {/* Title di tengah */}
          <div className="absolute top-1/2 left-1/2 w-full transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <h2 className="text-white font-bold text-[4rem] md:text-[10rem] select-none leading-none">
              {currentItem.title}
            </h2>
          </div>

          {/* Gambar kiri atas */}
          <div className="col-span-2 row-span-1 rounded-2xl overflow-hidden cursor-pointer">
            <img
              src={currentItem.img[0]}
              alt="left-top"
              className="w-full h-full object-cover rounded-2xl"
              loading="lazy"
            />
          </div>

          {/* Gambar tengah besar */}
          <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden cursor-pointer">
            <img
              src={currentItem.img[1]}
              alt="center"
              className="w-full h-full object-cover rounded-2xl"
              loading="lazy"
            />
          </div>

          {/* Gambar kanan atas dan bawah */}
          <div className="hidden md:block col-span-2 row-span-2 grid grid-rows-2">
            <div className="rounded-2xl overflow-hidden cursor-pointer mb-3">
              <img
                src={currentItem.img[2]}
                alt="right-top"
                className="w-full h-full object-cover rounded-2xl"
                loading="lazy"
              />
            </div>
            <div className="rounded-2xl overflow-hidden cursor-pointer">
              <img
                src={currentItem.img[3]}
                alt="right-bottom"
                className="w-full h-full object-cover rounded-2xl"
                loading="lazy"
              />
            </div>
          </div>

          {/* Gambar kiri bawah dua */}
          <div className="col-span-2 row-span-1 flex md:gap-3 gap-1">
            <div className="rounded-2xl flex-1 overflow-hidden cursor-pointer">
              <img
                src={currentItem.img[4]}
                alt="left-bottom-1"
                className="w-full h-full object-cover rounded-2xl"
                loading="lazy"
              />
            </div>
            <div className="rounded-2xl flex-1 overflow-hidden cursor-pointer">
              <img
                src={currentItem.img[5]}
                alt="left-bottom-2"
                className="w-full h-full object-cover rounded-2xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Pagination */}
      <div className="block md:hidden mt-6 flex justify-center gap-2">
        {dokumentasi.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentIndex ? "bg-[var(--primary)]" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
