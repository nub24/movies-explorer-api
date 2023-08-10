const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  max: 10,
  windowMs: 10000,
  message: 'Слишком много запросов. Попробуйте, пожалуйста, позже.',
});

module.exports = rateLimiter;
