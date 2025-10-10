const { app } = require('electron');
const fs = require('fs');
const path = require('path');

/**
 * Structured logging for AURA Browser
 */
class Logger {
  constructor() {
    this.logDir = path.join(app.getPath('userData'), 'logs');
    this.logFile = path.join(this.logDir, 'aura-browser.log');
    this.maxLogSize = 10 * 1024 * 1024; // 10MB
    this.maxLogFiles = 5;
    
    this.ensureLogDir();
  }

  ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      meta,
      pid: process.pid,
      version: app.getVersion()
    };

    const logLine = JSON.stringify(logEntry) + '\n';
    
    // Console output
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, meta);
    
    // File output
    try {
      this.rotateIfNeeded();
      fs.appendFileSync(this.logFile, logLine);
    } catch (error) {
      console.error('Failed to write log:', error);
    }
  }

  info(message, meta) { this.log('info', message, meta); }
  warn(message, meta) { this.log('warn', message, meta); }
  error(message, meta) { this.log('error', message, meta); }
  debug(message, meta) { this.log('debug', message, meta); }

  rotateIfNeeded() {
    if (!fs.existsSync(this.logFile)) return;
    
    const stats = fs.statSync(this.logFile);
    if (stats.size > this.maxLogSize) {
      // Rotate logs
      for (let i = this.maxLogFiles - 1; i > 0; i--) {
        const oldFile = `${this.logFile}.${i}`;
        const newFile = `${this.logFile}.${i + 1}`;
        if (fs.existsSync(oldFile)) {
          fs.renameSync(oldFile, newFile);
        }
      }
      fs.renameSync(this.logFile, `${this.logFile}.1`);
    }
  }

  async getLogs(options = {}) {
    const { lines = 100, level = null } = options;
    
    try {
      const content = fs.readFileSync(this.logFile, 'utf8');
      const logLines = content.trim().split('\n')
        .filter(line => line.length > 0)
        .map(line => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(entry => entry !== null)
        .filter(entry => !level || entry.level === level)
        .slice(-lines);
      
      return logLines;
    } catch (error) {
      return [];
    }
  }
}

const logger = new Logger();
module.exports = { logger, Logger };