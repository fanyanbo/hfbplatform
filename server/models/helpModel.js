var db = require('../common/db');

var helpModel = function() {};

helpModel.prototype.addIssues = function (chip, model, picList, issueType, issueContent, contact, callback) {
  let sql = "INSERT INTO issues(chip, model, picList, issueType, issueContent, contact) values(?,?,?,?,?,?)";
  let sql_params = [chip,model,picList,issueType,issueContent,contact];
  console.log(sql_params);
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}


helpModel.prototype.queryIssues = function(callback) {
 
  let sql = "SELECT * FROM issues";
  db.conn.query(sql,[],function(err,result) {
      if(err) {
        return callback(err);
      }
      callback(null,result);
  });
}

helpModel.prototype.addCase = function (chip, model, title, content, category, callback) {
  let sql = "INSERT INTO test(title, content, category, likeCount, dislikeCount) values (?,?,?,?,?,?,?)";
  let sql_params = [title,content,category,0,0];
  // let sql = "INSERT INTO test(chip, model) values (?,?)";
  // let sql_params = [chip,model];
  console.log(sql_params);
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}


helpModel.prototype.queryCase = function(callback) {
 
  let sql = "SELECT * FROM test";
  db.conn.query(sql,[],function(err,result) {
      if(err) {
        return callback(err);
      }
      callback(null,result);
  });
}

helpModel.prototype.queryDiscovery = function(callback) {
 
  let sql = "SELECT * FROM discovery";
  db.conn.query(sql,[],function(err,result) {
      if(err) {
        return callback(err);
      }
      callback(null,result);
  });
}

helpModel.prototype.updateDiscovery = function(callback) {
 
  let sql = "SELECT * FROM test";
  db.conn.query(sql,[],function(err,result) {
      if(err) {
        return callback(err);
      }
      callback(null,result);
  });
}


var helpModel = new helpModel();

module.exports = helpModel;
