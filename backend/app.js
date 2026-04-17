const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { apiLimiter } = require("./middleware/rateLimiters");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const consumerRoutes = require("./routes/consumerRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*",
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

app.use("/api", apiLimiter);

app.use("/api", healthRoutes);
app.use("/api", authRoutes);
app.use("/api", consumerRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
