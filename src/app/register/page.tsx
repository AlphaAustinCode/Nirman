"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Flame,
  Loader2,
  Lock,
  ShieldCheck,
  User,
} from "lucide-react";

type RegisterFormData = {
  agencyId: string;
  lpgId: string;
  otp: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  secondaryPhone: string;
  password: string;
  confirmPassword: string;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

type AgencyValidationData = {
  consumer: {
    id: string;
    full_name: string;
    is_registered: boolean;
    masked_phone: string;
  };
};

type SendOtpData = {
  consumer_id: string;
  phone: string;
  expires_in_seconds: number;
  resend_after_seconds: number;
};

type VerifyOtpData = {
  registration_token: string;
};

type ConsumerDetailsData = {
  full_name: string;
  registered_phone: string;
  address: string;
  email: string | null;
  secondary_phone: string | null;
};

type RegisterData = {
  access_token: string;
  user: {
    id: string;
    phone: string;
    email: string;
  };
  consumer: {
    id: string;
    full_name: string;
    registered_phone: string;
    address: string;
    email: string | null;
    secondary_phone: string | null;
  };
};

async function parseApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Request failed");
  }

  return payload;
}

function formatPhoneForDisplay(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length >= 10) {
    const lastTen = digits.slice(-10);
    return `${lastTen.slice(0, 5)} ${lastTen.slice(5)}`;
  }

  return phone;
}

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [registrationToken, setRegistrationToken] = useState("");

  const [formData, setFormData] = useState<RegisterFormData>({
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

  const stepIndicators = [
    { num: 1, label: "Verify", icon: ShieldCheck },
    { num: 2, label: "OTP", icon: CreditCard },
    { num: 3, label: "Profile", icon: User },
    { num: 4, label: "Account", icon: Lock },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError("");
    setStatusMessage("");

    if (name === "agencyId") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.toUpperCase(),
      }));
      return;
    }

    if (name === "lpgId") {
      const onlyDigits = value.replace(/\D/g, "").slice(0, 17);
      setFormData((prev) => ({
        ...prev,
        [name]: onlyDigits,
      }));
      return;
    }

    if (name === "otp") {
      const onlyDigits = value.replace(/\D/g, "").slice(0, 6);
      setFormData((prev) => ({
        ...prev,
        [name]: onlyDigits,
      }));
      return;
    }

    if (name === "secondaryPhone") {
      const onlyDigits = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: onlyDigits,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAgencyValidation = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");
    setStatusMessage("");

    if (!formData.agencyId.trim()) {
      setError("Please enter your agency ID.");
      return;
    }

    if (!/^\d{17}$/.test(formData.lpgId)) {
      setError("Please enter a valid 17-digit LPG ID / Passbook number.");
      return;
    }

    try {
      setIsLoading(true);

      const validateResponse = await fetch("/api/auth/validate-agency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agency_code: formData.agencyId,
          passbook_number: formData.lpgId,
        }),
      });

      const validatePayload =
        await parseApiResponse<AgencyValidationData>(validateResponse);

      if (validatePayload.data?.consumer.is_registered) {
        throw new Error(
          "This LPG consumer is already registered. Please sign in instead."
        );
      }

      setMaskedPhone(validatePayload.data?.consumer.masked_phone || "");

      const sendOtpResponse = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agency_code: formData.agencyId,
          passbook_number: formData.lpgId,
        }),
      });

      const sendOtpPayload = await parseApiResponse<SendOtpData>(sendOtpResponse);
      setVerifiedPhone(sendOtpPayload.data?.phone || "");
      setStatusMessage(sendOtpPayload.message || "OTP sent successfully.");
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to verify LPG details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");
    setStatusMessage("");

    if (!/^\d{6}$/.test(formData.otp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setIsLoading(true);

      const verifyResponse = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: verifiedPhone,
          otp: formData.otp,
        }),
      });

      const verifyPayload = await parseApiResponse<VerifyOtpData>(verifyResponse);
      const token = verifyPayload.data?.registration_token;

      if (!token) {
        throw new Error("Registration token was not returned after OTP verification.");
      }

      setRegistrationToken(token);

      const profileResponse = await fetch("/api/auth/consumer-details", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const profilePayload =
        await parseApiResponse<ConsumerDetailsData>(profileResponse);

      setFormData((prev) => ({
        ...prev,
        name: profilePayload.data?.full_name || "",
        phone: formatPhoneForDisplay(profilePayload.data?.registered_phone || ""),
        address: profilePayload.data?.address || "",
        email: profilePayload.data?.email || "",
        secondaryPhone: profilePayload.data?.secondary_phone
          ? formatPhoneForDisplay(profilePayload.data.secondary_phone).replace(/\s/g, "")
          : "",
      }));

      setStatusMessage("OTP verified successfully. Review your LPG profile details.");
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");
    setStatusMessage("");

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    if (!emailOk) {
      setError("Please enter a valid email address.");
      return;
    }

    if (
      formData.secondaryPhone &&
      !/^\d{10}$/.test(formData.secondaryPhone)
    ) {
      setError("Secondary phone must be a valid 10-digit number.");
      return;
    }

    setStep(4);
  };

  const handleFinalSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");
    setStatusMessage("");

    if (!registrationToken) {
      setError("Your registration session has expired. Please verify OTP again.");
      setStep(2);
      return;
    }

    if (!formData.password || !formData.confirmPassword) {
      setError("Please complete the password fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const hasLetter = /[A-Za-z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);

    if (!hasLetter || !hasNumber) {
      setError("Password must contain both letters and numbers.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${registrationToken}`,
        },
        body: JSON.stringify({
          email: formData.email,
          secondary_phone: formData.secondaryPhone
            ? `+91${formData.secondaryPhone}`
            : undefined,
          password: formData.password,
        }),
      });

      const payload = await parseApiResponse<RegisterData>(response);

      if (payload.data?.access_token) {
        localStorage.setItem("token", payload.data.access_token);
      }

      if (payload.data?.user) {
        localStorage.setItem("user", JSON.stringify(payload.data.user));
      }

      router.push("/login?registered=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const progressWidth = `${((step - 1) / 3) * 100}%`;

  return (
    <main className="auth-page-bg flex h-screen overflow-hidden flex-col">
      <div className="auth-shell flex flex-1 items-center justify-center py-3">
        <div className="auth-card auth-bottom-sheet fade-scale w-full max-w-6xl max-h-[92vh] overflow-hidden">
          <div className="auth-card-inner grid h-full grid-cols-1 lg:grid-cols-[0.95fr_1.2fr]">
            <section className="auth-divider flex flex-col justify-between border-b border-slate-200/50 px-5 py-5 lg:border-b-0 lg:px-7 lg:py-6">
              <div>
                <div className="auth-kicker mb-4 w-fit">
                  <Flame size={15} />
                  Smart LPG Registration
                </div>

                <h1 className="mb-3 text-3xl font-semibold leading-tight tracking-tight text-slate-900 lg:text-4xl">
                  Create your account with a secure registration flow.
                </h1>

                <p className="mb-5 text-sm leading-6 text-slate-600 lg:text-[15px]">
                  Verify LPG details, confirm OTP, complete your profile, and
                  create your account in a few simple steps.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="glass-panel p-3.5">
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                      <ShieldCheck size={17} />
                    </div>
                    <h3 className="mb-1 text-sm font-semibold text-slate-800">
                      Verified onboarding
                    </h3>
                    <p className="text-xs leading-5 text-slate-500">
                      Identity-first registration using LPG details and OTP.
                    </p>
                  </div>

                  <div className="glass-panel p-3.5">
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                      <Lock size={17} />
                    </div>
                    <h3 className="mb-1 text-sm font-semibold text-slate-800">
                      Safe account setup
                    </h3>
                    <p className="text-xs leading-5 text-slate-500">
                      Secure and professional experience for every user.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[20px] border border-blue-100 bg-white/60 p-4 shadow-sm">
                <p className="mb-2 text-sm font-semibold text-slate-700">
                  Registration flow
                </p>
                <div className="grid gap-2 text-xs text-slate-600">
                  <div className="soft-chip">1. Verify agency and LPG ID</div>
                  <div className="soft-chip">2. Confirm OTP</div>
                  <div className="soft-chip">3. Complete contact profile</div>
                  <div className="soft-chip">4. Create password</div>
                </div>
              </div>
            </section>

            <section className="flex flex-col justify-center px-5 py-5 lg:px-7 lg:py-6">
              <div className="mx-auto w-full max-w-2xl">
                <div className="mb-5">
                  <div className="mb-2 text-xs font-semibold tracking-[0.18em] text-blue-700">
                    REGISTER
                  </div>
                  <h2 className="mb-1 text-2xl font-semibold tracking-tight text-slate-900 lg:text-3xl">
                    Create Account
                  </h2>
                  <p className="text-sm leading-6 text-slate-500">
                    Complete the steps below to finish your registration.
                  </p>
                </div>

                <div className="mb-5">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 top-4 h-[3px] w-full rounded-full bg-slate-200" />
                    <div
                      className="absolute left-0 top-4 h-[3px] rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-500 transition-all duration-500"
                      style={{ width: progressWidth }}
                    />

                    {stepIndicators.map((s) => {
                      const Icon = s.icon;
                      const isActive = step >= s.num;
                      const isDone = step > s.num;

                      return (
                        <div
                          key={s.num}
                          className="relative z-10 flex flex-col items-center gap-1.5"
                        >
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm transition-all duration-300 lg:h-10 lg:w-10 ${
                              isActive
                                ? "border-blue-500 bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-200"
                                : "border-slate-200 bg-white text-slate-400"
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 size={16} />
                            ) : (
                              <Icon size={16} />
                            )}
                          </div>
                          <span
                            className={`text-[11px] font-medium lg:text-xs ${
                              isActive ? "text-blue-700" : "text-slate-400"
                            }`}
                          >
                            {s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {error && <div className="alert-error mb-4">{error}</div>}
                {statusMessage && !error && (
                  <div className="mb-4 rounded-[16px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {statusMessage}
                  </div>
                )}

                {step === 1 && (
                  <form
                    onSubmit={handleAgencyValidation}
                    className="space-y-4 fade-up"
                  >
                    <div className="grid gap-4">
                      <div>
                        <label className="label-premium">Agency ID</label>
                        <input
                          type="text"
                          name="agencyId"
                          required
                          value={formData.agencyId}
                          onChange={handleChange}
                          placeholder="e.g. IND001"
                          className="input-premium uppercase"
                        />
                      </div>

                      <div>
                        <label className="label-premium">
                          17-Digit LPG ID / Passbook Number
                        </label>
                        <input
                          type="text"
                          name="lpgId"
                          required
                          maxLength={17}
                          value={formData.lpgId}
                          onChange={handleChange}
                          placeholder="00000000000000000"
                          className="input-premium font-mono tracking-[0.22em]"
                        />
                      </div>
                    </div>

                    <button
                      disabled={isLoading}
                      type="submit"
                      className="btn-premium w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Verifying details...
                        </>
                      ) : (
                        <>
                          Continue to OTP
                          <ChevronRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {step === 2 && (
                  <form
                    onSubmit={handleOtpVerification}
                    className="space-y-4 fade-up"
                  >
                    <div className="glass-panel p-4">
                      <p className="mb-1 text-sm font-semibold text-slate-800">
                        OTP sent successfully
                      </p>
                      <p className="text-sm leading-6 text-slate-500">
                        We sent a 6-digit OTP to {maskedPhone || "your registered mobile number"}.
                      </p>
                    </div>

                    <div>
                      <label className="label-premium text-center">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        name="otp"
                        required
                        maxLength={6}
                        value={formData.otp}
                        onChange={handleChange}
                        placeholder="------"
                        className="input-premium text-center text-xl tracking-[0.7em] font-semibold lg:text-2xl"
                      />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="btn-secondary-premium w-full sm:w-1/3"
                      >
                        Back
                      </button>

                      <button
                        disabled={isLoading}
                        type="submit"
                        className="btn-premium w-full sm:w-2/3"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />
                            Verifying OTP...
                          </>
                        ) : (
                          <>
                            Verify Identity
                            <ArrowRight size={18} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {step === 3 && (
                  <form
                    onSubmit={handleProfileUpdate}
                    className="space-y-4 fade-up"
                  >
                    <div className="rounded-[20px] border border-amber-100 bg-amber-50/80 p-4">
                      <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                        <Lock size={13} />
                        Official Agency Data (Non-Editable)
                      </p>

                      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                        <div>
                          <span className="text-slate-500">Name</span>
                          <p className="font-medium text-slate-900">
                            {formData.name}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500">Primary Phone</span>
                          <p className="font-medium text-slate-900">
                            {formData.phone}
                          </p>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-slate-500">
                            Registered Address
                          </span>
                          <p className="font-medium text-slate-900">
                            {formData.address}
                          </p>
                        </div>
                      </div>

                      <p className="mt-2 text-[11px] text-slate-500">
                        To change these details, contact your local LPG
                        distributor.
                      </p>
                    </div>

                    <div>
                      <label className="label-premium">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="input-premium"
                      />
                    </div>

                    <div>
                      <label className="label-premium">
                        Secondary Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        name="secondaryPhone"
                        value={formData.secondaryPhone}
                        onChange={handleChange}
                        placeholder="Alternative contact number"
                        className="input-premium"
                      />
                    </div>

                    <button type="submit" className="btn-premium w-full">
                      Continue to Account Setup
                      <ChevronRight size={18} />
                    </button>
                  </form>
                )}

                {step === 4 && (
                  <form
                    onSubmit={handleFinalSubmit}
                    className="space-y-4 fade-up"
                  >
                    <div>
                      <label className="label-premium">
                        Create Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Minimum 6 characters with letters and numbers"
                        className="input-premium"
                      />
                    </div>

                    <div>
                      <label className="label-premium">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                        className="input-premium"
                      />
                    </div>

                    <div className="rounded-[16px] border border-blue-100 bg-blue-50/70 p-3 text-sm text-slate-600">
                      Use a strong password with both letters and numbers for
                      better account security.
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="btn-secondary-premium w-full sm:w-1/3"
                      >
                        Back
                      </button>

                      <button
                        disabled={isLoading}
                        type="submit"
                        className="btn-premium w-full sm:w-2/3"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />
                            Creating account...
                          </>
                        ) : (
                          <>
                            Complete Registration
                            <ChevronRight size={18} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                <div className="mt-5 border-t border-slate-200/70 pt-4 text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-blue-700 transition hover:text-indigo-700"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <footer className="auth-footer py-2">
        <div className="text-sm text-slate-500">(c) 2026 LPG Platform</div>

        <div className="auth-footer-links">
          <Link href="/policy">Policy</Link>
          <Link href="/terms">Terms & Conditions</Link>
          <Link href="/support">Support</Link>
        </div>
      </footer>
    </main>
  );
}
