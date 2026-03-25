"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2, FileText } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getServiceRequests, addServiceRequest } from "@/lib/firestore";
import { useLocation } from "@/hooks/useLocation";
import { ServiceRequest, ServiceCategory, SERVICE_CATEGORIES } from "@/types";
import AppShell from '../../components/layout/AppShell'
import RequestCard from "@/components/feed/RequestCard";
import toast from "react-hot-toast";

const DEMO_REQUESTS: ServiceRequest[] = [
  { id: "r1", userId: "u1", userPhone: "919876540001", userName: "Amit S.", title: "Need urgent plumber for pipe leak", description: "Water pipe burst in bathroom, need immediate help. Happening since morning.", category: "plumber", location: { lat: 19.078, lng: 72.879 }, address: "Andheri West", urgency: "high", status: "open", createdAt: Date.now() - 3600000 },
  { id: "r2", userId: "u2", userPhone: "919876540002", userName: "Neha R.", title: "AC servicing needed before summer", description: "1.5 ton split AC needs annual maintenance and gas refill check.", category: "ac_repair", location: { lat: 19.082, lng: 72.874 }, address: "Juhu", urgency: "medium", status: "open", createdAt: Date.now() - 7200000 },
  { id: "r3", userId: "u3", userPhone: "919876540003", userName: "Rohit M.", title: "House deep cleaning required", description: "3 BHK flat needs full deep cleaning, kitchen + bathrooms included.", category: "cleaner", location: { lat: 19.074, lng: 72.883 }, address: "Versova", urgency: "low", status: "open", createdAt: Date.now() - 86400000 },
];

export default function RequestsPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const { location } = useLocation();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "", description: "", category: "plumber" as ServiceCategory,
    address: "", urgency: "medium" as "low" | "medium" | "high",
  });

  useEffect(() => {
    if (!authLoading && !user) router.replace("/auth");
  }, [user, authLoading, router]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getServiceRequests();
        setRequests(data.length > 0 ? data : DEMO_REQUESTS);
      } catch { setRequests(DEMO_REQUESTS); }
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.address) {
      toast.error("Please fill all fields"); return;
    }
    if (!user || !userProfile) { toast.error("Please login first"); return; }
    setSubmitting(true);
    try {
      await addServiceRequest({
        userId: user.uid,
        userPhone: userProfile.phone,
        userName: userProfile.displayName || "Anonymous",
        title: form.title,
        description: form.description,
        category: form.category,
        location: location || { lat: 19.076, lng: 72.877 },
        address: form.address,
        urgency: form.urgency,
      });
      toast.success("Request posted!");
      setShowForm(false);
      setForm({ title: "", description: "", category: "plumber", address: "", urgency: "medium" });
      const data = await getServiceRequests();
      setRequests(data);
    } catch (e: any) {
      toast.error(e.message || "Failed to post request");
    } finally { setSubmitting(false); }
  };

  const inputCls = "neon-input w-full px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm font-body";
  const labelCls = "text-white/50 text-xs font-mono uppercase tracking-wider mb-1.5 block";

  return (
    <AppShell>
      <div className="page-enter">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-dark-900/80 backdrop-blur-xl border-b border-white/[0.04] px-4 pt-12 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-xl font-bold text-white">
                Service <span className="text-neon-purple" style={{ textShadow: "0 0 20px #bf5af280" }}>Requests</span>
              </h1>
              <p className="text-white/30 text-xs font-mono mt-0.5">{requests.length} open requests nearby</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-neon-purple/20 text-neon-purple border border-neon-purple/30 hover:bg-neon-purple/30 transition-all"
            >
              <Plus size={16} /> Post
            </button>
          </div>
        </div>

        {/* Post form modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="glass-strong w-full max-w-md rounded-2xl p-5 space-y-4 border border-white/10 max-h-[85dvh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-white">Post a Request</h2>
                <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white/80 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div>
                <label className={labelCls}>Title</label>
                <input className={inputCls} placeholder="e.g. Need plumber for pipe leak" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>

              <div>
                <label className={labelCls}>Description</label>
                <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Describe what you need..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Category</label>
                  <select className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as ServiceCategory }))}>
                    {Object.entries(SERVICE_CATEGORIES).map(([k, v]) => (
                      <option key={k} value={k} style={{ background: "#1c1c2e" }}>{v.emoji} {v.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Urgency</label>
                  <select className={inputCls} value={form.urgency} onChange={e => setForm(f => ({ ...f, urgency: e.target.value as any }))}>
                    <option value="low" style={{ background: "#1c1c2e" }}>Low</option>
                    <option value="medium" style={{ background: "#1c1c2e" }}>Medium</option>
                    <option value="high" style={{ background: "#1c1c2e" }}>Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Your Area / Address</label>
                <input className={inputCls} placeholder="e.g. Andheri West, Mumbai" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-3.5 rounded-xl font-display font-semibold text-white bg-gradient-to-r from-neon-purple/80 to-neon-pink/80 border border-neon-purple/40 flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <><FileText size={16} /> Post Request</>}
              </button>
            </div>
          </div>
        )}

        {/* Feed */}
        <div className="px-4 pt-4 space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-4 space-y-3">
                <div className="flex gap-2"><div className="skeleton h-5 w-20 rounded-md" /><div className="skeleton h-5 w-16 rounded-md" /></div>
                <div className="skeleton h-4 w-48 rounded-lg" />
                <div className="skeleton h-3 w-full rounded-lg" />
              </div>
            ))
          ) : requests.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📋</p>
              <p className="font-display text-white/60">No requests yet</p>
              <p className="text-white/30 text-sm mt-1">Be the first to post a service request</p>
            </div>
          ) : (
            requests.map((r) => <RequestCard key={r.id} request={r} />)
          )}
        </div>
      </div>
    </AppShell>
  );
}
