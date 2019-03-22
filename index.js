const oas = require('fastify-oas');
const fastify = require('fastify')({
  logger: true,
});


// Autogenerate OpenAPI docs for the API
fastify.register(oas, {
  routePrefix: '/documentation',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'Stock Ticker Price API',
      description: 'This API returns the price of any stock price on an stock using iextrading service.',
      version: '1.0.0',
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here',
    },
    consumes: ['application/json'],
    produces: ['application/json'],
  },
});

// Add routes
const routes = require('./routes');

routes.forEach((route) => {
  fastify.route(route);
});

// Run the server
const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.oas();
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

// For testing purposes
module.exports = start;
