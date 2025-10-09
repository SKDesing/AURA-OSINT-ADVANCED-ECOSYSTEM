import { Injectable } from '@nestjs/common';

const BLOCK_PATTERNS = (process.env.AI_BLOCKED_PATTERNS || 'system override;ignore previous;exfiltrate;delete all data')
  .split(';')
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);

const MAX_CHARS = parseInt(process.env.AI_MAX_INPUT_CHARS || '6000');

@Injectable()
export class InputGuardService {
  validate(text: string): { blocked: boolean; reason?: string } {
    if (!text || text.trim().length === 0) {
      return { blocked: true, reason: 'Empty input' };
    }

    if (text.length > MAX_CHARS) {
      return { blocked: true, reason: `Input too long (${text.length} > ${MAX_CHARS})` };
    }

    // Check blocked patterns
    const lowerText = text.toLowerCase();
    for (const pattern of BLOCK_PATTERNS) {
      if (lowerText.includes(pattern)) {
        return { blocked: true, reason: `Blocked pattern detected: ${pattern}` };
      }
    }

    // Remove control characters
    const cleanText = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    if (cleanText.length !== text.length) {
      return { blocked: true, reason: 'Control characters detected' };
    }

    return { blocked: false };
  }

  sanitize(text: string): string {
    return text
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .trim()
      .substring(0, MAX_CHARS);
  }
}