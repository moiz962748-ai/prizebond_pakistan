describe('Prize bond checker', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('button', 'Check Prize Bond').first().click();
    cy.get('#checker-tool-card').should('be.visible');
    cy.contains('button', 'Rs. 750').click();
  });

  it('checks one bond number', () => {
    cy.get('#single-bond-input').clear().type('308852');
    cy.contains('button', 'Check Prize Bond').click();

    cy.contains('Prize Bond #308852').should('be.visible');
    cy.contains('1 Checked').should('be.visible');
  });

  it('checks multiple bond numbers', () => {
    cy.contains('button', 'Multiple / Bulk List').click();
    cy.get('#bulk-bond-textarea').type('308852\n308853');
    cy.contains('button', 'Check All Numbers').click();

    cy.contains('Prize Bond #308852').should('be.visible');
    cy.contains('2 Checked').should('be.visible');
  });

  it('checks a series range', () => {
    cy.contains('button', 'By Series Range').click();
    cy.get('#range-from-input').type('308851');
    cy.get('#range-to-input').type('308853');
    cy.contains('button', 'Check Series Range').click();

    cy.contains('Prize Bond #308852').should('be.visible');
    cy.contains('3 Checked').should('be.visible');
  });
});