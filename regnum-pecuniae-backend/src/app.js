const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/contact', contactRoutes);

module.exports = app;
