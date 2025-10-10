import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.ORCHESTRATOR_REDIS_URL || "redis://localhost:6379/5");

export const osintQueue = new Queue("osint", { connection });

export async function enqueueOsintJob(toolId: string, params: any) {
  return await osintQueue.add("osint-job", { toolId, params }, {
    removeOnComplete: 10,
    removeOnFail: 5,
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 }
  });
}