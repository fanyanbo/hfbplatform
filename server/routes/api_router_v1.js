/*!
 * pdvplatform
 * Copyright(c) 2018 fanyanbo <fanyanbo@skyworth.com>
 * MIT Licensed
 */

var express = require('express');
var config = require('../config/config');
var logger = require('../common/logger');
var output = require('../common/output');

var router = express.Router();

// let isAuthenticated = function(req, res, next) {
//   if(req.session.username == undefined || !req.session.logined) {
//     return output.error(req,res,"拒绝访问");
//   }
//   next();
// }

// router.use('/', isAuthenticated); //api访问控制。除了登录，session校验，登出接口外，其余接口访问需要进行验证

// router.post('/device/queryAll', device.queryAll);
// router.post('/chip/add', device.addChip);
// router.post('/chip/query', device.queryChip);
// router.post('/chip/update', device.updateChip);
//
// router.post('/home/getSummary',function(req,res,next){
//   console.log("test");
//   console.log(req.session.username);
//   console.log(req.session.logined);
//   next();
// }, home.getSummary);                //查询总览信息

module.exports = router;
