var db = require('../common/db');
var logger = require('../common/logger');
var config = require('../config/config');

var UserModel = function() {};

UserModel.prototype.query = function (id, callback) {
  logger.debug("User.prototype.query id = " + id);
  var sql = "select * from users";
  db.conn.query(sql,[],function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

UserModel.prototype.getUserByQuery = function(username, callback) {
  logger.debug("User.prototype.getUserByQuery username = " + username);
  let sql = "select * from users where userName = ?";
  let sql_params = [username];
  db.conn.query(sql,sql_params,function(err,rows,fields) {
      if(err) {
        return callback(err);
      }
      callback(null,rows);
  });
}

UserModel.prototype.changeUserInfo = function(username, nickname, name, email, callback) {
  logger.debug("User.prototype.changeUserInfo username = " + username + ",nickname = " + nickname);
  let sql = "UPDATE users SET nickname = ?, name = ?, email = ? WHERE username = ?";
  let sql_params = [nickname,name,email,username];
  db.conn.query(sql,sql_params,function(err,result) {
      if(err) {
        return callback(err);
      }
      callback(null);
  });
}

UserModel.prototype.changeUserPwd = function(username, oldPwd, newPwd, callback) {
  logger.debug("User.prototype.changeUserPwd username = " + username);
  let sql0 = "select * from users where userName = ?";
  db.conn.query(sql0,[username],function(err,result) {
      if(err) {
        return callback(err);
      }
      if(result.length == 0) return callback("数据不存在！");
      console.log("changeUserPwd result = " + JSON.stringify(result));
      if(result[0].password == oldPwd) {
        let sql = "UPDATE users SET password = ? WHERE username = ?";
        console.log("changeUserPwd sql = " + sql);
        db.conn.query(sql,[newPwd,username],function(err,result) {
          if(err) {
            return callback(err);
          }
          callback(null);
        });
      } else {
        callback("原密码输入错误！");
      }
  });
}

UserModel.prototype.find = function(page, limit, name, callback) {
  logger.debug("User.prototype.find limit = " + limit + ",name = " + name);
  let username = `username like '%${name}%'`;
  let nickname = `nickname like '%${name}%'`;
  let lastname = `name like '%${name}%'`;
  console.log("find nickname=" + nickname);
  var sql = `SELECT * FROM users WHERE ${username} OR ${nickname} OR ${lastname}`;
  db.conn.query(sql,[],function(err,result) {
      if(err) {
        return callback(err);
      }
      console.log("find result = " + JSON.stringify(result));
      let total = 0;
      total = result.length;
      // let resObj = {
      //   total: total,
      //   limit: limit,
      //   users: result
      // };
      callback(null,result);
  });
}

var userModel = new UserModel();

module.exports = userModel;
