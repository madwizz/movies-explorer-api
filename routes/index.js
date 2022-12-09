const routes = require('express').Router();

const userRoutes = require('./userRoutes');
const movieRoutes = require('./movieRoutes');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/user');
const NotFoundError = require('../utils/classErrors/NotFoundError');
const { validateLogin, validateRegister } = require('../utils/validators/userValidator');

routes.post('/signin', validateLogin, login);
routes.post('/signup', validateRegister, createUser);

routes.use(auth);
routes.use('/users', userRoutes);
routes.use('/movies', movieRoutes);
routes.use('*', () => {
  throw new NotFoundError('URL is not found. Check URL and request method');
});

module.exports = routes;
