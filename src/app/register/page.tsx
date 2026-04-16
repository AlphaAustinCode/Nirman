"use client";

import React, { useState } from "react";
import { CheckCircle2, ChevronRight, Flame, Loader2, Lock, ShieldCheck, User } from "lucide-react";
// Assuming you have a UI Button component or just standard HTML buttons. I'll use styled standard HTML for portability.

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Unified State for the 4-Step Form
  const [formData, setFormData] = useState({
    agencyId: "",
    lpgId: "",
    otp: "",
    name: "",
    phone: "",
    address: "",
    email: "",
    secondaryPhone: "",
    password: "",
    confirmPassword: "",
  });

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear errors on typing
  };

  // --- MOCK API CALLS (Perfect for Hackathon Demo) ---

  const handleAgencyValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.lpgId.length !== 17) {
      setError("LPG ID must be exactly 17 digits.");
      return;
    }
    setIsLoading(true);
    // Simulate DB Check
    setTimeout(() => {
      setIsLoading(false);
      setStep(2); // Move to OTP
    }, 1200);
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate OTP Check AND fetching user data from Agency DB
    setTimeout(() => {
      setIsLoading(false);
      // Auto-fill Step 3 data mock
      setFormData((prev) => ({
        ...prev,
        name: "Rahul Sharma",
        phone: "+91 9876543210", // Registered phone
        address: "A-12, Vihar Phase 2, New Delhi",
        email: "rahul.sharma@example.com", // Example of existing email
      }));
      setStep(3); // Move to Profile
    }, 1500);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      setError("Email is compulsory.");
      return;
    }
    setStep(4); // Move to Password
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 6 || !/\d/.test(formData.password) || !/[a-zA-Z]/.test(formData.password)) {
      setError("Password must be at least 6 characters and include letters and numbers.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    // Simulate Final Registration
    setTimeout(() => {
      setIsLoading(false);
      alert("Registration Successful! Redirecting to Dashboard...");
      // window.location.href = "/app"; // Redirect to app dashboard
    }, 1500);
  };

  // --- RENDER HELPERS ---

  const stepIndicators = [
    { num: 1, label: "Agency", icon: Flame },
    { num: 2, label: "Security", icon: ShieldCheck },
    { num: 3, label: "Profile", icon: User },
    { num: 4, label: "Account", icon: Lock },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-4">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-96 bg-[#FF6B35]/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative z-10 p-8">

        {/* Header & Step Indicator */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">Create Account</h1>
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 z-0"></div>
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#FF6B35] z-0 transition-all duration-500"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>

            {stepIndicators.map((s, index) => {
              const Icon = s.icon;
              const isActive = step >= s.num;
              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${isActive ? "bg-[#FF6B35] text-white" : "bg-slate-800 text-slate-400"}`}>
                    {step > s.num ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                  </div>
                  <span className={`text-xs font-medium ${isActive ? "text-[#FF6B35]" : "text-slate-500"}`}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 rounded bg-red-500/10 border border-red-500/50 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* --- STEP 1: AGENCY VALIDATION --- */}
        {step === 1 && (
          <form onSubmit={handleAgencyValidation} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Agency ID</label>
              <input
                type="text" name="agencyId" required value={formData.agencyId} onChange={handleChange}
                placeholder="e.g., IND001"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-colors uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">17-Digit LPG ID / Passbook No.</label>
              <input
                type="text" name="lpgId" required maxLength={17} value={formData.lpgId} onChange={handleChange}
                placeholder="00000000000000000"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-colors tracking-widest font-mono"
              />
            </div>
            <button disabled={isLoading} type="submit" className="w-full bg-[#FF6B35] hover:bg-[#e85a24] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Validate Agency Details"} <ChevronRight size={18} />
            </button>
          </form>
        )}

        {/* --- STEP 2: SECURITY CHECK (OTP) --- */}
        {step === 2 && (
          <form onSubmit={handleOtpVerification} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-4">
              <p className="text-sm text-slate-400">We found your records. We've sent a 6-digit OTP to your registered mobile number associated with this LPG ID.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1 text-center">Enter OTP</label>
              <input
                type="text" name="otp" required maxLength={6} value={formData.otp} onChange={handleChange}
                placeholder="------"
                className="w-full text-center text-3xl tracking-[1em] bg-slate-950 border border-slate-800 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-colors"
              />
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition-colors">Back</button>
              <button disabled={isLoading} type="submit" className="w-2/3 bg-[#FF6B35] hover:bg-[#e85a24] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Verify Identity"}
              </button>
            </div>
          </form>
        )}

        {/* --- STEP 3: CONSUMER PROFILE --- */}
        {step === 3 && (
          <form onSubmit={handleProfileUpdate} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 mb-4">
              <p className="text-xs text-amber-400 flex items-center gap-2 mb-2"><Lock size={14} /> Official Agency Data (Non-Editable)</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Name:</span> <p className="text-white font-medium">{formData.name}</p></div>
                <div><span className="text-slate-500">Primary Phone:</span> <p className="text-white font-medium">{formData.phone}</p></div>
                <div className="col-span-2"><span className="text-slate-500">Registered Address:</span> <p className="text-white font-medium">{formData.address}</p></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-3">* To change these details, please contact your local distributor.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Email Address <span className="text-red-500">*</span></label>
              <input
                type="email" name="email" required value={formData.email} onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Secondary Phone (Optional)</label>
              <input
                type="tel" name="secondaryPhone" value={formData.secondaryPhone} onChange={handleChange}
                placeholder="Alternative contact number"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-colors"
              />
            </div>
            <button type="submit" className="w-full bg-[#FF6B35] hover:bg-[#e85a24] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
              Continue to Account Setup <ChevronRight size={18} />
            </button>
          </form>
        )}

        {/* --- STEP 4: ACCOUNT SETUP --- */}
        {step === 4 && (
          <form onSubmit={handleFinalSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Create Password</label>
              <input
                type="password" name="password" required value={formData.password} onChange={handleChange}
                placeholder="Min 6 chars, letters & numbers"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Confirm Password</label>
              <input
                type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-colors"
              />
            </div>
            <div className="flex gap-4 pt-2">
              <button type="button" onClick={() => setStep(3)} className="w-1/3 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition-colors">Back</button>
              <button disabled={isLoading} type="submit" className="w-2/3 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Complete Registration"}
              </button>
            </div>
          </form>
        )}

      </div>
    </main>
  );
}