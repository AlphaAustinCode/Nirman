const ApiError = require("./ApiError");

function parseCoordinate(value, label) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new ApiError(400, `${label} must be a valid number`);
  }

  return parsed;
}

function assertCoordinates(longitude, latitude) {
  if (longitude < -180 || longitude > 180) {
    throw new ApiError(400, "longitude must be between -180 and 180");
  }

  if (latitude < -90 || latitude > 90) {
    throw new ApiError(400, "latitude must be between -90 and 90");
  }
}

function toGeoPoint(longitude, latitude) {
  const lng = parseCoordinate(longitude, "longitude");
  const lat = parseCoordinate(latitude, "latitude");
  assertCoordinates(lng, lat);

  return {
    type: "Point",
    coordinates: [lng, lat],
  };
}

module.exports = {
  parseCoordinate,
  assertCoordinates,
  toGeoPoint,
};
