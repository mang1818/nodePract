const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const Joi = require('joi');

const app = express();
// anoop singh
var courses = [
    { id:1, name: "anoop"},
    { id:2, name: "anoop1"},
    { id:3, name: "anoop3"}
];

const userSchema = mongoose.Schema({
    name: String,
    age : Number
});
mongoose.connect('mongodb://localhost:27017/nodeTut4', {useNewUrlParser: true}, function (err, database) {
    if(err) throw err; db = database; // Start the application after the database connection is ready
    // console.log(database);
});
const Users = mongoose.model('Users', userSchema);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.get('/api/courses/', function (req, res) {
    var arr = [1,3,5,6];
    $.each(arr, function (i,n) {
        console.log('asd')
    });
    return res.status(200).send(courses);
});

app.get('/api/courses/:id', function (req, res) {
    if (!req.body.id) return res.send(courses);
    let courseData = courses.find(function (c) {
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

app.delete('/api/course/:id', function (req, res) {
    let courseData = courses.find(function (c) {
        return c.id === parseInt(req.params.id);
    });
    let place = courses.indexOf(courseData);
    courses.splice(place,1);
    res.send(courses);
});

app.post('/api/users/', function (req, res) {
    const user = new Users({
        name: req.body.name,
        age :req.body.age
    });
    user.save().then(result => {console.log(result)}).catch();
    // res.status(200).send(res)
});

app.get('/api/get-users/:age/', function (req, res) {
    Users.find({$or:[{age: req.params.age}, {name: req.query.name}]}, function (err, users) {
       if (err) res.status(400).send(err.message);
       res.status(200).send(users);
    });
});
app.put('/api/users/:name/', function (req, res) {
    Users.update({name:req.params.name},{age:req.body.age}, function (err, users) {
        if (err) res.status(400).send(err.body.age);
        res.send(users);
    });
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
