import { Router } from "express";
import { enqueueOsintJob } from "../services/osintQueue";
import { osintRegistry } from "../../../../packages/core/src/osint/registry";
import { OsintRepo } from "../repos/osintRepo";
import { Pool } from "pg";

export const osintRouter = Router();

const pool = new Pool({ connectionString: process.env.API_DATABASE_URL });
const repo = new OsintRepo(pool);

osintRouter.get("/tools", (_req, res) => {
  res.json(osintRegistry.list().map((t) => t.meta()));
});

osintRouter.post("/jobs", async (req, res, next) => {
  try {
    const { toolId, params } = req.body ?? {};
    if (!toolId) return res.status(400).json({ error: "toolId is required" });
    const job = await enqueueOsintJob(toolId, params || {});
    res.status(202).json({ jobId: job.id });
  } catch (e) {
    next(e);
  }
});

osintRouter.get("/results", async (req, res, next) => {
  try {
    const entityType = typeof req.query.entity_type === "string" ? req.query.entity_type : undefined;
    const out = await repo.listResults(entityType);
    res.json(out);
  } catch (e) {
    next(e);
  }
});