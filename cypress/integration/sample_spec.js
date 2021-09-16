import getServicesResponse from './sample-get-services.js';

describe('My First Test', () => {
  it('Visits the Kitchen Sink', () => {
    cy.intercept({
      method: 'GET',
      url: 'https://muni-portal-backend.openup.org.za/api/**',
    }, {statusCode: 500}).as('unMocked');

    cy.intercept({
      method: 'GET',
      url: '**/api/wagtail/v2/pages/?type=core.ServicePage&fields=*&limit=100',
    }, {
      statusCode: 200,
      body: getServicesResponse,
      headers: {'access-control-allow-origin': '*'} ,
    }).as('getServices');

    cy.visit('http://localhost:3000');

    cy.wait('@getServices');

    cy.contains('Service A');
    cy.contains('Service B');
  });
});
