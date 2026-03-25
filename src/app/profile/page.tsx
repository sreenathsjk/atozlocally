"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ChevronRight, Briefcase, Phone, Shield, Star, Users } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import AppShell from '../../components/layout/AppShell'
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, userProfile, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/auth");
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.replace("/auth");
    toast.success("Logged out");
  };

  if (loading || !user) return null;

  const initials = userProfile?.displayName
    ? userProfile.displayName.split(" ").map(w => w[0]).join("").toUpperCase()
    : userProfile?.phone?.slice(-4) || "AZ";

  const menuItems = [
    { icon: Briefcase, label: "Become a Service Provider", sublabel: "Register your services", action: () => router.push("/provider-register"), accent: "#00f5ff" },
    { icon: Phone, label: "My Phone", sublabel: userProfile?.phone || user.phoneNumber || "—", action: null, accent: "#bf5af2" },
    { icon: Shield, label: "Verified Account", sublabel: "OTP verified", action: null, accent: "#32d74b" },
  ];

  return (
    <AppShell>
      <div className="page-enter px-4">
        {/* Header */}
        <div className="pt-14 pb-6">
          <h1 className="font-display text-xl font-bold text-white mb-6">Profile</h1>

          {/* Avatar card */}
          <div className="glass rounded-2xl p-6 flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center flex-shrink-0 glow-cyan">
              <span className="font-display font-black text-2xl text-dark-900">{initials}</span>
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-lg font-semibold text-white truncate">
                {userProfile?.displayName || "AtoZ User"}
              </h2>
              <p className="text-white/40 text-sm font-mono mt-0.5">{userProfile?.phone || user.phoneNumber}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="status-approved px-2 py-0.5 rounded-md text-xs font-mono flex items-center gap-1">
                  <Shield size={10} /> Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: Star, val: "0", label: "Reviews" },
            { icon: Briefcase, val: "0", label: "Bookings" },
            { icon: Users, val: "Local", label: "Community" },
          ].map(({ icon: Icon, val, label }) => (
            <div key={label} className="glass rounded-xl p-3 text-center">
              <Icon size={16} className="text-neon-cyan mx-auto mb-1" />
              <div className="font-display font-bold text-white text-lg">{val}</div>
              <div className="text-white/30 text-xs font-mono">{label}</div>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="space-y-2 mb-6">
          {menuItems.map(({ icon: Icon, label, sublabel, action, accent }) => (
            <button
              key={label}
              onClick={action || undefined}
              disabled={!action}
              className="w-full glass rounded-xl p-4 flex items-center gap-3 hover:border-white/10 border border-transparent transition-all duration-200 text-left disabled:cursor-default group"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>
                <Icon size={18} style={{ color: accent }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm">{label}</div>
                <div className="text-white/40 text-xs font-mono mt-0.5">{sublabel}</div>
              </div>
              {action && <ChevronRight size={16} className="text-white/20 group-hover:text-white/50 transition-colors" />}
            </button>
          ))}
        </div>

        {/* Become provider CTA */}
        <button
          onClick={() => router.push("/provider-register")}
          className="w-full py-4 rounded-2xl font-display font-semibold text-dark-900 bg-gradient-to-r from-neon-cyan to-neon-purple glow-cyan flex items-center justify-center gap-2 mb-3 hover:opacity-90 transition-opacity"
        >
          <Briefcase size={18} />
          Become a Service Provider
        </button>

        <button
          onClick={handleLogout}
          className="w-full py-3.5 rounded-xl font-medium text-white/50 flex items-center justify-center gap-2 hover:text-white/80 transition-colors border border-white/[0.05] hover:border-white/10"
        >
          <LogOut size={16} /> Sign Out
        </button>

        <p className="text-center text-white/15 text-xs font-mono mt-6 mb-4">
          AtoZ Service Hub v1.0.0
        </p>
      </div>
    </AppShell>
  );
}
