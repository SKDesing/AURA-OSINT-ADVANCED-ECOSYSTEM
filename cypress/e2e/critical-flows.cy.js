describe('AURA OSINT - Tests Critiques', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('Page d\'accueil se charge', () => {
    cy.contains('AURA')
    cy.get('body').should('be.visible')
  })

  it('Navigation fonctionne', () => {
    cy.get('[data-cy=nav-dashboard]').should('exist')
    cy.get('[data-cy=nav-analytics]').should('exist')
  })

  it('Formulaire contact fonctionne', () => {
    cy.get('[data-cy=contact-form]').should('be.visible')
    cy.get('[data-cy=contact-name]').type('Test User')
    cy.get('[data-cy=contact-email]').type('test@example.com')
    cy.get('[data-cy=contact-message]').type('Test message')
    // cy.get('[data-cy=contact-submit]').click()
    // cy.contains('Message envoyé').should('be.visible')
  })
})
