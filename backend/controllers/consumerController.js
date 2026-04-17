const asyncHandler = require("../utils/asyncHandler");
const { getConsumerProfileById } = require("../services/agencyService");

const getConsumerDetails = asyncHandler(async (req, res) => {
  const consumer = await getConsumerProfileById(req.registration.consumerId);

  res.status(200).json({
    success: true,
    message: "Consumer details fetched successfully",
    data: {
      consumer_id: consumer._id,
      full_name: consumer.full_name,
      registered_phone: consumer.registered_phone,
      address: consumer.address,
      email: consumer.email,
      secondary_phone: consumer.secondary_phone,
      is_registered: consumer.is_registered,
      agency: consumer.agency_id,
    },
  });
});

module.exports = {
  getConsumerDetails,
};
