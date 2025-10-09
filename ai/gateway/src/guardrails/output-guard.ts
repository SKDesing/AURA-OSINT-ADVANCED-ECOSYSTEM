import { Injectable } from '@nestjs/common';

@Injectable()
export class OutputGuardService {
  filter(result: any) {
    if (process.env.AI_PII_REDACTION === 'true' && result && result.explanation) {
      result.explanation = this.redactPII(result.explanation);
    }

    if (result && result.data && result.data.text) {
      result.data.text = this.redactPII(result.data.text);
    }

    return result;
  }

  private redactPII(text: string): string {
    return text
      // Email redaction
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]')
      // Phone number redaction (FR/EU format)
      .replace(/\b(?:\+33|0)[1-9](?:[.\-\s]?\d{2}){4}\b/g, '[PHONE_REDACTED]')
      // Generic phone pattern
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE_REDACTED]');
  }

  validateJSON(text: string): { valid: boolean; parsed?: any; error?: string } {
    try {
      const parsed = JSON.parse(text);
      return { valid: true, parsed };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
}