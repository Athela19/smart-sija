"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { motion } from "framer-motion";

function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} hari yang lalu`;
  if (hours > 0) return `${hours} jam yang lalu`;
  if (minutes > 0) return `${minutes} menit yang lalu`;
  return "Baru saja";
}

export default function History() {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/riwayat")
      .then((res) => res.json())
      .then((data) => {
        setRiwayat(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white border border-gray-200 rounded-xl overflow-y-auto max-h-[518px] min-h-[518px]">
      <h1 className="text-xl font-bold mb-2">Riwayat Aktivitas</h1>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : riwayat.length === 0 ? (
        <p className="text-center text-gray-500">
          Belum ada riwayat aktivitas.
        </p>
      ) : (
        <div className="space-y-2">
          {riwayat.map(({ id, aksi, createdAt, user }, index) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="relative bg-white shadow rounded-lg p-3 border border-gray-200 flex gap-2"
            >
              {/* Foto profil */}
              <div>
                {user?.foto ? (
                  <img
                    src={user.foto}
                    alt={`${user.name || "User"} profile`}
                    className="w-6 h-6 rounded-full object-cover border border-gray-300"
                    onError={(e) => {
                      e.currentTarget.src = "";
                    }}
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-400" />
                )}
              </div>

              {/* Nama + aksi */}
              <div className="flex-1 relative">
                <p className="text-gray-900 font-semibold text-sm">
                  {user?.name || "Unknown User"}{" "}
                  <span className="font-normal text-gray-600">{aksi}</span>
                </p>
              </div>

              {/* Waktu */}
              <div className="absolute bottom-1 right-2 text-xs text-gray-500 font-mono whitespace-nowrap">
                {timeAgo(createdAt)}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
