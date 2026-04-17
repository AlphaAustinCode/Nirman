const asyncHandler = require("../utils/asyncHandler");
const { validateAgencyPayload, validateOtpPayload, validateRegistrationPayload, validateLoginPayload } = require("../utils/validators");
const { getConsumerForAgency, getConsumerByRegisteredPhone } = require("../services/agencyService");
const { sendOtp, verifyOtp, isDemoOtpBypassEnabled } = require("../services/otpService");
const { signRegistrationToken } = require("../services/tokenService");
const { registerConsumerAccount, loginWithPhoneAndPassword } = require("../services/userService");
const { normalizeIndianPhone } = require("../utils/normalizePhone");

const validateAgency = asyncHandler(async (req, res) => {
  validateAgencyPayload(req.body);

  const { agency, consumer, normalizedPhone } = await getConsumerForAgency(req.body);

  res.status(200).json({
    success: true,
    message: "Agency and consumer validated successfully",
    data: {
      agency: {
        id: agency._id,
        agency_name: agency.agency_name,
        agency_code: agency.agency_code,
      },
      consumer: {
        id: consumer._id,
        full_name: consumer.full_name,
        passbook_number: consumer.passbook_number,
        is_registered: consumer.is_registered,
        masked_phone: normalizedPhone.replace(/(\+\d{2})\d{6}(\d{4})/, "$1******$2"),
      },
    },
  });
});

const sendConsumerOtp = asyncHandler(async (req, res) => {
  validateAgencyPayload(req.body);

  const { agency, consumer, normalizedPhone } = await getConsumerForAgency(req.body);

  if (consumer.is_registered) {
    return res.status(409).json({
      success: false,
      message: "This LPG consumer is already registered. Please log in instead.",
    });
  }

  const otpMeta = await sendOtp(normalizedPhone);

  res.status(200).json({
    success: true,
    message: isDemoOtpBypassEnabled()
      ? "Demo OTP generated successfully"
      : "OTP sent successfully",
    data: {
      agency_code: agency.agency_code,
      consumer_id: consumer._id,
      phone: normalizedPhone,
      ...otpMeta,
    },
  });
});

const verifyConsumerOtp = asyncHandler(async (req, res) => {
  validateOtpPayload(req.body);

  const phone = normalizeIndianPhone(req.body.phone);
  const { session, user } = await verifyOtp(phone, String(req.body.otp));
  const consumer = await getConsumerByRegisteredPhone(phone);

  const registrationToken = signRegistrationToken({
    consumerId: consumer._id.toString(),
    phone,
    supabaseUserId: user.id,
  });

  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
    data: {
      registration_token: registrationToken,
      supabase_session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_in: session.expires_in,
        token_type: session.token_type,
      },
      user: {
        id: user.id,
        phone: user.phone,
      },
    },
  });
});

const registerConsumer = asyncHandler(async (req, res) => {
  validateRegistrationPayload(req.body);

  const { consumerId, phone } = req.registration;
  const { user, consumer, accessToken } = await registerConsumerAccount({
    consumerId,
    email: req.body.email,
    password: req.body.password,
    secondary_phone: req.body.secondary_phone,
  });

  res.status(201).json({
    success: true,
    message: "Registration completed successfully",
    data: {
      access_token: accessToken,
      user: {
        id: user._id,
        phone: user.phone,
        email: user.email,
      },
      consumer: {
        id: consumer._id,
        full_name: consumer.full_name,
        registered_phone: phone,
        address: consumer.address,
        email: consumer.email,
        secondary_phone: consumer.secondary_phone,
      },
    },
  });
});

const login = asyncHandler(async (req, res) => {
  validateLoginPayload(req.body);

  const { accessToken, user, consumer } = await loginWithPhoneAndPassword(req.body);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      access_token: accessToken,
      user: {
        id: user._id,
        phone: user.phone,
        email: user.email,
      },
      consumer: {
        id: consumer._id,
        full_name: consumer.full_name,
        address: consumer.address,
        agency_id: consumer.agency_id,
      },
    },
  });
});

module.exports = {
  validateAgency,
  sendConsumerOtp,
  verifyConsumerOtp,
  registerConsumer,
  login,
};
