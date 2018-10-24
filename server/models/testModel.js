var db = require('../common/db');

var TestModel = function() {};

TestModel.prototype.addIssues = function (chip, model, picList, issueType, issueContent, contact, callback) {
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


TestModel.prototype.queryIssues = function(callback) {
 
  let sql = "SELECT * FROM issues";
  db.conn.query(sql,[],function(err,result) {
      if(err) {
        return callback(err);
      }
      callback(null,result);
  });
}

var testModel = new TestModel();

module.exports = testModel;
