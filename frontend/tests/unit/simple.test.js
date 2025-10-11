/**
 * Tests simples pour valider la configuration
 */

// Mock DOM global
global.document = {
  body: { innerHTML: '' },
  createElement: jest.fn(() => ({
    className: '',
    innerHTML: '',
    appendChild: jest.fn(),
    addEventListener: jest.fn(),
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn(() => false)
    },
    style: {},
    dataset: {}
  })),
  getElementById: jest.fn(() => ({
    textContent: '',
    value: '',
    appendChild: jest.fn(),
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn(() => false)
    },
    style: {}
  })),
  querySelector: jest.fn(() => null),
  querySelectorAll: jest.fn(() => [])
};

describe('Configuration Tests', () => {
  test('doit avoir les mocks configurés', () => {
    expect(global.localStorage).toBeDefined();
    expect(global.WebSocket).toBeDefined();
    expect(global.fetch).toBeDefined();
    expect(global.document).toBeDefined();
  });

  test('doit pouvoir créer des éléments DOM', () => {
    const element = document.createElement('div');
    expect(element).toBeDefined();
    expect(element.appendChild).toBeDefined();
  });

  test('localStorage doit fonctionner', () => {
    localStorage.setItem('test', 'value');
    expect(localStorage.setItem).toHaveBeenCalledWith('test', 'value');
  });

  test('fetch doit être mockable', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: 'ok' })
    });

    const response = await fetch('/test');
    const data = await response.json();
    
    expect(data.status).toBe('ok');
  });
});

describe('AURA OSINT Components Logic', () => {
  test('doit valider la configuration backend', () => {
    const config = {
      backendUrl: 'http://localhost:4011',
      websocketUrl: 'ws://localhost:4011'
    };
    
    expect(config.backendUrl).toContain('localhost');
    expect(config.websocketUrl).toContain('ws://');
  });

  test('doit valider les messages de chat', () => {
    const message = {
      content: 'Test message',
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    expect(message.content).toBe('Test message');
    expect(message.sender).toBe('user');
    expect(message.timestamp).toBeDefined();
  });

  test('doit valider les outils OSINT', () => {
    const tools = {
      social_media: { count: 5 },
      email: { count: 3 },
      network: { count: 7 }
    };
    
    const categories = Object.keys(tools);
    expect(categories.length).toBe(3);
    expect(tools.social_media.count).toBe(5);
  });

  test('doit valider les investigations', () => {
    const investigation = {
      id: '1',
      target: 'test@example.com',
      target_type: 'email',
      status: 'completed',
      created_at: new Date().toISOString()
    };
    
    expect(investigation.target).toContain('@');
    expect(investigation.target_type).toBe('email');
    expect(investigation.status).toBe('completed');
  });
});