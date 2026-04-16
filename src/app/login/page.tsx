"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flame, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Welcome back!");
      router.push("/app");
    }, 1500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background with abstract shapes mimicking Gas rings/WebGPU particles but in CSS for speed */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-50">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#FF6B35]/20 to-[#FFC857]/20 blur-[100px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tl from-[#FF6B35]/10 to-[#4A90E2]/10 blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFC857] flex items-center justify-center shadow-lg shadow-[#FF6B35]/20 group-hover:scale-110 transition-transform">
              <Flame className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-extrabold bg-gradient-to-r from-[#FF6B35] to-[#FFC857] bg-clip-text text-transparent">
              GasShare
            </span>
          </Link>
        </div>

        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-slate-800">Welcome Back</CardTitle>
            <CardDescription className="text-center text-slate-500 font-medium">
              Enter your phone number to sign in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-bold">Phone Number</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">+91</span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your 10 digit number"
                    className="pl-12 h-14 bg-slate-50 border-slate-200 text-lg rounded-xl focus:border-[#FF6B35] focus:ring-[#FF6B35]/20 transition-all font-medium"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="link" className="px-0 text-[#FF6B35] font-semibold text-sm hover:text-[#FF6B35]/80 hover:no-underline">
                  Forgot Password?
                </Button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-[#FF6B35] to-[#FFC857] hover:opacity-90 shadow-lg text-lg rounded-xl font-bold transition-all"
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-slate-100 pt-6">
            <p className="text-slate-500 font-medium selection:bg-[#FFE5D9]">
              Don't have an account?{" "}
              <Link href="/register" className="text-[#FF6B35] font-bold hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
