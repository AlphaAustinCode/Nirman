"use client";

import { useState, useEffect } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";

interface MapWrapperProps {
  initialViewState?: { longitude: number; latitude: number; zoom: number };
  children?: React.ReactNode;
  height?: string;
}

export default function MapWrapper({
  initialViewState = { longitude: 77.3910, latitude: 28.5355, zoom: 12 }, // Noida default
  children,
  height = "100%",
}: MapWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="animate-pulse bg-slate-200" style={{ height, width: "100%" }} />;

  if (!token || token === "YOUR_MAPBOX_TOKEN") {
    // Fallback UI if no token is provided to prevent crashes
    return (
      <div 
        className="flex flex-col items-center justify-center bg-slate-100 rounded-xl relative overflow-hidden" 
        style={{ height, width: "100%" }}
      >
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-5">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="border border-slate-400" />
          ))}
        </div>
        <MapPin className="h-10 w-10 text-slate-400 mb-2 opacity-50" />
        <p className="text-sm font-medium text-slate-500">Map Interface Unavailable</p>
        <p className="text-xs text-slate-400">Add NEXT_PUBLIC_MAPBOX_TOKEN</p>
      </div>
    );
  }

  return (
    <div style={{ height, width: "100%" }} className="rounded-xl overflow-hidden shadow-inner">
      <Map
        mapboxAccessToken={token}
        initialViewState={initialViewState}
        mapStyle="mapbox://styles/mapbox/light-v11"
      >
        {children}
      </Map>
    </div>
  );
}
