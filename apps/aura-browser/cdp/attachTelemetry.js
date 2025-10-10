const crypto = require('crypto');
const os = require('os');
const http = require('http');

function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function redactAndHashUrl(raw) {
  try {
    const u = new URL(raw);
    const host = u.host;
    const pathPrefix = u.pathname.split('/').filter(Boolean)[0] || '';
    const canonical = `${u.protocol}//${u.host}${u.pathname}`;
    return { host, pathPrefix, hash: sha256(canonical) };
  } catch {
    return { host: '', pathPrefix: '', hash: '' };
  }
}

function isTelemetryEnabled() {
  if (process.env.AURA_TELEMETRY === '0') return false;
  return true;
}

function attachTelemetry(webContents, opts = {}) {
  if (!isTelemetryEnabled()) return () => {};
  const { apiBase = process.env.AURA_API_BASE || 'http://127.0.0.1:4011', appName = 'AURA OSINT ADVANCED ECOSYSTEM' } = opts;

  const dbg = webContents.debugger;
  const buffer = [];
  const maxBatchSize = 200;
  const flushIntervalMs = 2000;
  const maxBuffer = 2000;

  let attached = false;
  function pushEvent(evt) {
    if (!attached) return;
    if (buffer.length < maxBuffer) buffer.push(evt);
  }

  function flush() {
    if (!attached || buffer.length === 0) return;
    const batch = buffer.splice(0, Math.min(buffer.length, maxBatchSize));
    const payload = JSON.stringify({
      node: os.hostname(),
      pid: process.pid,
      app: appName,
      ts: Date.now(),
      events: batch,
    });

    const url = new URL('/telemetry/batch', apiBase);
    const req = http.request({
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'X-AURA-TELEMETRY': '1',
      },
    }, (res) => res.resume());

    req.on('error', () => {});
    req.write(payload);
    req.end();
  }

  const flushTimer = setInterval(flush, flushIntervalMs);

  function onMessage(_event, method, params) {
    try {
      switch (method) {
        case 'Network.requestWillBeSent': {
          const { request, wallTime, timestamp, type } = params || {};
          const u = redactAndHashUrl(request?.url || '');
          pushEvent({
            t: 'net_req',
            ts: Date.now(),
            cdpts: timestamp,
            wall: wallTime,
            type,
            method: request?.method,
            host: u.host,
            pathPrefix: u.pathPrefix,
            urlHash: u.hash,
          });
          break;
        }
        case 'Network.responseReceived': {
          const { response, timestamp, type } = params || {};
          const u = redactAndHashUrl(response?.url || '');
          pushEvent({
            t: 'net_rsp',
            ts: Date.now(),
            cdpts: timestamp,
            type,
            status: response?.status,
            mime: response?.mimeType,
            host: u.host,
            pathPrefix: u.pathPrefix,
            urlHash: u.hash,
          });
          break;
        }
        case 'Network.loadingFinished': {
          const { encodedDataLength, timestamp } = params || {};
          pushEvent({
            t: 'net_done',
            ts: Date.now(),
            cdpts: timestamp,
            bytes: encodedDataLength,
          });
          break;
        }
        case 'Network.loadingFailed': {
          const { errorText, canceled, timestamp } = params || {};
          pushEvent({
            t: 'net_fail',
            ts: Date.now(),
            cdpts: timestamp,
            err: errorText,
            canceled: !!canceled,
          });
          break;
        }
        case 'Page.loadEventFired': {
          pushEvent({ t: 'nav_load', ts: Date.now() });
          break;
        }
        case 'Performance.metrics': {
          const useful = {};
          for (const m of params?.metrics || []) {
            if (['Tasks', 'JSHeapUsedSize', 'JSHeapTotalSize', 'FirstMeaningfulPaint', 'DomContentLoaded'].includes(m.name)) {
              useful[m.name] = m.value;
            }
          }
          pushEvent({ t: 'perf', ts: Date.now(), m: useful });
          break;
        }
        case 'Runtime.exceptionThrown': {
          const { exceptionDetails } = params || {};
          pushEvent({
            t: 'js_err',
            ts: Date.now(),
            text: exceptionDetails?.text || '',
            line: exceptionDetails?.lineNumber,
            col: exceptionDetails?.columnNumber,
          });
          break;
        }
      }
    } catch {}
  }

  function detach() {
    try {
      clearInterval(flushTimer);
      webContents.debugger.removeListener('message', onMessage);
      if (attached) dbg.detach();
    } catch {}
    attached = false;
  }

  try {
    if (!dbg.isAttached()) {
      dbg.attach('1.3');
    }
    attached = true;
    dbg.on('message', onMessage);
    dbg.sendCommand('Network.enable');
    dbg.sendCommand('Page.enable');
    dbg.sendCommand('Performance.enable');
    dbg.sendCommand('Runtime.enable');

    webContents.on('destroyed', detach);
  } catch (e) {
    detach();
  }

  return detach;
}

module.exports = { attachTelemetry };