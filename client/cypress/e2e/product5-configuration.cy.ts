describe('Pro Alpine Skis configuration', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.clearAllSessionStorage();
        cy.intercept('POST', 'http://localhost:4000/graphql').as('graphqlQuery');

        cy.visit('http://localhost:3000/products/5/configure', { timeout: 30000 });
        cy.wait('@graphqlQuery', { timeout: 15000 });
        cy.url().should('include', '/products/5/configure');
        cy.wait(1000);
    });

    it('should show out of stock options in each category', () => {
        cy.contains('Ski Length', { timeout: 10000 }).should('exist');

        cy.contains('div', '190cm')
            .should('exist')
            .parent()
            .should('have.css', 'cursor', 'not-allowed')
            .should('contain', 'Out of stock');

        cy.contains('div', '170cm').click({ force: true });
        cy.contains('button', 'Next').click();

        cy.contains('Bindings').should('exist');
        cy.contains('div', 'Race Bindings')
            .should('exist')
            .parent()
            .should('have.css', 'cursor', 'not-allowed')
            .should('contain', 'Out of stock');

        cy.contains('div', 'Pro Bindings').click({ force: true });
        cy.contains('button', 'Next').click();

        cy.contains('Design').should('exist');
        cy.contains('div', 'Limited Edition')
            .should('exist')
            .parent()
            .should('have.css', 'cursor', 'not-allowed')
            .should('contain', 'Out of stock');
    });

    it('should add configured product to cart', () => {
        cy.contains('div', '170cm').click({ force: true });
        cy.contains('button', 'Next').click();

        cy.contains('div', 'Pro Bindings').click({ force: true });
        cy.contains('button', 'Next').click();

        cy.contains('div', 'Racing Stripes').click({ force: true });

        cy.contains('button', 'Add to cart').click({ force: true });

        cy.contains('Added to cart successfully', { timeout: 10000 }).should('exist');
    });
}); 