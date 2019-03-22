const axios = require('axios');

const url = 'https://api.iextrading.com/1.0/stock/{symbol}/price';

// eslint-disable-next-line consistent-return
exports.getTickerPrice = async (request, response) => {
  try {
    const myUrl = url.replace(/\{symbol\}/, request.params.ticker);
    const res = await axios.get(myUrl);
    const { data } = res;
    return data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      response.status(error.response.status).send(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      response.status(504).send('Upstream server unavailable');
      throw (error); // To let fastify log the error.
    } else {
      // Something happened in setting up the request that triggered an Error
      response.status(500).send(error.message);
      throw (error); // To let fastify log the error.
    }
  }
};
