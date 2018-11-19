var express = require('express');
var router = express.Router();
var sign = require('../controllers/sign');

/* GET users listening. */
router.get('/test', function(req, res, next) {
  res.send('您好，欢迎访问帮助反馈接口，请登录网址：http://www.coocaa.com');
  // res.redirect('http://localhost:3018/html/login.html');
});

router.post('/login', sign.login);
router.post('/profile', sign.profile);
router.post('/logout', sign.logout);
router.post('/changePwd', sign.changePwd);
router.post('/findList', sign.findList);

module.exports = router;
