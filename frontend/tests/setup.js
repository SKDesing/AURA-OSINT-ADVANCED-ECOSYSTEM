// Mock localStorage avec retour de valeurs
global.localStorage = {
    store: {},
    getItem: jest.fn((key) => global.localStorage.store[key] || null),
    setItem: jest.fn((key, value) => { global.localStorage.store[key] = value; }),
    removeItem: jest.fn((key) => { delete global.localStorage.store[key]; }),
    clear: jest.fn(() => { global.localStorage.store = {}; })
};

// Mock WebSocket
global.WebSocket = jest.fn(() => ({
    addEventListener: jest.fn(),
    send: jest.fn(),
    close: jest.fn(),
    readyState: 1
}));

// Mock fetch
global.fetch = jest.fn();

// Mock DOM complet avec appendChild fonctionnel
global.document = {
    body: { 
        innerHTML: '',
        appendChild: jest.fn(),
        style: {}
    },
    createElement: jest.fn((tag) => ({
        tagName: tag.toUpperCase(),
        className: '',
        innerHTML: '',
        textContent: '',
        value: '',
        placeholder: '',
        appendChild: jest.fn(),
        addEventListener: jest.fn(),
        classList: {
            add: jest.fn(),
            remove: jest.fn(),
            contains: jest.fn(() => false),
            toggle: jest.fn()
        },
        style: {},
        dataset: {}
    })),
    getElementById: jest.fn((id) => ({
        id: id,
        textContent: '',
        value: '',
        placeholder: 'Tapez votre question...',
        appendChild: jest.fn(),
        classList: {
            add: jest.fn(),
            remove: jest.fn(),
            contains: jest.fn(() => false)
        },
        style: {}
    })),
    querySelector: jest.fn(() => ({
        textContent: '',
        style: { backgroundColor: '' },
        classList: {
            add: jest.fn(),
            remove: jest.fn(),
            contains: jest.fn(() => false)
        }
    })),
    querySelectorAll: jest.fn(() => [])
};

// Mock console pour éviter les logs pendant les tests
global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
};
