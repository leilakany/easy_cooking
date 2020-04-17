var createError = require('http-errors');
const cors = require('cors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var testAPIRouter = require('./routes/testAPI');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mongoose = require('mongoose');
// Need a virtual environment loaded in a .env file
require('dotenv').config()

var app = express();
app.use(express.json());
// Connect to mongoose
mongoose
  .connect(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('DB Connected!')) // If everything went well, this should display
  .catch(err => {
    console.log("DB Connection Error: " + err.message);
  });

// Define some routers
var ingredientRouter = require('./routes/ingredient');
var groceryListRouter = require('./routes/grocery'  )

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/testAPI', testAPIRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/ingredient', ingredientRouter); // Under endpoint /ingredient, we have REST operations for ingredient
app.use('/grocery_list', groceryListRouter)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
