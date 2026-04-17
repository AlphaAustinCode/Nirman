const ApiError = require("../utils/ApiError");
const { verifyRegistrationToken } = require("../services/tokenService");

module.exports = function registrationAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new ApiError(401, "Registration token is required"));
  }

  try {
    const payload = verifyRegistrationToken(token);
    if (payload.purpose !== "registration") {
      throw new ApiError(401, "Invalid registration token");
    }

    req.registration = payload;
    return next();
  } catch (error) {
    return next(new ApiError(401, "Registration token is invalid or expired"));
  }
};
