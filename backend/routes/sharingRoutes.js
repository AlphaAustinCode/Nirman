const express = require("express");

const accessAuth = require("../middleware/accessAuth");
const {
  getProfile,
  createListing,
  getMyListings,
  getAvailableListings,
  deleteListing,
  createRequest,
  getRequests,
  respondRequest,
  completeRequest,
  getNotifications,
  readNotification,
  getHistory,
} = require("../controllers/sharingController");

const router = express.Router();

router.use(accessAuth);

router.get("/user/profile", getProfile);
router.get("/listings", getAvailableListings);
router.post("/listings", createListing);
router.get("/listings/mine", getMyListings);
router.delete("/listings/:id", deleteListing);

router.post("/requests", createRequest);
router.get("/requests", getRequests);
router.post("/requests/:id/respond", respondRequest);
router.post("/requests/:id/complete", completeRequest);

router.get("/notifications", getNotifications);
router.post("/notifications/:id/read", readNotification);

router.get("/history", getHistory);

module.exports = router;
