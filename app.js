require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
// const rateLimit = require('./middlewares/rateLimit');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { MONGO_URL, PORT_NUM } = require('./utils/config');

const { NODE_ENV, PORT = PORT_NUM, DB_URL } = process.env;
const app = express();

mongoose
  .connect(NODE_ENV === 'production' ? DB_URL : MONGO_URL)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log(`DB error: ${err}`));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(helmet());
// app.use(rateLimit);

app.use('/', router);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Server ok');
});
