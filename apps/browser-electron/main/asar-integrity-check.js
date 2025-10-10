#!/usr/bin/env node
/**
 * ASAR Integrity Check - Sans Pitié
 * Mitigates CVE-2024-XXXX (ASAR integrity bypass)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function sha256File(filePath) {
  const hash = crypto.createHash('sha256');
  const stream = fs.createReadStream(filePath);
  return new Promise((resolve, reject) => {
    stream.on('data', (d) => hash.update(d));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

async function verifyAsarIntegrity() {
  try {
    const asarPath = path.join(process.resourcesPath, 'app.asar');
    if (!fs.existsSync(asarPath)) {
      console.warn('[asar] app.asar not found, skip integrity check (dev mode?)');
      return true;
    }
    
    const actual = await sha256File(asarPath);
    const expected = process.env.AURA_APP_ASAR_SHA256 || '';
    
    if (expected) {
      if (actual.toLowerCase() !== expected.toLowerCase()) {
        console.error(`[asar] INTEGRITY BREACH! expected=${expected} actual=${actual}`);
        return false;
      }
      console.log('[asar] integrity OK');
    } else {
      console.log(`[asar] sha256=${actual} (no expected hash provided)`);
    }
    return true;
  } catch (e) {
    console.error('[asar] integrity check error', e);
    return false;
  }
}

module.exports = { verifyAsarIntegrity };