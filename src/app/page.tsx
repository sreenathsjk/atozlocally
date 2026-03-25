"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, SlidersHorizontal, Wifi, WifiOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getApprovedProviders, haversineDistance } from "@/lib/firestore";
import { Provider, ServiceCategory, SERVICE_CATEGORIES } from "@/types";
import { useLocation } from "@/hooks/useLocation";
import AppShell from "@/components/layout/AppShell";
import ProviderCard from "@/components/feed/ProviderCard";
import SkeletonCard from "@/components/ui/SkeletonCard";

const DEMO_PROVIDERS: Provider[] = [
  { id: "1", name: "Rajesh Kumar", phone: "919876543210", category: "plumber", experience: "8 yrs", location: { lat: 19.078, lng: 72.879 }, address: "Andheri West", priceRange: "₹300–600", profileImage: "", rating: 4.8, reviewCount: 124, status: "approved", verified: true, userId: "u1", createdAt: Date.now() },
  { id: "2", name: "Suresh Electricals", phone: "919876543211", category: "electrician", experience: "12 yrs", location: { lat: 19.082, lng: 72.874 }, address: "Juhu", priceRange: "₹400–800", profileImage: "", rating: 4.6, reviewCount: 89, status: "approved", verified: true, userId: "u2", createdAt: Date.now() },
  { id: "3", name: "Priya Cleaning Co.", phone: "919876543212", category: "cleaner", experience: "5 yrs", location: { lat: 19.074, lng: 72.883 }, address: "Versova", priceRange: "₹500–1200", profileImage: "", rating: 4.9, reviewCount: 201, status: "approved", verified: true, userId: "u3", createdAt: Date.now() },
  { id: "4", name: "Manoj Carpentry", phone: "919876543213", category: "carpenter", experience: "15 yrs", location: { lat: 19.07, lng: 72.888 }, address: "Goregaon", priceRange: "₹600–2000", profileImage: "", rating: 4.7, reviewCount: 56, status: "approved", verified: false, userId: "u4", createdAt: Date.now() },
  { id: "5", name: "Cool Air AC Service", phone: "919876543214", category: "ac_repair", experience: "10 yrs", location: { lat: 19.086, lng: 72.871 }, address: "Malad West", priceRange: "₹350–900", profileImage: "", rating: 4.5, reviewCount: 143, status: "approved", verified: true, userId: "u5", createdAt: Date.now() },
  { id: "6", name: "Sunita Beauty Salon", phone: "919876543215", category: "salon", experience: "7 yrs", location: { lat: 19.080, lng: 72.876 }, address: "Andheri East", priceRange: "₹200–800", profileImage: "", rating: 4.8, reviewCount: 310, status: "approved", verified: true, userId: "u6", createdAt: Date.now() },
];

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { location } = useLocation();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | "all">("all");

  useEffect(() => {
    if (!authLoading && !user) router.replace("/auth");
  }, [user, authLoading, router]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getApprovedProviders();
        setProviders(data.length > 0 ? data : DEMO_PROVIDERS);
      } catch {
        setProviders(DEMO_PROVIDERS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const enriched = useMemo(() => {
    return providers
      .map((p) => ({
        ...p,
        distance: location
          ? haversineDistance(location.lat, location.lng, p.location.lat, p.location.lng)
          : undefined,
      }))
      .sort((a, b) =>
        a.distance !== undefined && b.distance !== undefined ? a.distance - b.distance : 0
      );
  }, [providers, location]);

  const filtered = useMemo(() => {
    return enriched.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        SERVICE_CATEGORIES[p.category].label.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === "all" || p.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [enriched, search, activeCategory]);

  const featuredCategories: Array<ServiceCategory | "all"> = [
    "all", "plumber", "electrician", "cleaner", "carpenter", "ac_repair", "painter",
  ];

  if (authLoading) return null;

  return (
    <AppShell>
      <div className="page-enter">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-dark-900/80 backdrop-blur-xl border-b border-white/[0.04] px-4 pt-12 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="font-display text-xl font-bold text-white">
                Discover <span className="text-neon-cyan text-glow-cyan">Pros</span>
              </h1>
              <div className="flex items-center gap-1 text-white/30 text-xs font-mono mt-0.5">
                <MapPin size={10} />
                <span>{location ? "Using your location" : "Location unavailable"}</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
              <span className="font-display font-black text-dark-900 text-sm">A</span>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search plumber, electrician…"
              className="neon-input w-full pl-9 pr-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm font-body"
            />
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {featuredCategories.map((cat) => {
              const active = activeCategory === cat;
              const info = cat === "all" ? null : SERVICE_CATEGORIES[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-200"
                  style={
                    active
                      ? {
                          background: info ? `${info.color}20` : "#00f5ff20",
                          color: info ? info.color : "#00f5ff",
                          border: `1px solid ${info ? info.color : "#00f5ff"}50`,
                        }
                      : { background: "#ffffff08", color: "#ffffff50", border: "1px solid #ffffff10" }
                  }
                >
                  {info && <span>{info.emoji}</span>}
                  <span>{cat === "all" ? "All" : info?.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feed */}
        <div className="px-4 pt-4 space-y-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-display text-white/60">No providers found</p>
              <p className="text-white/30 text-sm mt-1">Try a different search or category</p>
            </div>
          ) : (
            filtered.map((p, i) => <ProviderCard key={p.id} provider={p} index={i} />)
          )}

          {!loading && filtered.length > 0 && (
            <p className="text-center text-white/20 text-xs font-mono py-4">
              {filtered.length} providers near you
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
