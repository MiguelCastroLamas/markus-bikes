describe('Mountain Bike configuration', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.clearAllSessionStorage();
        cy.intercept('POST', 'http://localhost:4000/graphql').as('graphqlQuery');

        cy.visit('http://localhost:3000/products/1/configure', { timeout: 30000 });
        cy.wait('@graphqlQuery', { timeout: 15000 });
        cy.url().should('include', '/products/1/configure');
        cy.wait(1000);
    });

    it('should show price modifiers when selecting Full-suspension and Matte finish', () => {
        cy.contains('Frame Type', { timeout: 10000 }).should('exist');
        cy.contains('Full-suspension')
            .should('exist')
            .click({ force: true });

        cy.contains('button', 'Next').click();
        cy.contains('Frame Finish').should('exist');

        cy.contains('div', 'Matte finish').should('exist');
        cy.contains('div', 'Matte finish')
            .parent()
            .within(() => {
                cy.get('.line-through').should('exist');
                cy.contains('+$35.00').should('exist');
                cy.contains('+$20.00').should('exist');
            });

        cy.contains('div', 'Matte finish').click({ force: true });
    });

    it('should validate incompatibility between Fat bike wheels and Red rim color', () => {
        cy.contains('Full-suspension').click({ force: true });
        cy.contains('button', 'Next').click();
        cy.contains('div', 'Matte finish').click({ force: true });
        cy.contains('button', 'Next').click();

        cy.contains('Wheels').should('exist');
        cy.contains('div', 'Fat bike wheels')
            .should('exist')
            .click({ force: true });

        cy.contains('button', 'Next').click();

        cy.contains('Rim Color').should('exist');
        cy.contains('div', 'Red')
            .parent()
            .should('have.css', 'cursor', 'not-allowed');

        cy.contains('Incompatible with your selection').should('exist');
    });

    it('should add configured product to cart', () => {
        cy.contains('Full-suspension').click({ force: true });
        cy.contains('button', 'Next').click();

        cy.contains('div', 'Matte finish').click({ force: true });
        cy.contains('button', 'Next').click();

        cy.contains('div', 'Fat bike wheels').click({ force: true });
        cy.contains('button', 'Next').click();

        cy.contains('div', 'Blue').click({ force: true });
        cy.contains('button', 'Next').click();

        cy.contains('Single-speed chain').click({ force: true });

        cy.contains('button', 'Add to cart').click({ force: true });
        cy.contains('Added to cart successfully', { timeout: 10000 }).should('exist');
    });
});