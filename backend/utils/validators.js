const ApiError = require("./ApiError");

function assertRequiredFields(payload, fields) {
  const missing = fields.filter((field) => {
    const value = payload[field];
    return value === undefined || value === null || value === "";
  });

  if (missing.length > 0) {
    throw new ApiError(400, `Missing required fields: ${missing.join(", ")}`);
  }
}

function validateAgencyPayload(payload) {
  assertRequiredFields(payload, ["agency_code", "passbook_number"]);

  if (!/^[A-Z]{3}\d{3}$/.test(String(payload.agency_code).toUpperCase())) {
    throw new ApiError(400, "agency_code must look like IND001");
  }

  if (!/^\d{17}$/.test(String(payload.passbook_number))) {
    throw new ApiError(400, "passbook_number must be exactly 17 digits");
  }
}

function validateOtpPayload(payload) {
  assertRequiredFields(payload, ["phone", "otp"]);

  if (!/^\d{6}$/.test(String(payload.otp))) {
    throw new ApiError(400, "otp must be a 6-digit code");
  }
}

function validateRegistrationPayload(payload) {
  assertRequiredFields(payload, ["email", "password"]);

  const email = String(payload.email).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, "email must be valid");
  }

  const password = String(payload.password);
  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/.test(password)) {
    throw new ApiError(
      400,
      "password must be at least 6 characters and include letters and numbers"
    );
  }

  if (payload.secondary_phone && !/^\+?\d{10,15}$/.test(String(payload.secondary_phone))) {
    throw new ApiError(400, "secondary_phone must be a valid phone number");
  }
}

function validateLoginPayload(payload) {
  assertRequiredFields(payload, ["phone", "password"]);
}

module.exports = {
  assertRequiredFields,
  validateAgencyPayload,
  validateOtpPayload,
  validateRegistrationPayload,
  validateLoginPayload,
};
