"use client";

import { MapPin, Clock, MessageCircle, AlertCircle } from "lucide-react";
import { ServiceRequest, SERVICE_CATEGORIES } from "@/types";

interface RequestCardProps {
  request: ServiceRequest;
}

const URGENCY_CONFIG = {
  low: { label: "Low", color: "#32d74b", cls: "urgency-low" },
  medium: { label: "Medium", color: "#ff9f0a", cls: "urgency-medium" },
  high: { label: "Urgent!", color: "#ff2d78", cls: "urgency-high" },
};

export default function RequestCard({ request }: RequestCardProps) {
  const cat = SERVICE_CATEGORIES[request.category];
  const urgency = URGENCY_CONFIG[request.urgency];

  const handleContact = () => {
    const msg = encodeURIComponent(
      `Hi! I saw your service request on AtoZ Service Hub: "${request.title}". I can help!`
    );
    window.open(`https://wa.me/${request.userPhone.replace(/\D/g, "")}?text=${msg}`, "_blank");
  };

  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.10] transition-all duration-300">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md category-pill"
              style={{ background: `${cat.color}15`, color: cat.color, border: `1px solid ${cat.color}30` }}
            >
              {cat.emoji} {cat.label}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono ${urgency.cls}`}>
              <AlertCircle size={10} /> {urgency.label}
            </span>
          </div>
          <span className="text-white/30 text-xs font-mono flex-shrink-0 flex items-center gap-1">
            <Clock size={10} /> {timeAgo(request.createdAt)}
          </span>
        </div>

        <h3 className="font-display font-semibold text-white mb-1">{request.title}</h3>
        <p className="text-white/50 text-sm leading-relaxed line-clamp-2">{request.description}</p>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1 text-white/40 text-xs">
            <MapPin size={11} />
            <span className="font-mono">{request.address || "Location shared"}</span>
          </div>
          <button
            onClick={handleContact}
            className="wa-btn flex items-center gap-2 px-3 py-2 rounded-xl text-white text-xs font-semibold"
          >
            <MessageCircle size={13} /> Offer Help
          </button>
        </div>
      </div>
    </div>
  );
}
