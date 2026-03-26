 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Phone, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Convert phone to fake email for Firebase Email/Password auth
  const toEmail = (ph: string) => {
    const digits = ph.replace(/\D/g, "");
    return `91${digits}@atozservicehub.app`;
  };

  const handleSubmit = async () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const email = toEmail(digits);
    const fullPhone = `+91${digits}`;
    setLoading(true);

    try {
      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const userRef = doc(db, "users", cred.user.uid);
        await setDoc(userRef, {
          uid: cred.user.uid,
          phone: fullPhone,
          displayName: "",
          isProvider: false,
          createdAt: Date.now(),
        });
        toast.success("Account created! Welcome 🎉");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back!");
      }
      router.replace("/home");
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") {
        toast.error("This number is already registered. Please sign in.");
        setMode("signin");
      } else if (e.code === "auth/user-not-found" || e.code === "auth/invalid-credential") {
        toast.error("Number not registered. Please sign up first.");
        setMode("signup");
      } else if (e.code === "auth/wrong-password" || e.code === "auth/invalid-credential") {
        toast.error("Wrong password. Try again.");
      } else {
        toast.error(e.message || "Something went wrong");
      }
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
          <h1 className="font-display text-3xl font-bold text-white text-glow-cyan">
            AtoZ Service Hub
          </h1>
          <p className="text-white/40 text-sm mt-2 text-center font-body">
            Discover trusted service providers near you
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-6 space-y-5">
          {/* Toggle */}
          <div className="flex rounded-xl overflow-hidden border border-white/10">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-2.5 text-sm font-display font-semibold transition-all ${
                mode === "signin"
                  ? "bg-neon-cyan/20 text-neon-cyan"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2.5 text-sm font-display font-semibold transition-all ${
                mode === "signup"
                  ? "bg-neon-purple/20 text-neon-purple"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-white mb-1">
              {mode === "signin" ? "Welcome back!" : "Create account"}
            </h2>
            <p className="text-white/40 text-sm">
              {mode === "signin"
                ? "Sign in with your mobile & password"
                : "Register with your mobile & set a password"}
            </p>
          </div>

          {/* Phone field */}
          <div className="space-y-1.5">
            <label className="text-white/50 text-xs font-mono uppercase tracking-wider">
              Mobile Number
            </label>
            <div className="flex gap-2">
              {/* +91 prefix */}
              <div className="neon-input flex items-center px-3 rounded-xl text-white/60 font-mono text-sm flex-shrink-0 gap-1.5">
                <span>🇮🇳</span>
                <span>+91</span>
              </div>
              <div className="relative flex-1">
                <Phone
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="98765 43210"
                  className="neon-input w-full pl-9 pr-4 py-3.5 rounded-xl text-white placeholder-white/20 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-white/50 text-xs font-mono uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder={mode === "signup" ? "Create a password (min 6 chars)" : "Enter your password"}
                className="neon-input w-full pl-9 pr-10 py-3.5 rounded-xl text-white placeholder-white/20 text-sm"
              />
              <button
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full neon-btn py-3.5 rounded-xl font-display font-semibold text-neon-cyan flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                {mode === "signin" ? "Sign In" : "Create Account"}
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <p className="text-center text-white/30 text-xs">
            {mode === "signin" ? "New user? " : "Already registered? "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-neon-cyan hover:underline"
            >
              {mode === "signin" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
