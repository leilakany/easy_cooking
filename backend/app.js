const createError = require('http-errors');
const cors = require('cors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const testAPIRouter = require('./routes/testAPI');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
// Need a virtual environment loaded in a .env file
require('dotenv').config();

const app = express();
app.use(express.json());
// Connect to mongoose
mongoose
    .connect(process.env.DATABASE_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log('DB Connected!')) // If everything went well, this should display
    .catch((err) => {
        console.log(`DB Connection Error: ${err.message}`);
    });

// Define some routers
const ingredientRouter = require('./routes/ingredient');
const groceryListRouter = require('./routes/grocery');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/ingredient', ingredientRouter); // Under endpoint /ingredient, we have REST operations for ingredient
app.use('/grocery_list', groceryListRouter);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
