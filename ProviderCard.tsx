"use client";

import Image from "next/image";
import { MapPin, Star, CheckCircle, MessageCircle } from "lucide-react";
import { Provider, SERVICE_CATEGORIES } from "@/types";
import { formatDistance } from "@/lib/firestore";

interface ProviderCardProps {
  provider: Provider;
  index?: number;
}

export default function ProviderCard({ provider, index = 0 }: ProviderCardProps) {
  const cat = SERVICE_CATEGORIES[provider.category];

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi ${provider.name}! I found your profile on AtoZ Service Hub. I need a ${cat.label}. Are you available?`
    );
    window.open(`https://wa.me/${provider.phone.replace(/\D/g, "")}?text=${msg}`, "_blank");
  };

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(provider.rating));

  return (
    <div
      className="provider-card glass rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Top Section */}
      <div className="flex items-start gap-4 p-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="w-16 h-16 rounded-xl overflow-hidden"
            style={{ border: `2px solid ${cat.color}40` }}
          >
            <Image
              src={
                provider.profileImage ||
                `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(provider.name)}&backgroundColor=0e0e1a&textColor=ffffff`
              }
              alt={provider.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          {provider.verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-dark-800 flex items-center justify-center">
              <CheckCircle size={14} className="text-neon-cyan" fill="#00f5ff" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-semibold text-base text-white leading-tight truncate">
              {provider.name}
            </h3>
          </div>

          {/* Category pill */}
          <div
            className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md category-pill"
            style={{
              background: `${cat.color}15`,
              color: cat.color,
              border: `1px solid ${cat.color}30`,
            }}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </div>

          {/* Rating + Distance row */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <div className="flex stars">
                {stars.map((filled, i) => (
                  <span key={i} className={filled ? "text-neon-orange" : "text-white/20"}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-white/50 text-xs font-mono">
                {provider.rating > 0 ? provider.rating.toFixed(1) : "New"}
                {provider.reviewCount > 0 && ` (${provider.reviewCount})`}
              </span>
            </div>

            {provider.distance !== undefined && (
              <div className="flex items-center gap-1 text-white/40">
                <MapPin size={11} />
                <span className="text-xs font-mono">{formatDistance(provider.distance)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.04]">
        <div className="flex items-center gap-4">
          <div className="text-xs text-white/40">
            <span className="text-white/70 font-medium">{provider.experience}</span>
            <span className="ml-1">exp</span>
          </div>
          <div className="text-xs text-white/40">
            <span className="text-white/70 font-medium font-mono">{provider.priceRange}</span>
          </div>
        </div>

        <button
          onClick={handleWhatsApp}
          className="wa-btn flex items-center gap-2 px-3 py-2 rounded-xl text-white text-xs font-semibold"
        >
          <MessageCircle size={14} />
          <span>Contact</span>
        </button>
      </div>
    </div>
  );
}
