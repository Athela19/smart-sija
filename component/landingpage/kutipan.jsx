"use client";

import { useEffect, useState } from "react";
import TypingEffect from "@/utils/typing";
import { User } from "lucide-react";
import { motion } from "framer-motion";

export default function KutipanPage() {
  const [kataKataList, setKataKataList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    fetch("/api/konten/organigram")
      .then((res) => res.json())
      .then((data) => {
        setKataKataList(data);
      })
      .catch((err) => console.error("Gagal fetch kata guru:", err));
  }, []);

  useEffect(() => {
    if (kataKataList.length === 0) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % kataKataList.length);
        setFade(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [kataKataList, activeIndex]);

  if (kataKataList.length === 0) return null;

  const current = kataKataList[activeIndex];

  return (
    <motion.section
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative flex items-center justify-center bg-[var(--primary)] text-white py-12 sm:py-16 min-h-[400px] overflow-hidden"
    >
      {/* Background Image */}
      <img
        src="/landingpage/assets/R14.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md sm:max-w-xl px-4 sm:px-6 text-center">
        <div
          className={`transition-opacity duration-500 ease-in-out ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          {current.foto ? (
            <img
              src={current.foto}
              alt={current.nama}
              width={20}
              height={20}
              className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full object-cover mb-4 border-6"
              style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
            />
          ) : (
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full object-cover mb-4 border-6 flex items-center justify-center"
              style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <User className="w-12 h-12" />
            </div>
          )}

          <h3 className="text-lg sm:text-xl font-bold">
            <TypingEffect text={current.nama} speed={120} />
          </h3>

          <h4 className="text-xs sm:text-sm text-gray-300">{current.jabatan}</h4>

          <p className="italic text-lg sm:text-lg text-gray-100 mt-4 min-h-[80px] flex items-center justify-center text-center">
            “{current.kutipan}”
          </p>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {kataKataList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setFade(false);
                setTimeout(() => {
                  setActiveIndex(idx);
                  setFade(true);
                }, 300);
              }}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors duration-300 ${
                idx === activeIndex ? "bg-white" : "bg-gray-500 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
