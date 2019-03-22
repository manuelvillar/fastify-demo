const priceController = require('../controllers/priceController');

const routes = [
  {
    method: 'GET',
    url: '/price/:ticker',
    handler: priceController.getTickerPrice,
  },
];

module.exports = routes;
