# AURA Telemetry Threat Model (P0 → P1)

## Scope
- Electron main process (CDP attach via webContents.debugger)
- Backend /telemetry/batch
- Storage: telemetry_events (DB)

## Assets
- Network/meta telemetry (no content)
- Config flags: AURA_TELEMETRY, AURA_BROWSER_ONLY
- Local-only enforcement

## Trust boundaries
- Renderer webcontents (untrusted pages)
- Main process (trusted)
- Local backend (trusted, loopback only)

## Threats & mitigations
- Exfiltration of content → No DOM/body capture; URL redaction + hashing
- Header leakage → Strip sensitive headers; collect none
- Remote post to /telemetry → Localhost-only + X-AURA-TELEMETRY in Browser Only
- Replay / flooding → Rate limit, idempotence future P1, batching client
- Privilege escalation via CDP → Read-only subscriptions; no Runtime.evaluate; kill-switch
- Mode privé → AURA_TELEMETRY=0 disables attach; document UI indicator

## Next steps (P1)
- DB insert + TTL purge
- Metrics: ingestion latency/error rate
- Remote config signing & domain allowlist