"use client";
import { useState, useEffect } from "react";
import { GeoPoint } from "@/types";

export function useLocation() {
  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        // Fallback: Mumbai coordinates
        setLocation({ lat: 19.076, lng: 72.8777 });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  return { location, error, loading };
}
