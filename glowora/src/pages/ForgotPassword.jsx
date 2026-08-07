import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Logo from "../components/shared/Logo.jsx";
import { ArrowLeft, Mail } from "lucide-react";
import api from "../lib/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/otp/send-otp", {
        email,
      });

      toast.success(res.data.message);

      navigate("/verify-otp", {
        state: {
          email,
        },
      });

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">

        <Logo />

        <h1 className="mt-8 font-display text-3xl text-ink">
          Forgot Password
        </h1>

        <p className="mt-2 text-sm text-ink/55">
          Enter your registered email address.
        </p>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>

          <input
            type="email"
            placeholder="Enter your email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>

        </form>

        <Link
          to="/login"
          className="mt-8 flex items-center justify-center gap-2 text-sm"
        >
          <ArrowLeft size={14} />
          Back to Login
        </Link>

      </div>
    </div>
  );
}