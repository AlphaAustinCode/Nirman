const { getSupabaseOtpClient } = require("../config/supabase");
const ApiError = require("../utils/ApiError");

function isDemoOtpBypassEnabled() {
  return String(process.env.DEMO_OTP_BYPASS || "").toLowerCase() === "true";
}

async function sendOtp(phone) {
  if (isDemoOtpBypassEnabled()) {
    return {
      phone,
      expires_in_seconds: Number(process.env.OTP_EXPIRY_SECONDS || 3600),
      resend_after_seconds: Number(process.env.OTP_RESEND_SECONDS || 60),
      demo_mode: true,
      demo_otp: process.env.DEMO_OTP_CODE || "123456",
    };
  }

  const supabase = getSupabaseOtpClient();
  const { error } = await supabase.auth.signInWithOtp({
    phone,
  });

  if (error) {
    throw new ApiError(502, `Supabase OTP send failed: ${error.message}`);
  }

  return {
    phone,
    expires_in_seconds: Number(process.env.OTP_EXPIRY_SECONDS || 3600),
    resend_after_seconds: Number(process.env.OTP_RESEND_SECONDS || 60),
  };
}

async function verifyOtp(phone, otp) {
  if (isDemoOtpBypassEnabled()) {
    const expectedOtp = process.env.DEMO_OTP_CODE || "123456";

    if (String(otp) !== expectedOtp) {
      throw new ApiError(401, "Invalid demo OTP");
    }

    return {
      session: {
        access_token: "demo-access-token",
        refresh_token: "demo-refresh-token",
        expires_in: Number(process.env.OTP_EXPIRY_SECONDS || 3600),
        token_type: "bearer",
      },
      user: {
        id: `demo-user-${phone.replace(/\D/g, "")}`,
        phone,
      },
    };
  }

  const supabase = getSupabaseOtpClient();
  const {
    data: { session, user },
    error,
  } = await supabase.auth.verifyOtp({
    phone,
    token: otp,
    type: "sms",
  });

  if (error || !session || !user) {
    throw new ApiError(401, error?.message || "OTP verification failed");
  }

  return {
    session,
    user,
  };
}

module.exports = {
  sendOtp,
  verifyOtp,
  isDemoOtpBypassEnabled,
};
