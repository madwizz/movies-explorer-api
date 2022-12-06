const movieRoutes = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movie');
const { validateMovieId, validateMovieInfo } = require('../utils/validators/movieValidator');

movieRoutes.get('/movies', getMovies);
movieRoutes.post('/movies', validateMovieInfo, createMovie);
movieRoutes.delete('/movies/:_id', validateMovieId, deleteMovie);

module.exports = movieRoutes;
