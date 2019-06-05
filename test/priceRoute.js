/* eslint-env node, mocha */
const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');

// This line disables pino logging
process.env.NODE_ENV = 'test';
// eslint-disable-next-line no-unused-vars
const app = require('../index');

chai.use(chaiHttp);
const { expect } = chai;

describe('Test GET /price/:ticker', () => {
  it('Should return price when ticker is valid', async () => {
    // Mock the API call
    nock('https://api.iextrading.com')
      .get('/1.0/stock/AAPL/price')
      .reply(200, '191.05');

    const response = await chai.request('localhost:3000').get('/price/AAPL');
    expect(typeof response).to.equal('object');

    // Test response data
    expect(response.text).to.be.a('string');
    expect(response.res.statusCode).to.eq(200);
    expect(response.text).to.eq('191.05');
  });

  it('Should return a 404 error when the ticker is not valid', async () => {
    // Mock the API call
    nock('https://api.iextrading.com')
      .get('/1.0/stock/xzxzxzxzzx/price')
      .reply(404, 'Unknown symbol');

    const response = await chai.request('localhost:3000').get('/price/xzxzxzxzzx');
    expect(typeof response).to.equal('object');

    // Test response data
    expect(response.text).to.be.a('string');
    expect(response.res.statusCode).to.eq(404);
    expect(response.text).to.eq('Unknown symbol');
  });

  it('Should return a 504 error (Upstream server unavailable) when API reports a 500 internal error', async () => {
    // Mock the API call
    nock('https://api.iextrading.com')
      .get('//1.0/stock/mock-500/price')
      .reply(500, 'Internal Server Error');

    const response = await chai.request('localhost:3000').get('/price/mock-500');
    expect(typeof response).to.equal('object');

    // Test response data
    expect(response.text).to.be.a('string');
    expect(response.res.statusCode).to.eq(504);
    expect(response.text).to.eq('Upstream server unavailable');
  });

  it('Should return a 504 error (Upstream server unavailable) when API doesn\'t answer', async () => {
    // Mock the API call
    nock('https://api.iextrading.com')
      .get('//1.0/stock/mock-unresponsiveness/price')
      .replyWithError({
        code: 'ETIMEDOUT',
      });

    const response = await chai.request('localhost:3000').get('/price/mock-unresponsiveness');
    expect(typeof response).to.equal('object');

    // Test response data
    expect(response.text).to.be.a('string');
    expect(response.res.statusCode).to.eq(504);
    expect(response.text).to.eq('Upstream server unavailable');
  });
});
