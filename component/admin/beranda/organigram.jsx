"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Organigram() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("/api/konten/organigram")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function handleDelete(id) {
    if (confirm("Yakin ingin menghapus?")) {
      alert("Fungsi hapus belum diimplementasikan");
    }
  }

  function handleEdit(item) {
    alert(`Edit item: ${item.nama}`);
  }

  if (loading)
    return (
      <div className="max-w-4xl p-6 bg-white border border-gray-200 rounded-xl min-h-[270px] max-h-[270px] box-border">
        <h1 className="text-xl font-bold mb-2">Organigram</h1>
        <div className="flex justify-center items-center h-32">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );

  return (
    <div className="max-w-4xl p-6 bg-white border border-gray-200 rounded-xl max-h-[270px] box-border">
      <h1 className="text-xl font-bold mb-2">Organigram</h1>

      <div className="overflow-y-auto max-h-[200px] pr-4">
        <ul className="divide-y divide-gray-300">
          <AnimatePresence>
            {data.map((item) => (
              <motion.li
                key={item.id}
                onClick={() => setSelected(item)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-4 py-3 cursor-pointer hover:bg-gray-50 transition"
              >
                <img
                  src={item.foto}
                  alt={item.nama}
                  className="w-12 h-12 rounded-full object-cover border border-gray-300"
                  loading="lazy"
                />
                <div>
                  <p className="font-semibold text-gray-900">{item.nama}</p>
                  <p className="text-gray-600 text-sm">{item.jabatan}</p>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      {/* Modal detail */}
      <AnimatePresence>
        {selected && (
          <motion.div
            onClick={() => setSelected(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg max-w-md w-full p-6 relative shadow-lg"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl"
                aria-label="Close"
              >
                &times;
              </button>

              <img
                src={selected.foto}
                alt={selected.nama}
                className="w-48 h-48 object-cover rounded-md mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-center mb-1">
                {selected.nama}
              </h2>
              <p className="text-center text-gray-700 italic mb-4">
                {selected.jabatan}
              </p>
              <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-6">
                "{selected.kutipan}"
              </blockquote>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => handleEdit(selected)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(selected.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
