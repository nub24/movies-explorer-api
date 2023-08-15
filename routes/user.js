const userRouter = require('express').Router();
const {
  validationUpdateUser,
} = require('../middlewares/validation');

const {
  getUserInfo,
  updateProfile,
} = require('../controllers/users');

userRouter.get('/me', getUserInfo);
userRouter.patch('/me', validationUpdateUser, updateProfile);

module.exports = userRouter;
