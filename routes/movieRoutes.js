const movieRoutes = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movie');
const { validateMovieId, validateMovieInfo } = require('../utils/validators/movieValidator');

movieRoutes.get('/', getMovies);
movieRoutes.post('/', validateMovieInfo, createMovie);
movieRoutes.delete('/:_id', validateMovieId, deleteMovie);

module.exports = movieRoutes;
