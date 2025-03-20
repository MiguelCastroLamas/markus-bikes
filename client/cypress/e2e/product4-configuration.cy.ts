describe('Beginner Surfboard configuration', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.clearAllSessionStorage();
        cy.intercept('POST', 'http://localhost:4000/graphql').as('graphqlQuery');

        cy.visit('http://localhost:3000/products/4/configure', { timeout: 30000 });
        cy.wait('@graphqlQuery', { timeout: 15000 });
        cy.url().should('include', '/products/4/configure');
        cy.wait(1000);
    });

    it('should allow skipping non-required categories', () => {
        cy.contains('Board Size', { timeout: 10000 }).should('exist');
        cy.contains('div', '7ft').click({ force: true });

        cy.contains('button', 'Next').should('be.enabled').click();

        cy.contains('Fin Setup').should('exist');
        cy.contains('div', 'Three Fin').click({ force: true });
        cy.contains('button', 'Next').should('be.enabled').click();

        cy.contains('Leash')
            .should('exist')
            .parent()
            .within(() => {
                cy.contains('Required').should('not.exist');
            });

        cy.contains('button', 'Next').should('be.enabled').click();

        cy.get('.mt-4').should('exist').and('contain', 'Configuration summary');
        cy.get('.mt-4')
            .contains('Leash')
            .closest('.flex.justify-between')
            .within(() => {
                cy.contains('Not selected').should('exist');
                cy.contains('-').should('exist');
            });

        cy.contains('Deck Grip')
            .should('exist')
            .parent()
            .within(() => {
                cy.contains('Required').should('not.exist');
            });

        cy.get('.mt-4').should('exist').and('contain', 'Configuration summary');
        cy.get('.mt-4')
            .contains('Deck Grip')
            .closest('.flex.justify-between')
            .within(() => {
                cy.contains('Not selected').should('exist');
                cy.contains('-').should('exist');
            });

        cy.contains('button', 'Add to cart').should('be.enabled');
    });

    it('should add product to cart with minimal configuration', () => {
        cy.contains('Board Size', { timeout: 10000 }).should('exist');
        cy.contains('div', '7ft').click({ force: true });
        cy.contains('button', 'Next').click();

        cy.contains('Fin Setup').should('exist');
        cy.contains('div', 'Three Fin').click({ force: true });

        cy.contains('button', 'Next').click();
        cy.contains('button', 'Next').click();

        cy.contains('button', 'Add to cart').click({ force: true });

        cy.contains('Added to cart successfully', { timeout: 10000 }).should('exist');
    });
}); 