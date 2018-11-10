var validator = require('validator');
var output = require('../common/output');
var logger = require('../common/logger');
var userModel = require('../models/userModel');

/**
 * Handle user login.
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.login = function (req, res, next) {
  logger.debug("enter login");
  var loginname = validator.trim(req.body.username).toLowerCase();
  var pass = validator.trim(req.body.pwd);
  logger.debug(loginname + "," + pass);

  if (!loginname || !pass) {
    return res.json({"errcode": 40002, "errmsg": "不合法的参数"});
  }

  userModel.getUserByQuery(loginname, function(err,result) {
     if(err){
       return output.error(req,res,err);
     }
     if(result.length == 0) {
       logger.error("用户名不存在:" + loginname);
       return res.json({"errcode": 40003, "errmsg": "用户不存在"});
     }
     if(result.length == 1) {
       let passStored = result[0].password;
       if(passStored == pass){
         // req.session.username = loginname;
         // req.session.logined = true;
         // req.session.level = result[0].adminFlag;
         // req.session.email = result[0].email;
         let resObj = {
           id: result[0].id,
           username: result[0].username,
           nickname: result[0].nickname,
           name: result[0].name,
           email: result[0].email
         };
         return res.json(resObj);
       }else{
         return res.json({"errcode": 40004, "errmsg": "密码错误"});
       }
     }else{
       logger.error("用户名查询长度大于1");
       return res.json({"errcode": 40005, "errmsg": "内部错误"});
     }
   });
};

exports.profile = function (req, res, next) {
  logger.debug("enter profile");
  var username = validator.trim(req.body.username);
  logger.debug("enter profile usename = " + username);
  var nickname = validator.trim(req.body.nickname);
  logger.debug("enter profile nickname = " + nickname);
  var name = validator.trim(req.body.name);
  logger.debug("enter profile name = " + name);
  var email = validator.trim(req.body.email);
  logger.debug("enter profile email = " + email);

  userModel.changeUserInfo(username,nickname,name,email, function(err,result) {
     if(err){
       return res.json({"errcode": 40005, "errmsg": "内部错误"});
     }
     return res.json({"errcode": 0});
   });
}

exports.logout = function (req, res, next) {
  logger.debug("enter logout");
  return res.json({"errcode": 0});
};

exports.changePwd = function (req, res, next) {
  logger.debug("enter changePwd");
  var username = validator.trim(req.body.username);
  logger.debug("enter changePwd usename = " + username);
  var oldPwd = validator.trim(req.body.oldPwd);
  logger.debug("enter changePwd oldPwd = " + oldPwd);
  var newPwd = validator.trim(req.body.newPwd);
  userModel.changeUserPwd(username,oldPwd,newPwd,function(err,result) {
     if(err){
       return res.json({"errcode": 40005, "errmsg": err});
     }
     return res.json({"errcode": 0});
   });
};

exports.findList = function (req, res, next) {
  logger.debug("enter findList");
  let page = parseInt(req.body.page || 1);
  let limit = parseInt(req.body.limit || 10);
  let name = req.body.name || '';
  userModel.find(page,limit,name,function(err,result) {
     if(err){
       return res.json({"errcode": 40005, "errmsg": err});
     }
     return res.json({"errcode": 0, "total": result.length, "users": result});
   });
};
