const express = require('express');
const { STATIC_PATH } = require('./constants');
const cors = require('cors');
const { errorHandlers } = require('./middleware');
const router = require('./routes');

const app = express();

const corsOptions = {
    origin: '*'
}

app.use(cors(corsOptions));

app.use(express.static(STATIC_PATH));

app.use(express.json());

app.use('/api', router);

app.use(errorHandlers.dbErrorHandler, errorHandlers.errorHandler);

module.exports = app;