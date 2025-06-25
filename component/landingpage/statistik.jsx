"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  DoorOpen,
  GraduationCap,
  Users,
  BookOpen,
} from "lucide-react";

// Komponen animasi angka
function AnimatedNumber({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, latest =>
    Math.floor(latest).toLocaleString()
  );

  useEffect(() => {
    if (inView) {
      const controls = animate(motionValue, value, {
        duration: 2,
        ease: "easeOut",
      });

      return controls.stop;
    }
  }, [inView, value]);

  return (
    <motion.span ref={ref} className="inline-block">
      {rounded}
    </motion.span>
  );
}

export default function StatsPage() {
  const [stats, setStats] = useState([]);

useEffect(() => {
  async function fetchStats() {
    try {
      const res = await fetch("/api/konten/statistik");
      const json = await res.json();

      // ✅ Ambil objek pertama dari array
      const data = json[0] || {};

      const formatted = [
        {
          label: "Ruangan",
          value: data.ruangan || 0,
          icon: <DoorOpen size={32} />,
        },
        {
          label: "Guru",
          value: data.guru || 0,
          icon: <GraduationCap size={32} />,
        },
        {
          label: "Siswa",
          value: data.siswa || 0,
          approx: true,
          icon: <Users size={32} />,
        },
        {
          label: "Mata Pelajaran",
          value: data.mapel || 0,
          icon: <BookOpen size={32} />,
        },
      ];

      setStats(formatted);
    } catch (error) {
      console.error("Gagal mengambil statistik:", error);
    }
  }

  fetchStats();
}, []);


  return (
    <section id="stats" className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="flex flex-col items-center bg-white p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="mb-3 md:mb-4 p-3 rounded-full bg-[var(--tertiary)] text-[var(--secondary)] group-hover:bg-[var(--secondary)] group-hover:text-white">
                {item.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold flex items-center justify-center text-gray-800">
                <AnimatedNumber value={item.value} />
                {item.approx && (
                  <span className="text-xl md:text-2xl ml-1 text-gray-500">
                    &plusmn;
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm md:text-base text-gray-600 font-medium">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
