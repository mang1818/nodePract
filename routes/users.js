var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/register', function(req, res, next) {
  res.render('profile', { title : "Registration" });
});
router.post('/register-data', function (req, res, next) {
  console.log(req.body.name);
  res.send(req.body.name);
});
module.exports = router;
