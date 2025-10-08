describe('AURA ADVANCED OSINT ECOSYSTEM - E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('loads homepage correctly', () => {
    cy.contains('AURA ADVANCED OSINT ECOSYSTEM');
    cy.contains('Professional OSINT Platform');
  });

  it('navigates between sections', () => {
    cy.contains('Services').click();
    cy.contains('Nos Services');
    
    cy.contains('Contact').click();
    cy.contains('Contactez-nous');
  });

  it('submits contact form', () => {
    cy.contains('Contact').click();
    
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('textarea[name="message"]').type('Test message');
    
    cy.get('button[type="submit"]').click();
  });

  it('is responsive on mobile', () => {
    cy.viewport('iphone-6');
    cy.contains('AURA ADVANCED OSINT ECOSYSTEM');
  });
});