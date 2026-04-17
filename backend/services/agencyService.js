const Agency = require("../models/Agency");
const Consumer = require("../models/Consumer");
const ApiError = require("../utils/ApiError");
const { normalizeIndianPhone } = require("../utils/normalizePhone");

async function findAgencyByCode(agencyCode) {
  const normalizedCode = String(agencyCode).toUpperCase().trim();
  const agency = await Agency.findOne({ agency_code: normalizedCode });

  if (!agency) {
    throw new ApiError(404, "Agency not found");
  }

  return agency;
}

async function getConsumerForAgency({ agency_code, passbook_number }) {
  const agency = await findAgencyByCode(agency_code);

  const consumer = await Consumer.findOne({
    agency_id: agency._id,
    passbook_number: String(passbook_number).trim(),
  });

  if (!consumer) {
    throw new ApiError(404, "Consumer record not found for the given agency and passbook");
  }

  return {
    agency,
    consumer,
    normalizedPhone: normalizeIndianPhone(consumer.registered_phone),
  };
}

async function getConsumerProfileById(consumerId) {
  const consumer = await Consumer.findById(consumerId).populate("agency_id", "agency_name agency_code");

  if (!consumer) {
    throw new ApiError(404, "Consumer not found");
  }

  return consumer;
}

async function getConsumerByRegisteredPhone(phone) {
  const consumer = await Consumer.findOne({ registered_phone: phone });

  if (!consumer) {
    throw new ApiError(404, "No consumer is linked to the verified phone number");
  }

  return consumer;
}

module.exports = {
  getConsumerForAgency,
  getConsumerProfileById,
  getConsumerByRegisteredPhone,
};
