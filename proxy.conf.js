const proxy = [
  {
    context: '/api',
    target: 'http://localhost:8080',
    pathRewrite: { '' : '' }
  }
];
module.exports = proxy;
