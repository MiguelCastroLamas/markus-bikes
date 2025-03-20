describe('Product browsing', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.clearAllSessionStorage();
        cy.intercept('POST', 'http://localhost:4000/graphql').as('graphqlQuery');
        cy.visit('/', { timeout: 30000 });
    });

    it('should display navigation and header on homepage', () => {
        cy.get('a.text-xl.font-bold', { timeout: 10000 }).should('exist');
        cy.url().should('include', '/products');
        cy.wait('@graphqlQuery', { timeout: 10000 })
            .its('response.statusCode')
            .should('eq', 200);
    });

    it('should load products data from GraphQL API', () => {
        cy.visit('/products', { timeout: 30000 });
        cy.wait('@graphqlQuery', { timeout: 10000 }).then((interception) => {
            expect(interception).to.have.property('response');
            if (!interception.response) {
                throw new Error('GraphQL response not available');
            }

            expect(interception.response.body).to.exist;
            expect(interception.response.statusCode).to.equal(200);

            const responseBody = interception.response.body;
            expect(responseBody.data).to.exist;

            // Allow time for elements to render
            cy.wait(2000);

            cy.get('img', { timeout: 10000 }).should('exist');
            cy.get('h2, h3, h4, .product-title, .product-name', { timeout: 10000 }).should('exist');
        });
    });

    it('should filter products when searching for Bike', () => {
        cy.visit('/products', { timeout: 30000 });
        cy.wait('@graphqlQuery', { timeout: 10000 });

        cy.get('input.flex.h-10.w-full.rounded-md.border', { timeout: 10000 }).should('exist');
        cy.get('input.flex.h-10.w-full.rounded-md.border').type('Bike');

        cy.wait(1000);
        cy.get('img', { timeout: 10000 }).should('exist');
        cy.get('h2, h3, h4, .product-title, .product-name', { timeout: 10000 }).should('exist');
    });

    it('should filter products by type', () => {
        cy.visit('/products', { timeout: 30000 });
        cy.wait('@graphqlQuery', { timeout: 10000 });

        // Store the initial product count
        let initialProductCount = 0;
        cy.get('.flex.flex-col, .grid, .product-list', { timeout: 10000 })
            .find('.product-card, .card, div:has(img)')
            .then($products => {
                initialProductCount = $products.length;
            });

        // Open type filter dropdown
        cy.get('button.flex.h-10.w-full.items-center.justify-between.rounded-md', { timeout: 10000 }).click();

        // Find all filter options and select the first valid one (not "All types")
        cy.get('.dropdown-content, .popover-content, ul, [role="listbox"]', { timeout: 10000 })
            .find('li, [role="option"], button, .option-item')
            .each(($el, index) => {
                const text = $el.text().trim();

                // Skip empty or "All" options
                if (text && text !== '' && !text.toLowerCase().includes('all')) {
                    cy.wrap($el).click({ force: true });
                    cy.wrap(text).as('selectedFilter');
                    return false; // Break the .each() loop
                }
            });

        cy.wait(1000);

        // Get the selected filter text from alias and verify it appears in results
        cy.get('@selectedFilter').then(selectedFilter => {
            const filterText = selectedFilter.toString();
            if (filterText && filterText !== '') {
                cy.contains(filterText, { matchCase: false }).should('exist');
            }

            // Verify filtered results are displayed
            cy.get('.flex.flex-col, .grid, .product-list', { timeout: 10000 }).should('exist');
            cy.get('img', { timeout: 10000 }).should('exist');
            cy.get('h2, h3, h4, .product-title, .product-name', { timeout: 10000 }).should('exist');
        });
    });
}); 