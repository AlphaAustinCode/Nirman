const jwt = require("jsonwebtoken");

const ApiError = require("../utils/ApiError");
const User = require("../models/User");

module.exports = async function accessAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new ApiError(401, "Access token is required");
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    if (decoded.purpose !== "access" || !decoded.userId) {
      throw new ApiError(401, "Invalid access token");
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new ApiError(401, "Authenticated user no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, "Access token is invalid or expired"));
  }
};
