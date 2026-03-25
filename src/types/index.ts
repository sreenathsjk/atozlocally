export interface User {
  uid: string;
  phone: string;
  displayName?: string;
  photoURL?: string;
  isProvider?: boolean;
  createdAt: number;
  location?: GeoPoint;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Provider {
  id: string;
  name: string;
  phone: string;
  category: ServiceCategory;
  experience: string;
  location: GeoPoint;
  address: string;
  priceRange: string;
  profileImage: string;
  rating: number;
  reviewCount: number;
  status: "pending" | "approved" | "rejected";
  verified: boolean;
  userId: string;
  createdAt: number;
  distance?: number; // computed on client
}

export interface ServiceRequest {
  id: string;
  userId: string;
  userPhone: string;
  userName: string;
  title: string;
  description: string;
  category: ServiceCategory;
  location: GeoPoint;
  address: string;
  urgency: "low" | "medium" | "high";
  status: "open" | "closed";
  createdAt: number;
}

export type ServiceCategory =
  | "plumber"
  | "electrician"
  | "carpenter"
  | "painter"
  | "cleaner"
  | "ac_repair"
  | "mechanic"
  | "mason"
  | "welder"
  | "gardener"
  | "driver"
  | "cook"
  | "tutor"
  | "tailor"
  | "salon"
  | "pest_control"
  | "security"
  | "other";

export const SERVICE_CATEGORIES: Record<
  ServiceCategory,
  { label: string; emoji: string; color: string }
> = {
  plumber: { label: "Plumber", emoji: "🔧", color: "#00f5ff" },
  electrician: { label: "Electrician", emoji: "⚡", color: "#ff9f0a" },
  carpenter: { label: "Carpenter", emoji: "🪚", color: "#a2845e" },
  painter: { label: "Painter", emoji: "🎨", color: "#bf5af2" },
  cleaner: { label: "Cleaner", emoji: "🧹", color: "#32d74b" },
  ac_repair: { label: "AC Repair", emoji: "❄️", color: "#64d2ff" },
  mechanic: { label: "Mechanic", emoji: "🔩", color: "#ff6b35" },
  mason: { label: "Mason", emoji: "🧱", color: "#c7a96b" },
  welder: { label: "Welder", emoji: "🔥", color: "#ff453a" },
  gardener: { label: "Gardener", emoji: "🌿", color: "#30d158" },
  driver: { label: "Driver", emoji: "🚗", color: "#0a84ff" },
  cook: { label: "Cook", emoji: "👨‍🍳", color: "#ff9f0a" },
  tutor: { label: "Tutor", emoji: "📚", color: "#5e5ce6" },
  tailor: { label: "Tailor", emoji: "🧵", color: "#ff2d78" },
  salon: { label: "Salon", emoji: "💇", color: "#ff6be4" },
  pest_control: { label: "Pest Control", emoji: "🐛", color: "#30d158" },
  security: { label: "Security", emoji: "🛡️", color: "#0a84ff" },
  other: { label: "Other", emoji: "🔨", color: "#8e8e93" },
};
