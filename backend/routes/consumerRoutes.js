const express = require("express");

const registrationAuth = require("../middleware/registrationAuth");
const { getConsumerDetails } = require("../controllers/consumerController");

const router = express.Router();

router.get("/consumer-details", registrationAuth, getConsumerDetails);

module.exports = router;
