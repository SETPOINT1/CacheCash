const path = require("node:path");
const dotenv = require("dotenv");

const defaultEnvPath = path.resolve(
  __dirname,
  "..",
  "..",
  "cachecash-config",
  ".env"
);

dotenv.config({ path: process.env.ENV_FILE_PATH || defaultEnvPath });

module.exports = {
  expo: {
    name: "CacheCash",
    slug: "cachecash",
    version: "1.0.0",
    orientation: "portrait",
    extra: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000/api"
    }
  }
};
