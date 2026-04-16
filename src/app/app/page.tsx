"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Inbox, ArrowUpRight, ArrowDownLeft, Clock, MapPin, CheckCircle, Flame, Star, ShieldCheck } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";

export default function DashboardPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Example recent activity based on notification bell receiver/sender logic
  const recentActivity = [
    {
      id: 1,
      type: "borrowed", // receiver side
      status: "completed",
      date: "2 days ago",
      location: "Sector 12, Noida",
      serial: "HP-30121",
    },
    {
      id: 2,
      type: "lent", // sender side
      status: "active",
      date: "Today, 10:30 AM",
      location: "Sector 15, Noida",
      serial: "HP-89912",
    },
    {
      id: 3,
      type: "lent",
      status: "completed",
      date: "1 week ago",
      location: "Sector 62, Noida",
      serial: "HP-55419",
    }
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".dash-card", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      });
      // Trust GAuge animate
      gsap.from(".trust-fill", {
        width: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.3
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-8 max-w-6xl mx-auto">
      <div className="dash-card flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome back, John!</h2>
          <p className="text-slate-500 font-medium">Here's your community exchange overview</p>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {/* User Overview & Trust Score (Visual Gauge) */}
        <Card className="dash-card md:col-span-8 bg-gradient-to-br from-white to-[#FFF8F3] border-[#FFE5D9] shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <ShieldCheck className="h-6 w-6 text-[#4CAF50]" />
              Community Trust Profile
            </CardTitle>
            <CardDescription>Your reliability and verified exchange score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-8 py-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                  {/* Progress Circle (Gauge) */}
                  <circle 
                    className="trust-fill" 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="url(#gradient)" 
                    strokeWidth="10" 
                    strokeLinecap="round" 
                    strokeDasharray="283" 
                    strokeDashoffset="28" // Approx 90% (283 * 0.1)
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FFC857" />
                      <stop offset="100%" stopColor="#4CAF50" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-800">92</span>
                  <span className="text-xs font-bold text-slate-400">Score</span>
                </div>
              </div>
              
              <div className="flex-1 space-y-4 w-full">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-[#FF6B35]">2</span>
                    <span className="text-sm font-medium text-slate-500">Active Listings</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-[#4A90E2]">1</span>
                    <span className="text-sm font-medium text-slate-500">Active Requests</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-[#f0fdf4] text-[#166534] rounded-lg text-sm font-medium border border-[#bbf7d0]">
                  <Star className="h-4 w-4 fill-[#166534]" /> Top 5% most trusted users in your area
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
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
              <Button variant="outline" className="w-full h-16 border-2 border-slate-200 hover:border-[#FF6B35] hover:bg-[#FFE5D9]/30 text-slate-700 shadow-sm text-lg rounded-xl flex justify-start px-6 gap-4">
                <div className="bg-slate-100 p-2 rounded-lg">
                  <Inbox className="h-5 w-5 text-[#FF6B35]" />
                </div>
                Request Cylinder
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity List */}
      <h3 className="dash-card text-xl font-bold text-slate-800 mt-10 mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-[#FF6B35]" />
        Recent Activity
      </h3>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentActivity.map((activity) => (
          <Card key={activity.id} className="dash-card border-slate-200 shadow-md hover:shadow-lg transition-shadow group">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className={`p-2 rounded-lg inline-flex ${activity.type === 'lent' ? 'bg-[#FFF8F3] text-[#FF6B35]' : 'bg-[#F0F7FF] text-[#4A90E2]'}`}>
                  {activity.type === 'lent' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                </div>
                <Badge variant={activity.status === 'completed' ? 'secondary' : 'default'} className={
                  activity.status === 'completed' ? 'bg-[#bbf7d0] text-[#166534] hover:bg-[#bbf7d0]' : 'bg-[#FFC857] text-[#854d0e] hover:bg-[#FFC857]'
                }>
                  {activity.status === 'completed' ? "Completed" : "Active"}
                </Badge>
              </div>
              <CardTitle className="text-lg mt-3">
                {activity.type === 'lent' ? "Cylinder Lent out" : "Cylinder Requested"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <MapPin className="h-4 w-4" /> {activity.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Clock className="h-4 w-4" /> {activity.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Flame className="h-4 w-4" /> Serial: <span className="font-mono text-slate-700 bg-slate-100 px-1 rounded">{activity.serial}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
