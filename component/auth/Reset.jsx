"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("resetEmail");
    if (!savedEmail) {
      showAlert("Email tidak ditemukan. Silakan ulangi proses.", "error");
      router.push("/LMS/auth/password");
    } else {
      setEmail(savedEmail);
    }
  }, []);

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => setAlert({ message: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const showAlert = (message, type = "error") => {
    setAlert({ message, type });
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      return showAlert("Semua kolom wajib diisi");
    }

    if (newPassword.length < 6) {
      return showAlert("Password minimal 6 karakter");
    }

    if (newPassword !== confirmPassword) {
      return showAlert("Konfirmasi password tidak cocok");
    }

    const res = await fetch("/api/auth/password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      showAlert("Password berhasil diubah! Silakan login.", "success");
      sessionStorage.removeItem("resetEmail");
      setTimeout(() => router.push("/auth"), 1500);
    } else {
      showAlert(data.message || "Gagal reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold text-center">Ganti Password</h2>

        {/* Alert Box */}
        {alert.message && (
          <div
            className={`text-sm p-3 rounded-md ${
              alert.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {alert.message}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          {/* Password baru */}
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Password baru"
              className="w-full border px-3 py-2 rounded-md pr-10"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Konfirmasi password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Konfirmasi password"
              className="w-full border px-3 py-2 rounded-md pr-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Ubah Password
          </button>
        </form>
      </div>
    </div>
  );
}
