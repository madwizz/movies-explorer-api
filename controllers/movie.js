const Movie = require('../models/movie');
const [
  INVALID_DATA_ERROR,
  MOVIE_NOT_FOUND_ERROR,
  FORBIDDEN_DELETE_MOVIE_ERROR,
  MOVIE_ID_VALIDATION_ERROR,
  MOVIE_DELETED_MESSAGE,
] = require('../utils/constants');
const BadRequestError = require('../utils/classErrors/BadRequestError');
const NotFoundError = require('../utils/classErrors/NotFoundError');
const ForbiddenError = require('../utils/classErrors/ForbiddenError');

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    res.send(movies);
  } catch (error) {
    next(error);
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create({ ...req.body, owner: req.user._id });
    res.send(movie);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError(INVALID_DATA_ERROR));
    } else {
      next(error);
    }
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params._id);
    if (!movie) {
      throw new NotFoundError(MOVIE_NOT_FOUND_ERROR);
    }
    if (req.user._id === movie.owner.toString()) {
      await Movie.findByIdAndDelete(req.params._id);
      return res.send(MOVIE_DELETED_MESSAGE);
    }
    throw new ForbiddenError(FORBIDDEN_DELETE_MOVIE_ERROR);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new BadRequestError(MOVIE_ID_VALIDATION_ERROR));
    }
    return next(error);
  }
};
