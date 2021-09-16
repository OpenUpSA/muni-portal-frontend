describe('List services', () => {
  it('Links to the services', () => {
    // Mock all requests to the backend as obviously broken
    cy.intercept({
      method: 'GET',
      url: 'https://muni-portal-backend.openup.org.za/api/**',
    }, {statusCode: 500}).as('unMocked');

    // Mock the request relevant to this test to return services for test
    cy.intercept({
      method: 'GET',
      url: '**/api/wagtail/v2/pages/?type=core.ServicePage&fields=*&limit=100',
    }, {
      statusCode: 200,
      fixture: 'listServices-getServices.json',
      headers: {'access-control-allow-origin': '*'} ,
    }).as('getServices');

    cy.visit('http://localhost:8080');

    cy.wait('@getServices');

    cy.contains('Service A');
    cy.contains('Service B');
  });
});
