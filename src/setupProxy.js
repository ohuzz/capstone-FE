// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    ['/api', '/images'],
    createProxyMiddleware({
      target: 'http://localhost:8080',  // 백엔드 주소
      changeOrigin: true,
    })
  );
};
