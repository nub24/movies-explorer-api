const { celebrate, Joi } = require('celebrate');

const REGEXP_URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(REGEXP_URL),
  }),
});

const validationAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const validationCreateFilm = celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(3).max(50).required(),
    director: Joi.string().min(3).max(100).required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    duration: Joi.number().required(),
    image: Joi.string().required().regex(REGEXP_URL),
    trailerLink: Joi.string().required().regex(REGEXP_URL),
    thumbnail: Joi.string().required().regex(REGEXP_URL),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validationFilmId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  validationCreateUser,
  validationAuth,
  validationUpdateUser,
  validationCreateFilm,
  validationFilmId,
};
