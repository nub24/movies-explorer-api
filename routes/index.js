const router = require('express').Router();
const auth = require('../middlewares/auth');

const signupRouter = require('./signup');
const signinRouter = require('./signin');
const userRouter = require('./user');
const filmRouter = require('./film');
const NotFoundError = require('../errors/notFounrError');

router.use('/', signupRouter);
router.use('/', signinRouter);
router.use('/users', auth, userRouter);
router.use('/movies', auth, filmRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
