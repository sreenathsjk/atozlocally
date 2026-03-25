"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { approveProvider } from "@/lib/firestore";
import { Provider, SERVICE_CATEGORIES } from "@/types";
import { CheckCircle, XCircle, Clock, Shield, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "atoz-admin-2024";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState<string | null>(null);

  const login = () => {
    if (password === ADMIN_SECRET) { setAuthed(true); loadPending(); }
    else toast.error("Wrong password");
  };

  const loadPending = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "providers"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setProviders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Provider)));
    } catch (e) { toast.error("Failed to load"); }
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    setApproving(id);
    try {
      await approveProvider(id);
      setProviders(ps => ps.map(p => p.id === id ? { ...p, status: "approved", verified: true } : p));
      toast.success("Provider approved!");
    } catch { toast.error("Failed to approve"); }
    setApproving(null);
  };

  if (!authed) {
    return (
      <div className="min-h-dvh bg-dark-900 flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-8 w-full max-w-sm border border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <Shield size={24} className="text-neon-cyan" />
            <h1 className="font-display text-xl font-bold text-white">Admin Panel</h1>
          </div>
          <input
            type="password"
            className="neon-input w-full px-4 py-3 rounded-xl text-white mb-4"
            placeholder="Admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
          />
          <button onClick={login} className="w-full py-3 rounded-xl font-display font-semibold text-dark-900 bg-gradient-to-r from-neon-cyan to-neon-purple">
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-dark-900 px-4 py-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-white">Provider Approvals</h1>
        <button onClick={loadPending} className="text-neon-cyan text-sm neon-btn px-3 py-1.5 rounded-lg">Refresh</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-neon-cyan" /></div>
      ) : providers.length === 0 ? (
        <div className="text-center py-20 text-white/40">No providers found</div>
      ) : (
        <div className="space-y-3">
          {providers.map(p => {
            const cat = SERVICE_CATEGORIES[p.category];
            return (
              <div key={p.id} className="glass rounded-xl p-4 border border-white/[0.06]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-semibold text-white">{p.name}</span>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded-md ${p.status === "approved" ? "status-approved" : "status-pending"}`}>
                        {p.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-white/40 flex-wrap">
                      <span className="font-mono">{p.phone}</span>
                      <span style={{ color: cat.color }}>{cat.emoji} {cat.label}</span>
                      <span>{p.experience}</span>
                      <span>{p.priceRange}</span>
                    </div>
                    <div className="text-white/30 text-xs mt-1 font-mono">{p.address}</div>
                  </div>
                  {p.status === "pending" && (
                    <button
                      onClick={() => handleApprove(p.id)}
                      disabled={approving === p.id}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-neon-green/20 text-neon-green border border-neon-green/30 hover:bg-neon-green/30 transition-all disabled:opacity-50 flex-shrink-0"
                    >
                      {approving === p.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                      Approve
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
