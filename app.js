require('dotenv').config();
const express = require('express');
const bitfilmsdb = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const routes = require('./routes/index');
const rateLimit = require('./utils/rateLimit');
const errorHandler = require('./utils/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./utils/cors');

const { PORT = 3001, MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const app = express();

app.use(bodyParser.json());
bitfilmsdb.connect(MONGO_URL);
app.use(requestLogger);
app.use(rateLimit);
app.use(helmet());
app.use(cors);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});
