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
  Pencil,
  X,
} from "lucide-react";

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

const statKeys = [
  { key: "ruangan", label: "Ruangan", icon: <DoorOpen size={28} /> },
  { key: "guru", label: "Guru", icon: <GraduationCap size={28} /> },
  { key: "siswa", label: "Siswa", icon: <Users size={28} />, approx: true },
  { key: "mapel", label: "Mata Pelajaran", icon: <BookOpen size={28} /> },
];

export default function StatsPage() {
  const [stats, setStats] = useState({ ruangan: 0, guru: 0, siswa: 0, mapel: 0 });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ruangan: 0, guru: 0, siswa: 0, mapel: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/konten/statistik");
        const json = await res.json();
        const data = json[0] || {};
        setStats(data);
        setForm(data);
      } catch (error) {
        console.error("Gagal mengambil statistik:", error);
      }
    }
    fetchStats();
  }, []);

  const handleEdit = () => setShowModal(true);
  const handleCancel = () => setShowModal(false);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        ruangan: Number(form.ruangan),
        guru: Number(form.guru),
        siswa: Number(form.siswa),
        mapel: Number(form.mapel),
      };
      await fetch("/api/konten/statistik", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStats(payload);
      setShowModal(false);
    } catch (e) {
      alert("Gagal menyimpan statistik");
    }
    setLoading(false);
  };

  return (
    <section className="flex flex-col bg-white border-2 border-white rounded-xl relative p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Statistik</h2>
        <button
          className="text-gray-500 hover:text-[var(--secondary)]"
          onClick={handleEdit}
          aria-label="Edit Statistik"
        >
          <Pencil size={22} />
        </button>
      </div>

      {/* Grid Statistik */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statKeys.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col justify-between items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group min-h-[7.5rem]"
          >
            <div className="mb-2 p-2 rounded-full bg-[var(--tertiary)] text-[var(--secondary)] group-hover:bg-[var(--secondary)] group-hover:text-white">
              {item.icon}
            </div>
            <div className="text-xl md:text-2xl font-bold text-gray-800">
              <AnimatedNumber value={stats[item.key]} />
              {item.approx && (
                <span className="text-sm text-gray-500">&plusmn;</span>
              )}
            </div>
            <p className="text-xs md:text-sm text-gray-600 font-medium text-center">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 animate-[fadeIn_0.3s_ease-out]">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
              onClick={handleCancel}
              aria-label="Tutup"
            >
              <X size={22} />
            </button>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Edit Statistik
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-5"
            >
              {statKeys.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center gap-4 px-4 py-2 rounded-lg bg-gray-50 shadow-sm"
                >
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--tertiary)] text-[var(--secondary)] p-2">
                    {item.icon}
                  </div>
                  <input
                    type="number"
                    name={item.key}
                    value={form[item.key]}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md px-3 py-1 w-24 text-center font-semibold text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <label className="w-32 font-medium text-gray-700">
                    {item.label}
                  </label>
                </div>
              ))}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[var(--secondary)] text-white hover:bg-white hover:text-[var(--secondary)] border-2 border-[var(--secondary)] transition"
                  disabled={loading}
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
