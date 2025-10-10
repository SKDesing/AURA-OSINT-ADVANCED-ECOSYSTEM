import { Worker } from "bullmq";
import IORedis from "ioredis";
import { osintRegistry } from "../../../../packages/core/src/osint/registry";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const connection = new IORedis(process.env.ORCHESTRATOR_REDIS_URL || "redis://localhost:6379/5");

function makeWorkdir(toolId: string, jobId: string) {
  const dir = resolve(process.cwd(), "var", "osint", "work", `${toolId}-${jobId}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

export const osintWorker = new Worker(
  "osint",
  async (job) => {
    const { toolId, params } = job.data as { toolId: string; params: any };
    const tool = osintRegistry.get(toolId);
    const workdir = makeWorkdir(toolId, String(job.id));

    const ctx = {
      jobId: String(job.id),
      workdir,
      timeoutMs: (params?.timeout || 600) * 1000,
      env: process.env,
      logger: {
        info: (m: any) => console.log(JSON.stringify({ lvl: "info", job: job.id, tool: toolId, ...m })),
        warn: (m: any) => console.warn(JSON.stringify({ lvl: "warn", job: job.id, tool: toolId, ...m })),
        error: (m: any) => console.error(JSON.stringify({ lvl: "error", job: job.id, tool: toolId, ...m })),
      },
      sandbox: process.env.OSINT_SANDBOX === "native" ? "native" : "docker",
    } as const;

    const val = tool.validate(params || {});
    if (!("ok" in val) || !val.ok) {
      throw new Error(`Invalid params: ${"errors" in val ? val.errors.join(", ") : "unknown"}`);
    }

    const raw = await tool.execute(ctx, params || {});
    const res = tool.parse ? await tool.parse(ctx, raw) : raw;

    // TODO (Phase 1): persister via OsintRepo si on veut synchroniser worker→DB ici.
    return { entities: res.entities, stats: res.stats };
  },
  { connection, concurrency: Number(process.env.OSINT_CONCURRENCY || 2) }
);