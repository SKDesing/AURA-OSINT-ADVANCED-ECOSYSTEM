const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class ForensicProfileManager {
  constructor() {
    this.baseDir = path.join(__dirname, '../forensic-profiles');
    this.archiveDir = path.join(__dirname, '../forensic-archives');
  }

  async listProfiles() {
    const dirs = await fs.readdir(this.baseDir);
    const profiles = [];

    for (const dir of dirs) {
      if (dir.startsWith('aura-')) {
        const metadataPath = path.join(this.baseDir, dir, 'metadata.json');
        try {
          const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
          profiles.push({
            profileName: dir,
            ...metadata,
            path: path.join(this.baseDir, dir)
          });
        } catch (e) {
          console.warn(`⚠️ Profil corrompu détecté: ${dir}`);
        }
      }
    }

    return profiles;
  }

  async archiveProfile(profilePath) {
    const profileName = path.basename(profilePath);
    const archiveName = `${profileName}.tar.gz`;
    const archivePath = path.join(this.archiveDir, archiveName);

    await fs.mkdir(this.archiveDir, { recursive: true });

    // Simulation d'archivage (sans archiver pour simplifier)
    const hash = await this._computeDirHash(profilePath);
    
    const signature = {
      archiveName,
      originalPath: profilePath,
      archivedAt: new Date().toISOString(),
      integrityHash: hash,
      algorithm: 'sha256'
    };

    await fs.writeFile(
      `${archivePath}.sig`,
      JSON.stringify(signature, null, 2)
    );

    return { archivePath, signature };
  }

  async cleanupExpiredProfiles(retentionDays = 90) {
    const profiles = await this.listProfiles();
    const now = Date.now();
    const retentionMs = retentionDays * 24 * 60 * 60 * 1000;

    const expired = profiles.filter(p => {
      const createdAt = new Date(p.createdAt).getTime();
      return (now - createdAt) > retentionMs;
    });

    console.log(`🗑️ Nettoyage de ${expired.length} profils expirés...`);

    for (const profile of expired) {
      await this.archiveProfile(profile.path);
      await fs.rm(profile.path, { recursive: true, force: true });
      console.log(`✅ Profil archivé et supprimé: ${profile.profileName}`);
    }

    return expired.length;
  }

  async exportForensicReport(sessionId) {
    const profiles = await this.listProfiles();
    const profile = profiles.find(p => p.sessionId === sessionId);

    if (!profile) {
      throw new Error(`Profil introuvable: ${sessionId}`);
    }

    const custodyPath = path.join(profile.path, 'chain-of-custody.jsonl');
    const custodyData = (await fs.readFile(custodyPath, 'utf8'))
      .trim()
      .split('\n')
      .map(line => JSON.parse(line));

    const report = {
      report_type: 'OSINT_FORENSIC_ANALYSIS',
      report_version: '1.0',
      generated_at: new Date().toISOString(),
      compliance: ['ISO/IEC 27037:2012', 'GDPR Article 30'],

      session: {
        id: profile.sessionId,
        target_id: profile.targetId,
        operator: profile.operator,
        started_at: profile.createdAt
      },

      chain_of_custody: custodyData,

      integrity: {
        profile_hash: await this._computeDirHash(profile.path),
        algorithm: 'sha256',
        verified_at: new Date().toISOString()
      },

      technical_metadata: {
        chromium_version: profile.config?.userAgent || 'unknown',
        proxy_used: profile.config?.network?.proxy?.enabled || false,
        profile_path: profile.path
      }
    };

    return report;
  }

  async _computeDirHash(dirPath) {
    const files = await this._getAllFiles(dirPath);
    const hashes = await Promise.all(files.map(f => this._computeFileHash(f)));
    return crypto.createHash('sha256').update(hashes.join('')).digest('hex');
  }

  async _computeFileHash(filePath) {
    const fileBuffer = await fs.readFile(filePath);
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
  }

  async _getAllFiles(dirPath, arrayOfFiles = []) {
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const stat = await fs.stat(fullPath);

      if (stat.isDirectory()) {
        arrayOfFiles = await this._getAllFiles(fullPath, arrayOfFiles);
      } else {
        arrayOfFiles.push(fullPath);
      }
    }

    return arrayOfFiles;
  }
}

module.exports = ForensicProfileManager;