import React, { useEffect, useState } from "react";

type Result = { entity_type: string; data: any; created_at: string };

export function ResultsExplorer() {
  const [results, setResults] = useState<Result[]>([]);
  const [type, setType] = useState<string>("");

  useEffect(() => {
    const url = new URL("/api/osint/results", window.location.href);
    if (type) url.searchParams.set("entity_type", type);
    fetch(url.toString()).then((r) => r.json()).then(setResults);
  }, [type]);

  return (
    <div>
      <h2>Results Explorer</h2>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">All</option>
        <option value="subdomain">Subdomains</option>
        <option value="email">Emails</option>
        <option value="account">Accounts</option>
        <option value="file_meta">Files Meta</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Data</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i}>
              <td>{r.entity_type}</td>
              <td>
                <pre>{JSON.stringify(r.data, null, 2)}</pre>
              </td>
              <td>{new Date(r.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}