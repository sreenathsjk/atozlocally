import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Provider, ServiceRequest } from "@/types";

// ── Providers ──────────────────────────────────────────────

export async function getApprovedProviders(): Promise<Provider[]> {
  const q = query(
    collection(db, "providers"),
    where("status", "==", "approved"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Provider));
}

export async function addProvider(
  data: Omit<Provider, "id" | "rating" | "reviewCount" | "status" | "verified" | "distance">
): Promise<string> {
  const ref = await addDoc(collection(db, "providers"), {
    ...data,
    rating: 0,
    reviewCount: 0,
    status: "pending",
    verified: false,
  });
  return ref.id;
}

export async function approveProvider(providerId: string): Promise<void> {
  await updateDoc(doc(db, "providers", providerId), {
    status: "approved",
    verified: true,
  });
}

// ── Requests ───────────────────────────────────────────────

export async function getServiceRequests(): Promise<ServiceRequest[]> {
  const q = query(
    collection(db, "requests"),
    where("status", "==", "open"),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ServiceRequest));
}

export async function addServiceRequest(
  data: Omit<ServiceRequest, "id" | "status" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "requests"), {
    ...data,
    status: "open",
    createdAt: Date.now(),
  });
  return ref.id;
}

// ── Distance ───────────────────────────────────────────────

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m away`;
  return `${km.toFixed(1)}km away`;
}
