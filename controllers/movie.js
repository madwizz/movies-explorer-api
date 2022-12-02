const Movie = require('../models/movie');
const BadRequestError = require('../utils/classErrors/BadRequestError');
const NotFoundError = require('../utils/classErrors/NotFoundError');
const ForbiddenError = require('../utils/classErrors/ForbiddenError');

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({});
    res.send(movies);
  } catch (error) {
    next(error);
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const movie = await Movie.create({ name, link, owner: req.user._id });
    res.send(movie);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid data is received'));
    } else {
      next(error);
    }
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.cardId);
    if (!movie) {
      throw new NotFoundError('Movie is not found');
    }
    if (req.user._id === movie.owner.toString()) {
      await Movie.findByIdAndDelete(req.params.cardId);
      return res.send({ message: 'Movie has been deleted' });
    }
    throw new ForbiddenError('It is not allowed to delete movies which you did not create');
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new BadRequestError('Movie _id is not valid'));
    }
    return next(error);
  }
};
