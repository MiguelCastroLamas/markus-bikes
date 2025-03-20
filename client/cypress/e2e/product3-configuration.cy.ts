describe('Kids Bike configuration', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.clearAllSessionStorage();
        cy.intercept('POST', 'http://localhost:4000/graphql').as('graphqlQuery');

        cy.visit('http://localhost:3000/products/3/configure', { timeout: 30000 });
        cy.wait('@graphqlQuery', { timeout: 15000 });
        cy.url().should('include', '/products/3/configure');
        cy.wait(1000);
    });

    it('should show no configuration options message', () => {
        cy.contains('No configuration needed', { timeout: 10000 }).should('exist');
        cy.contains("This product doesn't have any configuration options").should('exist');
        cy.contains("You can add it directly to your cart").should('exist');

        cy.contains('button', 'Next').should('not.exist');
        cy.contains('button', 'Previous').should('not.exist');
    });

    it('should add product to cart without configuration', () => {
        cy.contains('button', 'Add to cart')
            .should('exist')
            .should('be.enabled');

        cy.contains('button', 'Add to cart').click({ force: true });

        cy.contains('Added to cart successfully', { timeout: 10000 }).should('exist');
    });
}); 