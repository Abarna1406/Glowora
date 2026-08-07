import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Logo from "../components/shared/Logo";
import api from "../lib/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/otp/reset-password", {
        email,
        otp,
        password,
      });

      toast.success(res.data.message);

      navigate("/login");

    } catch (err) {
      toast.error(err.response?.data?.message || "Reset Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-xl border p-8 shadow-lg">
        <Logo />

        <h2 className="mt-6 text-3xl font-bold">
          Reset Password
        </h2>

        <form onSubmit={resetPassword} className="mt-6 space-y-4">

          <input
            type="password"
            placeholder="New Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="input-field"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>

        </form>
      </div>
    </div>
  );
}