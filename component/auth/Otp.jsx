"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [alert, setAlert] = useState({ message: "", type: "" }); // type: "success" | "error"

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => setAlert({ message: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const showAlert = (message, type = "error") => {
    setAlert({ message, type });
  };

  const handleSendOtp = async () => {
    if (!email) return showAlert("Email wajib diisi");

    const res = await fetch("/api/auth/password/getOtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      showAlert("OTP telah dikirim ke email kamu!", "success");
      setOtpSent(true);
      setCooldown(180);
    } else {
      showAlert(data.message || "Gagal kirim OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return showAlert("OTP wajib diisi");

    const res = await fetch("/api/auth/password/cekOtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (res.ok) {
      showAlert("OTP valid, lanjut reset password", "success");
      sessionStorage.setItem("resetEmail", email);
      setTimeout(() => router.push("/auth/password/reset"), 1500);
    } else {
      showAlert(data.message || "OTP salah atau kadaluarsa");
    }
  };

  const handleBack = () => {
    setOtpSent(false);
    setOtp("");
    setCooldown(0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold text-center">Lupa Password</h2>

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

        {!otpSent ? (
          <>
            <input
              type="email"
              placeholder="Masukkan email kamu"
              className="w-full border px-3 py-2 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={handleSendOtp}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Lanjut
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Masukkan kode OTP"
              className="w-full border px-3 py-2 rounded-md"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              type="button"
              onClick={handleVerifyOtp}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Verifikasi OTP
            </button>
            <div className="flex justify-between items-center gap-2">
              <button
                onClick={handleBack}
                className="w-full border py-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                Kembali
              </button>
              <button
                disabled={cooldown > 0}
                onClick={handleSendOtp}
                className={`w-full py-2 rounded-md ${
                  cooldown > 0
                    ? "text-gray-400 bg-gray-100 border border-gray-300"
                    : "text-blue-600 border border-blue-400 hover:bg-blue-50"
                }`}
              >
                {cooldown > 0
                  ? `Kirim ulang dalam ${cooldown}s`
                  : "Kirim ulang OTP"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
