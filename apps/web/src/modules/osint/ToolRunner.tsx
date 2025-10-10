import React, { useEffect, useMemo, useState } from "react";

type Param = { key: string; label: string; type: string; required?: boolean; default?: any; enumValues?: string[]; help?: string };
type ToolMeta = { id: string; name: string; description: string; params: Param[] };

function Field({ p, onChange }: { p: Param; onChange: (k: string, v: any) => void }) {
  if (p.type === "boolean") {
    return (
      <label>
        <input type="checkbox" defaultChecked={!!p.default} onChange={(e) => onChange(p.key, e.target.checked)} /> {p.label}
      </label>
    );
  }
  if (p.type === "enum" && p.enumValues?.length) {
    return (
      <label>
        {p.label}
        <select defaultValue={p.default ?? ""} onChange={(e) => onChange(p.key, e.target.value)}>
          {p.enumValues.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </label>
    );
  }
  return (
    <label>
      {p.label}
      <input placeholder={p.help || p.label} defaultValue={p.default ?? ""} onChange={(e) => onChange(p.key, e.target.value)} />
    </label>
  );
}

export function ToolRunner() {
  const [tools, setTools] = useState<ToolMeta[]>([]);
  const [toolId, setToolId] = useState("");
  const [params, setParams] = useState<Record<string, any>>({});
  const [jobId, setJobId] = useState<string>("");

  useEffect(() => {
    fetch("/api/osint/tools").then((r) => r.json()).then(setTools);
  }, []);

  const current = useMemo(() => tools.find((t) => t.id === toolId), [tools, toolId]);
  const updateParam = (k: string, v: any) => setParams((prev) => ({ ...prev, [k]: v }));

  async function run() {
    const res = await fetch("/api/osint/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolId, params }),
    });
    const j = await res.json();
    setJobId(j.jobId);
  }

  return (
    <div>
      <h2>OSINT Tool Runner</h2>
      <label>Tool:</label>
      <select value={toolId} onChange={(e) => setToolId(e.target.value)}>
        <option value="">— select —</option>
        {tools.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {current && (
        <div>
          <h3>Parameters</h3>
          {current.params.map((p) => (
            <div key={p.key} style={{ marginBottom: 8 }}>
              <Field p={p} onChange={updateParam} />
            </div>
          ))}
          <button onClick={run} disabled={!toolId}>
            Run
          </button>
        </div>
      )}

      {jobId && <div>Job scheduled: {jobId}</div>}
    </div>
  );
}