import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";
import Logo from "../components/shared/Logo";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOTP = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/otp/verify-otp", {
        email,
        otp,
      });

      toast.success(res.data.message);

      navigate("/reset-password", {
        state: {
          email,
          otp,
        },
      });

    } catch (err) {
      toast.error(err.response?.data?.message || "OTP Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-xl border p-8 shadow-lg">
        <Logo />

        <h2 className="mt-6 text-3xl font-bold">
          Verify OTP
        </h2>

        <p className="mt-2 text-gray-500">
          Enter the OTP sent to
        </p>

        <p className="font-semibold">{email}</p>

        <form onSubmit={verifyOTP} className="mt-6 space-y-4">

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="input-field"
            required
          />

          <button
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

      </div>
    </div>
  );
}