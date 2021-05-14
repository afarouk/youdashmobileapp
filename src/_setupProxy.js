// rename to setupProxy.js to have webpack use this file
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('well not sure');
  app.use(
    (req, res, next) => {
      console.log('well ok ys');
      createProxyMiddleware({
        target: 'http://localhost:3000',
        changeOrigin: true,
      })(req, res, next)

    }
  );
};
