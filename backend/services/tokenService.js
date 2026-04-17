const jwt = require("jsonwebtoken");

const REGISTRATION_TOKEN_EXPIRES_IN = process.env.REGISTRATION_TOKEN_EXPIRES_IN || "15m";
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "7d";

function requireSecret(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

function signRegistrationToken(payload) {
  return jwt.sign(
    {
      ...payload,
      purpose: "registration",
    },
    requireSecret("JWT_REGISTRATION_SECRET"),
    { expiresIn: REGISTRATION_TOKEN_EXPIRES_IN }
  );
}

function verifyRegistrationToken(token) {
  return jwt.verify(token, requireSecret("JWT_REGISTRATION_SECRET"));
}

function signAccessToken(payload) {
  return jwt.sign(
    {
      ...payload,
      purpose: "access",
    },
    requireSecret("JWT_ACCESS_SECRET"),
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
}

module.exports = {
  signRegistrationToken,
  verifyRegistrationToken,
  signAccessToken,
};
