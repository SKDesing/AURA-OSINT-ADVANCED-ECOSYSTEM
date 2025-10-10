import { Pool } from "pg";

export class OsintRepo {
  constructor(private pool: Pool) {}

  async listResults(entityType?: string, limit = 200) {
    const q = entityType
      ? "SELECT entity_type, data, created_at FROM osint_results WHERE entity_type=$1 ORDER BY id DESC LIMIT $2"
      : "SELECT entity_type, data, created_at FROM osint_results ORDER BY id DESC LIMIT $1";
    const params = entityType ? [entityType, limit] : [limit];
    const { rows } = await this.pool.query(q, params);
    return rows;
  }

  async addResults(jobId: number, entities: any[]) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      for (const e of entities) {
        await client.query(
          "INSERT INTO osint_results(job_id, entity_type, data) VALUES ($1,$2,$3)",
          [jobId, e.type, e]
        );
        if (e.type === "subdomain") {
          const subdomain = e.value;
          const parts = subdomain.split(".");
          const domain = parts.length >= 2 ? parts.slice(-2).join(".") : subdomain;
          await client.query(
            "INSERT INTO osint_subdomains(job_id, domain, subdomain, ip, source) VALUES ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING",
            [jobId, domain, subdomain, e.ip || null, e.source || null]
          );
        }
        // NOTE: étendre si besoin (emails/accounts/files_meta…)
      }
      await client.query("COMMIT");
    } finally {
      client.release();
    }
  }
}