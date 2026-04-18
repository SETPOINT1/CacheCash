import { Request, Response } from "express";
import { env } from "../config/env";
import { getHealthSummary } from "../services/healthService";

export function getHealth(_request: Request, response: Response) {
  response.json({
    data: {
      ...getHealthSummary(),
      apiName: env.apiName,
      databaseConfigured: Boolean(env.supabaseUrl && env.supabaseServiceRoleKey),
      environment: env.nodeEnv,
    },
  });
}
