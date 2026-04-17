const User = require("../models/User");
const TrustEvent = require("../models/TrustEvent");

async function applyTrustDelta({ userId, delta, reason, exchangeRequestId = null }) {
  const user = await User.findById(userId);
  if (!user) {
    return null;
  }

  user.trust_score = Math.max(0, Math.min(100, user.trust_score + delta));
  await user.save();

  await TrustEvent.create({
    user_id: user._id,
    exchange_request_id: exchangeRequestId,
    delta,
    reason,
  });

  return user;
}

module.exports = {
  applyTrustDelta,
};
