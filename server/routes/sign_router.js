var express = require('express');
var router = express.Router();
var sign = require('../controllers/sign');

/* GET users listening. */
router.get('/', function(req, res, next) {
  res.send('aa请登录网址：http://www.baidu.com');
  // res.redirect('http://localhost:3018/html/login.html');
});

router.post('/login', sign.login);
router.post('/profile', sign.profile);
router.post('/logout', sign.logout);
router.post('/changePwd', sign.changePwd);
router.post('/findList', sign.findList);

module.exports = router;
