const ApiError = require("./ApiError");

function normalizeIndianPhone(phone) {
  if (!phone) {
    throw new ApiError(400, "Phone number is required");
  }

  const digits = String(phone).replace(/\D/g, "");

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }

  if (digits.length === 13 && digits.startsWith("091")) {
    return `+${digits.slice(1)}`;
  }

  if (String(phone).startsWith("+") && /^\+\d{10,15}$/.test(phone)) {
    return phone;
  }

  throw new ApiError(400, "Phone number must be a valid Indian mobile number");
}

module.exports = {
  normalizeIndianPhone,
};
