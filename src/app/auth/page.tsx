"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ConfirmationResult } from "firebase/auth";
import { useAuth } from "@/lib/auth-context";
import { Phone, ArrowRight, Shield, Loader2, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

type Step = "phone" | "otp";

export default function AuthPage() {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { sendOTP, verifyOTP } = useAuth();
  const router = useRouter();

  const handleSendOTP = async () => {
    const cleaned = phone.replace(/\s/g, "");
    if (!cleaned.startsWith("+") || cleaned.length < 10) {
      toast.error("Enter a valid phone number with country code (e.g. +91XXXXXXXXXX)");
      return;
    }
    setLoading(true);
    try {
      const conf = await sendOTP(cleaned);
      setConfirmation(conf);
      setStep("otp");
      toast.success("OTP sent!");
    } catch (e: any) {
      toast.error(e.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (val: string, idx: number) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
    if (!val && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) { toast.error("Enter 6-digit OTP"); return; }
    if (!confirmation) return;
    setLoading(true);
    try {
      await verifyOTP(confirmation, code);
      toast.success("Welcome to AtoZ!");
      router.replace("/home");
    } catch (e: any) {
      toast.error("Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-dark-900 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Bg orbs */}
      <div className="orb w-80 h-80 bg-neon-cyan opacity-[0.06] -top-20 -right-20" />
      <div className="orb w-64 h-64 bg-neon-purple opacity-[0.06] bottom-20 -left-20" />

      <div className="relative z-10 w-full max-w-sm page-enter">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center mb-4 glow-cyan">
            <span className="font-display font-black text-4xl text-dark-900">A</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white text-glow-cyan">AtoZ Service Hub</h1>
          <p className="text-white/40 text-sm mt-2 text-center font-body">
            Discover trusted service providers near you
          </p>
        </div>

        {step === "phone" ? (
          <div className="glass rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="font-display text-xl font-semibold text-white mb-1">Sign In</h2>
              <p className="text-white/40 text-sm">Enter your mobile number to continue</p>
            </div>

            <div className="space-y-2">
              <label className="text-white/60 text-xs font-mono uppercase tracking-wider">Mobile Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                  placeholder="+91 98765 43210"
                  className="neon-input w-full pl-10 pr-4 py-3.5 rounded-xl text-white placeholder-white/20 font-mono text-sm"
                />
              </div>
              <p className="text-white/25 text-xs">Include country code e.g. +91 for India</p>
            </div>

            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full neon-btn py-3.5 rounded-xl font-display font-semibold text-neon-cyan flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>Send OTP <ArrowRight size={16} /></>}
            </button>
          </div>
        ) : (
          <div className="glass rounded-2xl p-6 space-y-5">
            <button onClick={() => setStep("phone")} className="flex items-center gap-1 text-white/40 text-sm hover:text-white/70 transition-colors">
              <ChevronLeft size={14} /> Back
            </button>

            <div>
              <h2 className="font-display text-xl font-semibold text-white mb-1">Verify OTP</h2>
              <p className="text-white/40 text-sm">6-digit code sent to <span className="text-neon-cyan font-mono">{phone}</span></p>
            </div>

            <div className="flex gap-2 justify-center">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  className="neon-input w-11 h-14 text-center text-white text-xl font-mono font-bold rounded-xl"
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full neon-btn py-3.5 rounded-xl font-display font-semibold text-neon-cyan flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><Shield size={16} /> Verify & Enter</>}
            </button>

            <button onClick={handleSendOTP} className="w-full text-white/30 text-sm hover:text-white/60 transition-colors py-1">
              Resend OTP
            </button>
          </div>
        )}

        <p className="text-center text-white/20 text-xs mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
