import path from "node:path";
import dotenv from "dotenv";

const defaultEnvPath = path.resolve(
  process.cwd(),
  "..",
  "..",
  "cachecash-config",
  ".env"
);

dotenv.config({ path: process.env.ENV_FILE_PATH ?? defaultEnvPath });

export const env = {
  apiName: process.env.API_NAME ?? "CacheCash API",
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3000),
  supabaseDbSchema: process.env.SUPABASE_DB_SCHEMA ?? "public",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  supabaseUrl: process.env.SUPABASE_URL ?? "",
};

