const bcrypt = require("bcryptjs");

const Consumer = require("../models/Consumer");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const { normalizeIndianPhone } = require("../utils/normalizePhone");
const { signAccessToken } = require("./tokenService");

async function registerConsumerAccount({
  consumerId,
  email,
  password,
  secondary_phone = null,
}) {
  const consumer = await Consumer.findById(consumerId);

  if (!consumer) {
    throw new ApiError(404, "Consumer not found");
  }

  if (consumer.is_registered) {
    throw new ApiError(409, "This consumer is already registered");
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedPhone = normalizeIndianPhone(consumer.registered_phone);
  const normalizedSecondaryPhone = secondary_phone
    ? normalizeIndianPhone(secondary_phone)
    : null;

  const existingUserByEmail = await User.findOne({ email: normalizedEmail });
  if (existingUserByEmail) {
    throw new ApiError(409, "Email is already in use");
  }

  const existingUserByConsumer = await User.findOne({ consumer_id: consumer._id });
  if (existingUserByConsumer) {
    throw new ApiError(409, "User account already exists for this consumer");
  }

  const passwordHash = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS || 12));

  const user = await User.create({
    consumer_id: consumer._id,
    phone: normalizedPhone,
    email: normalizedEmail,
    password: passwordHash,
    full_name: consumer.full_name,
  });

  consumer.email = normalizedEmail;
  consumer.secondary_phone = normalizedSecondaryPhone;
  consumer.is_registered = true;
  await consumer.save();

  const accessToken = signAccessToken({
    userId: user._id.toString(),
    consumerId: consumer._id.toString(),
    phone: user.phone,
    email: user.email,
  });

  return {
    user,
    consumer,
    accessToken,
  };
}

async function loginWithPhoneAndPassword({ phone, password }) {
  const normalizedPhone = normalizeIndianPhone(phone);
  const user = await User.findOne({ phone: normalizedPhone }).populate("consumer_id");

  if (!user) {
    throw new ApiError(401, "Invalid phone or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid phone or password");
  }

  const accessToken = signAccessToken({
    userId: user._id.toString(),
    consumerId: user.consumer_id._id.toString(),
    phone: user.phone,
    email: user.email,
  });

  return {
    accessToken,
    user,
    consumer: user.consumer_id,
  };
}

module.exports = {
  registerConsumerAccount,
  loginWithPhoneAndPassword,
};
