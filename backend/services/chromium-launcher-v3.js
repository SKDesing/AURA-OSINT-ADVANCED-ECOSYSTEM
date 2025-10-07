const puppeteer = require('puppeteer');
const config = require('../config/chromium-config');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

class AuraChromiumLauncher {
  constructor(targetId, options = {}) {
    this.targetId = targetId;
    this.sessionId = uuidv4();
    this.config = { ...config, ...options };
    this.browser = null;
    this.profilePath = null;
  }

  async launch() {
    this.profilePath = await this._createForensicProfile();

    const launchArgs = [
      ...this.config.flags,
      `--user-data-dir=${this.profilePath}`,
      this.config.network.proxy.enabled 
        ? `--proxy-server=${this.config.network.proxy.server}` 
        : null
    ].filter(Boolean);

    this.browser = await puppeteer.launch({
      headless: this.config.headless,
      args: launchArgs,
      ignoreHTTPSErrors: this.config.security.ignoreHTTPSErrors,
      defaultViewport: { width: 1920, height: 1080 },
      userAgent: this.config.userAgent
    });

    await this._recordChainOfCustody('LAUNCH');
    console.log(`✅ Chromium lancé | Session: ${this.sessionId} | Profil: ${this.profilePath}`);
    return this.browser;
  }

  async _createForensicProfile() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const profileName = `aura-${timestamp}-${this.sessionId}`;
    const profilePath = path.join(this.config.forensics.profilesDirectory, profileName);

    await fs.mkdir(profilePath, { recursive: true });

    const metadata = {
      sessionId: this.sessionId,
      targetId: this.targetId,
      createdAt: new Date().toISOString(),
      operator: this.config.forensics.chainOfCustody.operator,
      config: this.config
    };

    await fs.writeFile(
      path.join(profilePath, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    return profilePath;
  }

  async _recordChainOfCustody(event) {
    const custodyFile = path.join(this.profilePath, 'chain-of-custody.jsonl');
    
    const entry = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      event,
      operator: this.config.forensics.chainOfCustody.operator,
      integrity: this._computeHash(JSON.stringify({ sessionId: this.sessionId, event }))
    };

    await fs.appendFile(custodyFile, JSON.stringify(entry) + '\n');
  }

  _computeHash(data) {
    return crypto
      .createHash(this.config.forensics.integrityHashing.algorithm)
      .update(data)
      .digest('hex');
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }

    await this._recordChainOfCustody('CLEANUP');
    await fs.rm(this.profilePath, { recursive: true, force: true });
    console.log(`🗑️ Profil détruit | Session: ${this.sessionId}`);
  }
}

module.exports = AuraChromiumLauncher;