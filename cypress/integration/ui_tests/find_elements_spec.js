// Find all elements on the page
// Make sure that all scraped articles are being displayed

let len = 0;

describe('Test the UI', function() {
  it('Finds the Scrape button', function() {
    cy.visit('/');
    cy.request('/scrape');
    cy.get('#scrape').click();
  });
  
  it('Finds an article and verifies all elements within', function() {
    cy.server();
    cy.route('/articles').as('getArticles');
    cy.request('/articles');
    cy.wait('@getArticles').then((xhr) => {
      let articles = xhr;
      len = articles.response.body.length;
      console.log(len);
      cy.get('.card').should('have.length', len);
    });
  });

  it('Finds Article Image', function() {
    cy.get('.card-img-top');
  });

  it('Finds Article Title', function() {
    cy.get('.card-title');
  });

  it('Finds Article Summary', function() {
    cy.get('.card-text');
  });

  it('Finds Article Link', function() {
    cy.get('#link');
  });
});