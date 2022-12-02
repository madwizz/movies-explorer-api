const cardRoutes = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movie');
const { validateMovieId, validateMovieInfo } = require('../utils/validators/movieValidator');

cardRoutes.get('/movies', getMovies);
cardRoutes.post('/movies', validateMovieInfo, createMovie);
cardRoutes.delete('/movies/:_id', validateMovieId, deleteMovie);

module.exports = cardRoutes;
