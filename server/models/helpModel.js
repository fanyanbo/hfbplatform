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

helpModel.prototype.addIssue = function (chip, model, mac, activeid, category, title, likeCount, dislikeCount, callback) {
  let sql = "INSERT INTO issue(chip, model, mac, activeid, category, title, likeCount, dislikeCount) values(?,?,?,?,?,?,?,?)";
  let sql_params = [chip, model, mac, activeid, category, title, likeCount, dislikeCount];
  console.log(sql_params);
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

helpModel.prototype.updateIssue = function(chip, model, mac, category, title, likeCount, dislikeCount,callback) {
 
  console.log(chip + ' ' + model + ' ' + mac + ' ' + likeCount + ' ' + dislikeCount);
  let sql = "UPDATE issue SET dislikeCount=?,likeCount = ? WHERE chip = ? AND model = ? AND mac = ? AND category = ? AND title = ?";
  console.log(sql);
  let sql_params = [dislikeCount,likeCount,chip,model,mac,category,title];
  db.conn.query(sql,sql_params,function(err,result) {
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

helpModel.prototype.updateDiscovery = function(categoryId,titleId,likeFlag,countflag,callback) {
 
  console.log(categoryId + ' ' + titleId + ' ' + likeFlag + ' ' + countflag);
  let sql;
  if(likeFlag == 0) { //表示点踩
    if(countflag == 0) { //表示撤销点踩
      sql = "UPDATE discovery SET dislikeCount=dislikeCount-1 WHERE category_id = ? AND title_id = ?";
    }else {
      sql = "UPDATE discovery SET dislikeCount=dislikeCount+1 WHERE category_id = ? AND title_id = ?";
    } 
  } else { //表示点赞
    if(countflag == 0) { //表示撤销点赞
      sql = "UPDATE discovery SET likeCount=likeCount-1 WHERE category_id = ? AND title_id = ?";
    }else {
      sql = "UPDATE discovery SET likeCount=likeCount+1 WHERE category_id = ? AND title_id = ?";
    } 
  }
  console.log(sql);
  let sql_params = [categoryId,titleId];
  db.conn.query(sql,sql_params,function(err,result) {
      if(err) {
        return callback(err);
      }
      callback(null,result);
  });
}

helpModel.prototype.addFeedback = function (chip, model, mac, activeid, category, title, content, contact, callback) {
  console.log('enter addFeedback');
  let sql = "INSERT INTO feedback(chip, model, mac, activeid, category, title, content, contact) values (?,?,?,?,?,?,?,?)";
  let sql_params = [chip, model, mac, activeid, category, title, content, contact];
  console.log(sql_params);
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

helpModel.prototype.addFeedbackExtra = function (chip, model, mac, activeid, category, title, content, contact, picurl, callback) {
  let sql = "INSERT INTO feedback(chip, model, mac, activeid, category, title, content, contact, picurl) values (?,?,?,?,?,?,?,?,?)";
  let sql_params = [chip, model, mac, activeid, category, title, content, contact, picurl];
  console.log(sql_params);
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

helpModel.prototype.queryFeedback = function(callback) {
 
  let sql = "SELECT * FROM feedback";
  db.conn.query(sql,[],function(err,result) {
      if(err) {
        return callback(err);
      }
      callback(null,result);
  });
}


var helpModel = new helpModel();

module.exports = helpModel;
