const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const sequelize = require("sequelize")
const logger = require('morgan');
const session = require("express-session");
const flash = require("connect-flash");
const fileupload = require("express-fileupload");
const dotenv = require("dotenv").config();
const indexRouter = require('./routes/index');

const app = express();
let port = process.env.port 

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(fileupload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set up session and flash
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(flash());

// Routes
app.use('/', indexRouter);

// 404 error handler
app.use((req, res, next) => {
  next(createError(404));
});

// General error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`start your server  ${port}`);
});

module.exports = app;
