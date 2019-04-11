var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const Joi = require('joi');

var app = express();

var courses = [
    { id:1, name: "anoop"},
    { id:2, name: "anoop1"},
    { id:3, name: "anoop3"}
];
// mongoose.connect('mongodb://localhost:3000/test', {useNewUrlParser: true});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/api/courses/:id', function (req, res) {
  const courseData = course.find(function (c) {
      return c.id === parseInt(req.params.id);
  });
  res.send(courseData);
});

app.post('/api/course/', function (req, res) {
    const schema = {
       name : Joi.string().min(3).required()
    };
    // const result = Joi.validate(req.body, schema);
    // console.log(result);
    req.body.forEach(function (data) {
        var expArray = [];
        data.exp.forEach(function (n) {
            expArray.push(n.companyName);
        });
        var course = {
            id : courses.length + 1,
            name : data.name,
            exp : expArray
        };
        courses.push(course);
    });
  //   if (!req.body.name || req.body.name.length<3) {
  //     res.status(400).send('Not valid data');
  //     return;
  // }
   res.send(courses);

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
