const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    proxy('/api', {
      target:
        // 'https://eob-payer-promotion.us-east-1.dev.eobdcs.aws.athenahealth.com/',
        'http://localhost:8081',
      secure: false,
    })
  );
};
