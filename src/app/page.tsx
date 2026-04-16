"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Flame, Shield, Clock, Users, ArrowRight, CheckCircle } from "lucide-react";
import ThreeDBackground from "@/components/ThreeDBackground";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger for GSAP
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.from(".hero-element", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      });

      // Stats/Cards Animation
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: ".features-section",
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)"
      });
      
      gsap.from(".step-card", {
        scrollTrigger: {
          trigger: ".steps-section",
          start: "top 75%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* 3D Background */}
      <ThreeDBackground />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFC857] flex items-center justify-center shadow-lg shadow-[#FF6B35]/20">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FFC857] bg-clip-text text-transparent">
              GasShare
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-[#FF6B35] to-[#FFC857] hover:opacity-90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="hero-element inline-block px-4 py-2 mb-6 bg-[#FFE5D9]/80 backdrop-blur-sm rounded-full shadow-sm">
            <span className="text-sm text-[#FF6B35] font-medium">🔥 Emergency LPG Support</span>
          </div>
          <h1 className="hero-element text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight text-slate-900">
            Never Run Out of <br />
            <span className="bg-gradient-to-r from-[#FF6B35] to-[#FFC857] bg-clip-text text-transparent drop-shadow-sm">
              Gas Again
            </span>
          </h1>
          <p className="hero-element text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium">
            Community-powered LPG sharing platform. Help your neighbors in emergencies while building trust and connections.
          </p>
          <div className="hero-element flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-[#FF6B35] to-[#FFC857] hover:opacity-90 text-white shadow-xl shadow-[#FF6B35]/30 rounded-full h-14 px-8 text-lg">
                Start Sharing
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FFE5D9] rounded-full h-14 px-8 text-lg bg-white/50 backdrop-blur-sm">
                Find a Cylinder
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="steps-section container mx-auto px-4 py-24 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">How It Works</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Simple, safe, and secure way to share LPG cylinders in your community
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="step-card p-8 text-center bg-white/70 backdrop-blur-md border-white/40 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-300">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FFC857] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#FF6B35]/20 rotate-3">
              <span className="text-3xl font-bold text-white -rotate-3">1</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-800">Sign Up & Verify</h3>
            <p className="text-slate-600 leading-relaxed">
              Register with your phone and verify your LPG passbook for secure platform access.
            </p>
          </Card>
          <Card className="step-card p-8 text-center bg-white/70 backdrop-blur-md border-white/40 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-300">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FFC857] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#FFC857]/20 -rotate-3">
              <span className="text-3xl font-bold text-white rotate-3">2</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-800">List or Request</h3>
            <p className="text-slate-600 leading-relaxed">
              Share your spare cylinder or dynamically find one nearby when you need it urgently.
            </p>
          </Card>
          <Card className="step-card p-8 text-center bg-white/70 backdrop-blur-md border-white/40 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-300">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FFC857] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#FF6B35]/20 rotate-3">
              <span className="text-3xl font-bold text-white -rotate-3">3</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-800">Connect & Exchange</h3>
            <p className="text-slate-600 leading-relaxed">
              Meet verified neighbors, exchange cylinders safely, and build your community trust score.
            </p>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="features-section container mx-auto px-4 py-24 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">Why Choose GasShare?</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="feature-card p-6 bg-white/80 backdrop-blur-sm border-white/50 shadow-lg hover:shadow-xl transition-shadow">
            <Shield className="w-12 h-12 text-[#FF6B35] mb-4" />
            <h3 className="text-xl font-bold mb-2 text-slate-800">Verified Users</h3>
            <p className="text-slate-600">
              All users verified through LPG passbook validation for absolute security.
            </p>
          </Card>
          <Card className="feature-card p-6 bg-white/80 backdrop-blur-sm border-white/50 shadow-lg hover:shadow-xl transition-shadow">
            <Clock className="w-12 h-12 text-[#FFC857] mb-4" />
            <h3 className="text-xl font-bold mb-2 text-slate-800">Emergency Ready</h3>
            <p className="text-slate-600">
              Find cylinders dynamically within your 3km radius instantly.
            </p>
          </Card>
          <Card className="feature-card p-6 bg-white/80 backdrop-blur-sm border-white/50 shadow-lg hover:shadow-xl transition-shadow">
            <Users className="w-12 h-12 text-[#4CAF50] mb-4" />
            <h3 className="text-xl font-bold mb-2 text-slate-800">Community Trust</h3>
            <p className="text-slate-600">
              Build robust trust scores through verified exchanges with your neighbors.
            </p>
          </Card>
          <Card className="feature-card p-6 bg-white/80 backdrop-blur-sm border-white/50 shadow-lg hover:shadow-xl transition-shadow">
            <CheckCircle className="w-12 h-12 text-[#4A90E2] mb-4" />
            <h3 className="text-xl font-bold mb-2 text-slate-800">Safe & Secure</h3>
            <p className="text-slate-600">
              Track exchanges via blockchain-inspired immutability with complete transparency.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 relative z-10">
        <Card className="p-10 md:p-16 bg-gradient-to-r from-[#FF6B35] to-[#FFC857] border-0 text-white text-center shadow-2xl rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-md">Ready to Join the Community?</h2>
            <p className="text-xl mb-10 opacity-95 max-w-2xl mx-auto font-medium">
              Help your neighbors and never worry about running out of LPG in emergencies again.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-white text-[#FF6B35] hover:bg-slate-50 shadow-xl h-14 px-10 text-lg rounded-full font-bold">
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/90 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFC857] flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-slate-800">GasShare</span>
            </div>
            <p className="text-sm text-slate-500">
              © 2026 GasShare. Supporting communities in need.
            </p>
            <div className="flex gap-6 text-sm text-slate-500 font-medium">
              <Link href="#" className="hover:text-[#FF6B35] transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-[#FF6B35] transition-colors">Terms</Link>
              <Link href="#" className="hover:text-[#FF6B35] transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
