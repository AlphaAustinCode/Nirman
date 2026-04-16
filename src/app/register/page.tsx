"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flame, ArrowRight, ArrowLeft, Loader2, CheckCircle, UploadCloud, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import gsap from "gsap";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Step 1
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Step 2
  const [passbookFile, setPassbookFile] = useState<File | null>(null);

  // Step 3
  const [details, setDetails] = useState({ name: "", address: "" });

  const handleSendOTP = () => {
    if (phone.length < 10) return toast.error("Enter valid 10-digit phone number");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      toast.success("OTP Sent to +91 " + phone);
    }, 1000);
  };

  const handleVerifyOTP = () => {
    if (otp.join("").length < 6) return toast.error("Enter complete OTP");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Phone verified!");
      setStep(2);
    }, 1000);
  };

  const handlePassbookUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passbookFile) return toast.error("Please upload first page of your passbook");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Passbook verified successfully!");
      setStep(3);
    }, 1500);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.name || !details.address) return toast.error("Fill all details");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Account created successfully!");
      router.push("/app");
    }, 1500);
  };

  // Simple OTP Input handler
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // limit to 1 char
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Focus next logic (Basic implementation)
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-slate-50">
      <div className="relative z-10 w-full max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFC857] flex items-center justify-center shadow-lg">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-[#FF6B35] to-[#FFC857] bg-clip-text text-transparent">
              GasShare
            </span>
          </Link>
        </div>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden">
          {/* Progress Bar */}
          <div className="flex h-2 bg-slate-100">
             <div className="bg-[#FF6B35] transition-all duration-500 ease-out h-full" style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>
          
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4 mb-2">
              {step > 1 && (
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setStep(step - 1)}>
                   <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800">
                  {step === 1 && "Create Account"}
                  {step === 2 && "Verification"}
                  {step === 3 && "Personal Details"}
                </CardTitle>
                <CardDescription className="font-medium text-slate-500 mt-1">
                  Step {step} of 3
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pb-6">
            {/* Step 1: Phone & OTP */}
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-8 fade-in">
                {!otpSent ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-bold">Phone Number</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">+91</span>
                        <Input
                          type="tel"
                          placeholder="10 digit number"
                          className="pl-12 h-14 bg-slate-50"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          maxLength={10}
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={handleSendOTP} 
                      disabled={isLoading}
                      className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white shadow-xl text-lg rounded-xl"
                    >
                      {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Send OTP"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2 text-center">
                      <Label className="text-slate-700 font-bold block mb-4">Enter 6-digit OTP sent to +91 {phone}</Label>
                      <div className="flex justify-center gap-2">
                        {otp.map((digit, i) => (
                          <Input
                            key={i}
                            id={`otp-${i}`}
                            type="text"
                            maxLength={1}
                            className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-slate-50 focus:border-[#FF6B35]"
                            value={digit}
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                          />
                        ))}
                      </div>
                    </div>
                    <Button 
                      onClick={handleVerifyOTP} 
                      disabled={isLoading}
                      className="w-full h-14 bg-gradient-to-r from-[#FF6B35] to-[#FFC857] hover:opacity-90 shadow-xl text-lg rounded-xl"
                    >
                      {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Verify & Continue"}
                    </Button>
                    <div className="text-center">
                      <button onClick={() => setOtpSent(false)} className="text-sm font-bold text-[#FF6B35]">Change Phone Number</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Passbook Validation */}
            {step === 2 && (
              <form onSubmit={handlePassbookUpload} className="space-y-6 animate-in slide-in-from-right-8 fade-in">
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100 mb-4">
                    <ShieldCheck className="h-6 w-6 text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-sm">Why do we need this?</p>
                      <p className="text-xs mt-1">To ensure community safety, all users must verify they have a legitimate LPG connection by uploading their passbook's first page.</p>
                    </div>
                  </div>
                  
                  <Label className="text-slate-700 font-bold block mb-2">Upload Passbook Image</Label>
                  <label htmlFor="passbook" className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {passbookFile ? (
                        <>
                          <CheckCircle className="w-10 h-10 text-[#4CAF50] mb-3" />
                          <p className="mb-2 text-sm text-slate-800 font-bold">{passbookFile.name}</p>
                          <p className="text-xs text-slate-500">Click to change</p>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
                          <p className="mb-2 text-sm text-slate-500"><span className="font-semibold text-[#FF6B35]">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-slate-400">PNG, JPG up to 5MB</p>
                        </>
                      )}
                    </div>
                    <input id="passbook" type="file" className="hidden" accept="image/*" onChange={(e) => setPassbookFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-14 bg-gradient-to-r from-[#FF6B35] to-[#FFC857] hover:opacity-90 shadow-xl text-lg rounded-xl"
                >
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Verify Document"}
                </Button>
              </form>
            )}

            {/* Step 3: Personal Details */}
            {step === 3 && (
              <form onSubmit={handleFinalSubmit} className="space-y-6 animate-in slide-in-from-right-8 fade-in">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold">Full Name</Label>
                    <Input
                      placeholder="As per passbook"
                      className="h-14 bg-slate-50"
                      value={details.name}
                      onChange={(e) => setDetails({ ...details, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold">Residency Address / Sector</Label>
                    <Input
                      placeholder="e.g. Sector 12, Noida"
                      className="h-14 bg-slate-50"
                      value={details.address}
                      onChange={(e) => setDetails({ ...details, address: e.target.value })}
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white shadow-xl text-lg rounded-xl mt-4"
                >
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Complete Registration"}
                </Button>
              </form>
            )}
          </CardContent>

          {step === 1 && (
            <CardFooter className="justify-center border-t border-slate-100 pt-6 pb-6">
              <p className="text-slate-500 font-medium">
                Already have an account?{" "}
                <Link href="/login" className="text-[#FF6B35] font-bold hover:underline">
                  Log in
                </Link>
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
