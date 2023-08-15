const Film = require('../models/film');
const NotFoundError = require('../errors/notFounrError');
const ValidationError = require('../errors/validationError');
const CastError = require('../errors/castError');
const ForbiddenError = require('../errors/forbiddenError');

const { OK_CODE, CREATED_CODE } = require('../utils/constants');

module.exports.createFilm = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  const owner = req.user._id;

  Film.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((film) => {
      film
        .populate('owner')
        .then(() => res.status(CREATED_CODE).send(film));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.getFilms = (req, res, next) => {
  const { _id } = req.user;

  Film.find({ owner: _id })
    .populate(['owner', '_id'])
    .then((films) => {
      res
        .status(OK_CODE)
        .send(films);
    })
    .catch(next);
};

module.exports.deleteFilm = (req, res, next) => {
  const filmId = req.params._id;
  const userId = req.user._id;
  Film.findById(filmId)
    .then((film) => {
      if (!film) {
        throw new NotFoundError('Карточка не найдена!');
      }
      if (film.owner.toString() !== userId) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
      return Film.findByIdAndRemove(filmId).then(() => res.status(OK_CODE).send({ data: film }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new CastError('Некорректный ID!'));
      }
      return next(err);
    });
};
