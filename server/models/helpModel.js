var db = require('../common/db');

var helpModel = function() {};

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

helpModel.prototype.queryIssue= function(callback) {
 
  let sql = "SELECT * FROM issue";
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

helpModel.prototype.updateDiscovery = function(categoryId, titleId,likeFlag,countflag,callback) {
 
  console.log(categoryId + ' ' + titleId + ' ' + likeFlag + ' ' + countflag);
  let sql;
  let dislikeCount1 = 0, likeCount1 = 0;
  
  sql = "select likeCount,dislikeCount from discovery where category_id = \"" + categoryId +  "\" AND title_id = \"" + titleId + "\"; ";
  db.conn.query(sql, function (err, result) {
    if(err){
      console.log('[SELECT ERROR] - ', err.message);
      callback(err);
      return;
    }
	
    console.log(result);
        
    for (var i in result)
    {
      dislikeCount1 = result[i].dislikeCount;
      likeCount1 = result[i].likeCount;
      break;
    }
    
    if(likeFlag == 0) { //表示点踩
    if(countflag == 0) { //表示撤销点踩
      dislikeCount1--;
      if (dislikeCount1 < 0)
        dislikeCount1 = 0;
      sql = "UPDATE discovery SET dislikeCount=" + dislikeCount1 + " WHERE category_id = ? AND title_id = ?";
    }else {
      dislikeCount1++;
      sql = "UPDATE discovery SET dislikeCount=" + dislikeCount1 + " WHERE category_id = ? AND title_id = ?";
    } 
    } else { //表示点赞
      if(countflag == 0) { //表示撤销点赞
      	likeCount1--;
      	if (likeCount1 < 0)
      	  likeCount1 = 0;
        sql = "UPDATE discovery SET likeCount=" + likeCount1 + " WHERE category_id = ? AND title_id = ?";
      }else {
      	likeCount1++;
        sql = "UPDATE discovery SET likeCount=" + likeCount1 + " WHERE category_id = ? AND title_id = ?";
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

function checkRecordExist(arr, item)
{
  for (var j in arr) {
    if (arr[j].chip == item.chip &&
      arr[j].model == item.model &&
      arr[j].mac == item.mac &&
      arr[j].activeid == item.activeid &&
      arr[j].category == item.category &&
      arr[j].title == item.title &&
      arr[j].content == item.content &&
      arr[j].contact == item.contact && 
      arr[j].picurl != null && 
      arr[j].picurl != "" && 
      item.picurl != null && 
      item.picurl != "" 
      )
      return j;
  }
  return -1;
}

// 合并查询结果(因为前端在传输图片的时候，一条记录包含多张图片时，会生成多条数据库记录，该函数把多图片的记录，合并成一条记录包含多张图片)
function uniteQueryResult(oldResult) {
  var newResult = new Array();
  for (var i in oldResult) 
  {
    var item = oldResult[i];
    var idx = checkRecordExist(newResult, item);
    if (idx < 0) {
      var newobj = new Object;
      newobj.id = item.id;
      newobj.chip = item.chip;
      newobj.model = item.model;
      newobj.mac = item.mac;
      newobj.activeid = item.activeid;
      newobj.category = item.category;
      newobj.title = item.title;
      newobj.content = item.content;
      newobj.contact = item.contact;
      newobj.picurl = item.picurl;
      newobj.optTime = item.optTime;
      newobj.hasExport = item.hasExport;
      var curidx = newResult.length;
      newResult[curidx] = newobj;
    }
    else {
      newResult[idx].picurl += ";" + item.picurl;
    }
  }
  return newResult;
}

helpModel.prototype.queryFeedbackV2 = function(exportFlag, date1, date2, pageSize, pageNum, callback) {

  var sqltext = "";

  if (date1 == "default" || date2 == "default") {

    sqltext = "SELECT * FROM feedback;";

  } else {

    var d1 = new Date(date1);
    var d2 = new Date(date2);
    d2.setDate(d2.getDate() + 1);         // 往后推一天

    var year1 = d1.getFullYear();
    var mon1 = d1.getMonth() + 1;
    var day1 = d1.getDate();
    var year2 = d2.getFullYear();
    var mon2 = d2.getMonth() + 1;
    var day2 = d2.getDate();

    if (mon1 < 10)
      mon1 = "0" + mon1;
    if (mon2 < 10)
      mon2 = "0" + mon2;
    if (day1 < 10)
      day1 = "0" + day1;
    if (day2 < 10)
      day2 = "0" + day2;

    var str1 = "" + year1 + "-" + mon1 + "-" + day1 + " 00:00:00";
    var str2 = "" + year2 + "-" + mon2 + "-" + day2 + " 00:00:00";

    sqltext = "select * from feedback where (optTime >= '" + str1 + "') and (optTime <= '" + str2 + "');";

    console.log("sqltext = " + sqltext);
  }

  db.conn.query(sqltext, [], function(err, result) {
      if(err) {
        return callback(err);
      }
      var newResult = uniteQueryResult(result);       // 合并多图片记录
      callback(null, newResult);
  });
}

helpModel.prototype.markExportFlag = function(idList, callback) {

  var sqltext = "update feedback set hasExport=1 where id in (";
  for (var i in idList) {
    if (i == 0)
      sqltext += "\'";
    else 
    sqltext += ",\'";
    sqltext += idList[i];
    sqltext += "\'";
  }
  sqltext += ");";

  console.log("sqltext = " + sqltext);

  db.conn.query(sqltext, [], function(err, result) {
    if(err) {
      return callback(err);
    }
    callback(null, result);
  });
}

helpModel.prototype.login = function(username, password, callback) {
  var sqltext = 'SELECT userName,email FROM users where userName="' + username + '" and password="' + password + '";';
  db.conn.query(sqltext, [], function(err, result) {
    if(err) {
      return callback(err);
    }
    callback(null, result);
  });
}

var helpModel = new helpModel();

module.exports = helpModel;
