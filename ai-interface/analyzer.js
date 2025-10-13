class ContextAnalyzer {
  analyzeRequest(userInput) {
    const context = {
      type: null,
      availableData: {},
      missingData: [],
      suggestedTools: [],
      confidence: 0
    };

    if (this.containsPersonalInfo(userInput)) {
      context.type = 'person';
      context.suggestedTools = ['sherlock', 'holehe', 'maigret'];
    } else if (this.containsDomainInfo(userInput)) {
      context.type = 'organization';
      context.suggestedTools = ['subfinder', 'amass'];
    } else if (this.containsPhoneInfo(userInput)) {
      context.type = 'phone';
      context.suggestedTools = ['phoneinfoga'];
    }

    context.availableData = this.extractData(userInput);
    context.confidence = this.calculateConfidence(context);

    return context;
  }

  containsPersonalInfo(text) {
    const patterns = [
      /username[:\s]+(\S+)/i,
      /email[:\s]+(\S+@\S+)/i,
      /nom[:\s]+(\S+)/i,
      /@\w+/,
      /chercher\s+(\w+)/i,
      /recherche\s+(\w+)/i
    ];
    return patterns.some(p => p.test(text));
  }

  containsDomainInfo(text) {
    const patterns = [
      /domain[:\s]+(\S+)/i,
      /site[:\s]+(\S+)/i,
      /\b[a-z0-9-]+\.[a-z]{2,}\b/i,
    ];
    return patterns.some(p => p.test(text));
  }

  containsPhoneInfo(text) {
    const patterns = [
      /phone[:\s]+(\S+)/i,
      /tel[:\s]+(\S+)/i,
      /\+?[0-9]{10,15}/,
    ];
    return patterns.some(p => p.test(text));
  }

  extractData(text) {
    const data = {};

    const usernameMatch = text.match(/username[:\s]+(\S+)/i) || 
                         text.match(/@(\w+)/) ||
                         text.match(/chercher\s+(\w+)/i) ||
                         text.match(/recherche\s+(\w+)/i);
    if (usernameMatch) data.username = usernameMatch[1];

    const emailMatch = text.match(/email[:\s]+(\S+@\S+)/i) ||
                      text.match(/(\S+@\S+)/);
    if (emailMatch) data.email = emailMatch[1];

    const domainMatch = text.match(/domain[:\s]+(\S+)/i) ||
                       text.match(/\b([a-z0-9-]+\.[a-z]{2,})\b/i);
    if (domainMatch) data.domain = domainMatch[1];

    const phoneMatch = text.match(/phone[:\s]+(\S+)/i) ||
                      text.match(/\+?([0-9]{10,15})/);
    if (phoneMatch) data.phone = phoneMatch[1];

    return data;
  }

  calculateConfidence(context) {
    let score = 0;
    
    if (context.type) score += 0.3;
    if (Object.keys(context.availableData).length > 0) score += 0.4;
    if (context.suggestedTools.length > 0) score += 0.3;

    return Math.min(score, 1);
  }
}

module.exports = ContextAnalyzer;
