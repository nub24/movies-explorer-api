const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  max: 30,
  windowMs: 1000,
  message: 'Слишком много запросов. Попробуйте, пожалуйста, позже.',
});

module.exports = rateLimiter;
