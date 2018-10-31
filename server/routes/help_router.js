var express = require('express');
var router = express.Router();
var helpController = require('../controllers/helpController');

/* GET users listening. */

router.get('/getinfo', function(req, res, next) {
   // jsonp必备
   var _callback = req.query.callback;
   var responseData = { email: 'example@163.com', name: 'fanyanbo' };
   console.log('_callback = ' + _callback);
   console.log('query = ' + JSON.stringify(req.query));
   if (_callback){
       res.type('text/javascript');
       res.send(_callback + '(' + JSON.stringify(responseData) + ')');
   }
   else{
       res.json(responseData);
   }
});

router.post('/uploadInfo', function(req, res) { 
    res.json({"code": 0000, "msg": "数据提交成功"});
});
router.post('/uploadIssue', helpController.uploadIssue);
router.post('/queryIssue', helpController.queryIssue);
router.post('/getCase', helpController.queryCase);
router.post('/addCase', helpController.addCase);

router.post('/queryDiscovery',helpController.queryDiscovery);
router.post('/updateDiscovery',helpController.updateDiscovery);

module.exports = router;
