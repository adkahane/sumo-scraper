describe('Test the /scrape API', function() {
  it('hits the /scrape endpoint', function() {
    cy.request('/scrape').then((response) => {
      expect(response.status).to.eq(200)
    })
  })
})