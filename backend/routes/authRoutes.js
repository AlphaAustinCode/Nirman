const express = require("express");

const registrationAuth = require("../middleware/registrationAuth");
const { authLimiter } = require("../middleware/rateLimiters");
const {
  validateAgency,
  sendConsumerOtp,
  verifyConsumerOtp,
  registerConsumer,
  login,
} = require("../controllers/authController");

const router = express.Router();

router.post("/validate-agency", authLimiter, validateAgency);
router.post("/send-otp", authLimiter, sendConsumerOtp);
router.post("/verify-otp", authLimiter, verifyConsumerOtp);
router.post("/register", authLimiter, registrationAuth, registerConsumer);
router.post("/login", authLimiter, login);

module.exports = router;
