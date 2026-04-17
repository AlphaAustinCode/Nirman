"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Inbox,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  MapPin,
  Flame,
  Star,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { apiFetch } from "@/lib/client-auth";

type ProfileData = {
  name: string;
  location: string | null;
  trustScore: number;
  activeRequests: number;
  cylindersShared: number;
  stats: {
    listings_created: number;
  };
};

type HistoryItem = {
  id: string;
  date: string;
  type: "Lent" | "Borrowed";
  counterparty: string;
  status: string;
  amount: string;
};

export default function DashboardPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(".dash-card", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      apiFetch<ProfileData>("/api/user/profile"),
      apiFetch<HistoryItem[]>("/api/history"),
    ])
      .then(([profileResponse, historyResponse]) => {
        if (!isMounted) {
          return;
        }

        setProfile(profileResponse.data || null);
        setHistory((historyResponse.data || []).slice(0, 3));
      })
      .catch((fetchError) => {
        if (!isMounted) {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load dashboard data."
        );
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const trustStrokeOffset = useMemo(() => {
    const score = profile?.trustScore ?? 0;
    const circumference = 283;
    return circumference - (circumference * score) / 100;
  }, [profile?.trustScore]);

  return (
    <div ref={containerRef} className="space-y-8 max-w-6xl mx-auto">
      <div className="dash-card flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Welcome back, {profile?.name || "Verified User"}!
          </h2>
          <p className="text-slate-500 font-medium">
            {profile?.location
              ? `Tracking your LPG community activity around ${profile.location}.`
              : "Here is your live community exchange overview."}
          </p>
        </div>
      </div>

      {error && (
        <div className="dash-card rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-12 gap-6">
        <Card className="dash-card md:col-span-8 bg-gradient-to-br from-white to-[#FFF8F3] border-[#FFE5D9] shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <ShieldCheck className="h-6 w-6 text-[#4CAF50]" />
              Community Trust Profile
            </CardTitle>
            <CardDescription>
              Your reliability and verified exchange score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-8 py-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#F1F5F9"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="283"
                    strokeDashoffset={trustStrokeOffset}
                    className="transition-all duration-700"
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#FFC857" />
                      <stop offset="100%" stopColor="#4CAF50" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-800">
                    {profile?.trustScore ?? "--"}
                  </span>
                  <span className="text-xs font-bold text-slate-400">Score</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 w-full">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-[#FF6B35]">
                      {profile?.stats.listings_created ?? 0}
                    </span>
                    <span className="text-sm font-medium text-slate-500">
                      Listings Created
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-[#4A90E2]">
                      {profile?.activeRequests ?? 0}
                    </span>
                    <span className="text-sm font-medium text-slate-500">
                      Active Requests
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-[#f0fdf4] text-[#166534] rounded-lg text-sm font-medium border border-[#bbf7d0]">
                  <Star className="h-4 w-4 fill-[#166534]" />
                  Trust score increases as you complete verified exchanges.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dash-card md:col-span-4 border-[#FFE5D9] shadow-lg flex flex-col">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>What do you need to do?</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center gap-4">
            <Link href="/app/send" className="block w-full">
              <Button className="w-full h-16 bg-gradient-to-r from-[#FF6B35] to-[#FFC857] hover:opacity-90 text-white shadow-md text-lg rounded-xl flex justify-start px-6 gap-4">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Send className="h-5 w-5" />
                </div>
                Lend Cylinder
              </Button>
            </Link>
            <Link href="/app/receive" className="block w-full">
              <Button
                variant="outline"
                className="w-full h-16 border-2 border-slate-200 hover:border-[#FF6B35] hover:bg-[#FFE5D9]/30 text-slate-700 shadow-sm text-lg rounded-xl flex justify-start px-6 gap-4"
              >
                <div className="bg-slate-100 p-2 rounded-lg">
                  <Inbox className="h-5 w-5 text-[#FF6B35]" />
                </div>
                Request Cylinder
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <h3 className="dash-card text-xl font-bold text-slate-800 mt-10 mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-[#FF6B35]" />
        Recent Activity
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((activity) => (
          <Card
            key={activity.id}
            className="dash-card border-slate-200 shadow-md hover:shadow-lg transition-shadow group"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div
                  className={`p-2 rounded-lg inline-flex ${
                    activity.type === "Lent"
                      ? "bg-[#FFF8F3] text-[#FF6B35]"
                      : "bg-[#F0F7FF] text-[#4A90E2]"
                  }`}
                >
                  {activity.type === "Lent" ? (
                    <ArrowUpRight className="h-5 w-5" />
                  ) : (
                    <ArrowDownLeft className="h-5 w-5" />
                  )}
                </div>
                <Badge
                  variant={
                    activity.status === "COMPLETED" ? "secondary" : "default"
                  }
                  className={
                    activity.status === "COMPLETED"
                      ? "bg-[#bbf7d0] text-[#166534] hover:bg-[#bbf7d0]"
                      : "bg-[#FFC857] text-[#854d0e] hover:bg-[#FFC857]"
                  }
                >
                  {activity.status === "COMPLETED" ? "Completed" : activity.status}
                </Badge>
              </div>
              <CardTitle className="text-lg mt-3">
                {activity.type === "Lent"
                  ? "Cylinder Lent Out"
                  : "Cylinder Requested"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <MapPin className="h-4 w-4" />
                  {activity.counterparty}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Clock className="h-4 w-4" />
                  {new Date(activity.date).toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Flame className="h-4 w-4" />
                  Exchange Type: {activity.amount}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
