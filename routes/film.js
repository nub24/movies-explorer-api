const filmRouter = require('express').Router();
const { validationCreateFilm, validationFilmId } = require('../middlewares/validation');

const {
  createFilm,
  getFilms,
  deleteFilm,
} = require('../controllers/films');

filmRouter.get('/', getFilms);
filmRouter.post('/', validationCreateFilm, createFilm);
filmRouter.delete('/:_id', validationFilmId, deleteFilm);

module.exports = filmRouter;
