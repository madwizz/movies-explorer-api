require('dotenv').config();
const express = require('express');
const bitfilmsdb = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/user');

const NotFoundError = require('./utils/classErrors/NotFoundError');
const errorHandler = require('./utils/errorHandler');
const { validateLogin, validateRegister } = require('./utils/validators/userValidator');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./utils/cors');

const { PORT = 3001, MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const app = express();

app.use(bodyParser.json());
bitfilmsdb.connect(MONGO_URL);
app.use(requestLogger);
app.use(cors);

app.post('/signin', validateLogin, login);
app.post('/signup', validateRegister, createUser);

app.use(auth);
app.use('/users', userRoutes);
app.use('/movies', movieRoutes);
app.use('*', () => {
  throw new NotFoundError('URL is not found. Check URL and request method');
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});
