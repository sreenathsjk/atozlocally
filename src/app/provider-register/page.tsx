"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Upload, Loader2, CheckCircle, Send } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { addProvider } from "@/lib/firestore";
import { useLocation } from "@/hooks/useLocation";
import { ServiceCategory, SERVICE_CATEGORIES } from "@/types";
import AppShell from '../../components/layout/AppShell';
import toast from "react-hot-toast";

const ADMIN_WHATSAPP = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "919999999999";

export default function ProviderRegisterPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const { location } = useLocation();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<"form" | "success">("form");
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: userProfile?.phone || "",
    category: "plumber" as ServiceCategory,
    experience: "",
    address: "",
    priceRange: "",
  });

  useEffect(() => {
    if (userProfile?.phone) setForm(f => ({ ...f, phone: userProfile.phone }));
  }, [userProfile]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.experience || !form.address || !form.priceRange) {
      toast.error("Please fill all required fields"); return;
    }
    if (!user) { toast.error("Please login first"); return; }
    setSubmitting(true);

    try {
      const providerId = await addProvider({
        name: form.name,
        phone: form.phone,
        category: form.category,
        experience: form.experience,
        location: location || { lat: 19.076, lng: 72.877 },
        address: form.address,
        priceRange: form.priceRange,
        profileImage: previewUrl || "",
        userId: user.uid,
      });

      // Send to admin via WhatsApp
      const cat = SERVICE_CATEGORIES[form.category];
      const msg = encodeURIComponent(
        `🆕 *New Provider Registration*\n\n` +
        `*Name:* ${form.name}\n` +
        `*Phone:* ${form.phone}\n` +
        `*Service:* ${cat.emoji} ${cat.label}\n` +
        `*Experience:* ${form.experience}\n` +
        `*Area:* ${form.address}\n` +
        `*Price Range:* ${form.priceRange}\n` +
        `*Provider ID:* ${providerId}\n\n` +
        `Reply APPROVE_${providerId} to approve this provider.`
      );
      window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${msg}`, "_blank");

      setStep("success");
      toast.success("Application submitted!");
    } catch (e: any) {
      toast.error(e.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "neon-input w-full px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm font-body";
  const labelCls = "text-white/50 text-xs font-mono uppercase tracking-wider mb-1.5 block";

  if (step === "success") {
    return (
      <AppShell>
        <div className="min-h-[80dvh] flex flex-col items-center justify-center px-6 text-center page-enter">
          <div className="w-24 h-24 rounded-full bg-neon-green/10 border border-neon-green/30 flex items-center justify-center mb-6">
            <CheckCircle size={48} className="text-neon-green" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-3">Application Sent!</h2>
          <p className="text-white/50 leading-relaxed mb-8 max-w-xs">
            Your details have been sent to our admin via WhatsApp. We'll review and approve your profile within 24 hours.
          </p>
          <div className="glass rounded-xl p-4 text-left w-full max-w-xs mb-6">
            <p className="text-white/40 text-xs font-mono mb-3">WHAT HAPPENS NEXT</p>
            {["Admin reviews your profile", "Verification call may be placed", "Profile goes live in feed", "Customers can contact you"].map((s, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="w-5 h-5 rounded-full bg-neon-cyan/20 border border-neon-cyan/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-neon-cyan text-xs font-mono">{i + 1}</span>
                </div>
                <span className="text-white/60 text-sm">{s}</span>
              </div>
            ))}
          </div>
          <button onClick={() => router.push("/home")} className="neon-btn px-8 py-3 rounded-xl font-display font-semibold text-neon-cyan">
            Go to Home
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="page-enter px-4 pb-8">
        {/* Header */}
        <div className="pt-14 pb-6">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-white/40 hover:text-white/70 transition-colors mb-4 text-sm">
            <ChevronLeft size={16} /> Back
          </button>
          <h1 className="font-display text-2xl font-bold text-white">
            Become a <span className="text-neon-cyan text-glow-cyan">Provider</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">Register to get discovered by local customers</p>
        </div>

        {/* Photo upload */}
        <div className="glass rounded-2xl p-5 mb-4 flex items-center gap-4">
          <div
            onClick={() => fileRef.current?.click()}
            className="w-20 h-20 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-neon-cyan/50 transition-colors overflow-hidden flex-shrink-0"
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <Upload size={20} className="text-white/30" />
                <span className="text-white/25 text-xs mt-1 font-mono">Photo</span>
              </>
            )}
          </div>
          <div>
            <p className="text-white/70 text-sm font-medium">Profile Photo</p>
            <p className="text-white/30 text-xs mt-1">Add a clear photo to build trust</p>
            <button onClick={() => fileRef.current?.click()} className="text-neon-cyan text-xs mt-2 hover:underline">
              {previewUrl ? "Change" : "Upload"}
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Full Name *</label>
            <input className={inputCls} placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>

          <div>
            <label className={labelCls}>WhatsApp Number *</label>
            <input className={inputCls} placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} type="tel" />
          </div>

          <div>
            <label className={labelCls}>Service Category *</label>
            <select className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as ServiceCategory }))}>
              {Object.entries(SERVICE_CATEGORIES).map(([k, v]) => (
                <option key={k} value={k} style={{ background: "#1c1c2e" }}>{v.emoji} {v.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Experience *</label>
              <input className={inputCls} placeholder="e.g. 5 years" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Price Range *</label>
              <input className={inputCls} placeholder="₹200–500" value={form.priceRange} onChange={e => setForm(f => ({ ...f, priceRange: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Service Area *</label>
            <input className={inputCls} placeholder="e.g. Andheri West, Mumbai" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
          </div>

          <div className="glass rounded-xl p-3 flex items-start gap-2">
            <Send size={14} className="text-neon-orange flex-shrink-0 mt-0.5" />
            <p className="text-white/40 text-xs leading-relaxed">
              Your details will be sent to our admin via WhatsApp for manual review. You'll be notified once approved.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-4 rounded-2xl font-display font-semibold text-dark-900 bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-opacity glow-cyan"
          >
            {submitting ? <Loader2 size={18} className="animate-spin text-dark-900" /> : <><Send size={18} /> Submit Application</>}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
