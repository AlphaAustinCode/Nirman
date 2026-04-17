require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = Number(process.env.PORT || 5000);

async function bootstrap() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(
      `AgniMitra backend running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
    );
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start backend:", error.message);
  process.exit(1);
});
