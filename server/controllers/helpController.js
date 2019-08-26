let validator = require('validator');
let output = require('../common/output');
let helpModel = require('../models/helpModel');
let fs = require('fs');
let path= require("path");
let formidable = require('formidable');
let config = require('../config/index');
var logger = require('../common/logger');

exports.queryDiscovery = function (req, res, next) {

    helpModel.queryDiscovery(function(err, result) {
       if(err){
         return res.json({"errcode": 40005, "errmsg": err});
       }
       return res.json({"errcode": 0, "total": result.length, "data": result});
     });
};

exports.updateDiscovery = function (req, res, next) {

    let categoryId = req.body.categoryId;
    let titleId = req.body.titleId;
    let likeFlag = req.body.likeFlag;
    let countFlag = req.body.countFlag;

    helpModel.updateDiscovery(categoryId,titleId,likeFlag,countFlag,function(err, result) {
       if(err){
         return res.json({"errcode": 40005, "errmsg": err});
       }
       console.log('====>' + JSON.stringify(result));
       return res.json({"errcode": 00000, "errmsg": "提交成功"});
     });
};

exports.addIssue = function (req, res, next) {

    let chip = req.body.chip;
    let model = req.body.model;
    let mac = req.body.mac;
    let activeid = req.body.activeid;
    let category = req.body.category;
    let title = req.body.title;
    let likeCount =  req.body.likeCount;
    let dislikeCount =  req.body.dislikeCount;

    helpModel.addIssue(chip,model,mac,activeid,category,title,likeCount,dislikeCount,function(err, result) {
       if(err){
         return res.json({"errcode": 40005, "errmsg": err});
       }
       console.log('====>' + JSON.stringify(result));
       return res.json({"errcode": 00000, "errmsg": "提交成功"});
     });
};

  
exports.updateIssue = function (req, res, next) {

    let chip = req.body.chip;
    let model = req.body.model;
    let mac = req.body.mac;
    let category = req.body.category;
    let title = req.body.title;
    let likeCount =  req.body.likeCount;
    let dislikeCount =  req.body.dislikeCount;

    helpModel.updateIssue(chip,model,mac,category,title,likeCount,dislikeCount,function(err, result) {
       if(err){
         return res.json({"errcode": 40005, "errmsg": err});
       }
       console.log('====>' + JSON.stringify(result));
       return res.json({"errcode": 00000, "errmsg": "提交成功"});
     });
  };

  exports.queryIssue = function (req, res, next) {

    helpModel.queryIssue(function(err, result) {
       if(err){
         return res.json({"errcode": 40005, "errmsg": err});
       }
       console.log('====>' + JSON.stringify(result));
       return res.json({"errcode": 0, "total": result.length, "data": result});
     });
};

  exports.addFeedback = function (req, res, next) {

    console.log('addFeedback = ' + JSON.stringify(req.body));
    let chip = validator.trim(req.body.chip);
    let model = validator.trim(req.body.model);
    let mac = validator.trim(req.body.mac);
    let activeid = validator.trim(req.body.activeid);
    let ccosver = validator.trim(req.body.ccosver);
    let category = validator.trim(req.body.category);
    let title = validator.trim(req.body.title);
    let content = validator.trim(req.body.content);
    let contact = validator.trim(req.body.contact);
    
    helpModel.addFeedback(chip,model,mac,activeid,ccosver,category,title,content,contact,function(err, result) {
        if(err) {
            return output.error(req,res,err);
        } else {
            console.log(JSON.stringify(result));
            return res.json({"errcode": 00000, "errmsg": "提交成功"});
        }
     });
  };

  exports.addFeedbackExtra = function (req, res, next) {

    let _chip,_model,_mac,_activeid,_ccosver,_category,_title,_content,_contact,_picurl;
    console.log('addFeedbackExtra = ' + JSON.stringify(req.body));
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    logger.error("__dirname = " + __dirname);
    form.uploadDir = path.join(__dirname + "/../public/upload");
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024;
    form.parse(req, function (err, fields, files){
        
        console.log(fields);
        _chip = fields.chip;
        _model = fields.model;
        _mac = fields.mac;
        _activeid = fields.activeid;
        _ccosver = fields.ccosver;
        _category = fields.category;
        _title = fields.title;
        _content = fields.content;
        _contact = fields.contact;

        if (err) {
            console.log('error ' + err);
            return res.json({"errcode": 40002, "errmsg": "解析发生错误"});
        }
        let filename = files.file.name;
        let nameArray = filename.split('.');
        let type = nameArray[nameArray.length - 1];
        let name = '';
        for (let i = 0; i < nameArray.length - 1; i++) {
            name = name + nameArray[i];
        }
        let date = new Date();
        let time = '_' + date.getFullYear() + "_" + date.getMonth() + "_" + date.getDay() + "_" + date.getHours() + "_" + date.getMinutes();
        let avatarName = name + time + '.' + type;
        console.log(avatarName);
        let newPath = form.uploadDir + "/" + avatarName;
        console.log(newPath);
        fs.renameSync(files.file.path, newPath); 

        _picurl = config.host + "/upload/" + avatarName;

        console.log(_picurl);

        helpModel.addFeedbackExtra(_chip,_model,_mac,_activeid,_ccosver,_category,_title,_content,_contact,_picurl, function(err,result) {
            if(err) {
              return output.error(req,res,err);
            } else {
              console.log(JSON.stringify(result));
              return res.json({"errcode": 00000, "errmsg": "提交成功"});
            }
        });
    });

    form.on('error', function(err) {
        console.log('onError err = ' + err);
        return res.json({"errcode": 40002, "errmsg": "监听发生错误"});
    });
  };

  exports.addFeedbackExtra2 = function (req, res, next) {

    let _chip,_model,_mac,_activeid,_ccosver,_category,_title,_content,_contact,_picurl;
    console.log('addFeedbackExtra = ' + JSON.stringify(req.body));
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    logger.error("__dirname = " + __dirname);
    form.uploadDir = path.join(__dirname + "/../public/upload");
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024;
    form.parse(req, function (err, fields, files){
        
      var info1 = 'fields = ' + JSON.stringify(fields);
      var info2 = '\r\n\r\nfiles = ' + JSON.stringify(files);
      var fs = require('fs');
      fs.writeFile('/home/webx/text1.txt', info1 + info2);
      /*
        console.log(fields);
        _chip = fields.chip;
        _model = fields.model;
        _mac = fields.mac;
        _activeid = fields.activeid;
        _ccosver = fields.ccosver;
        _category = fields.category;
        _title = fields.title;
        _content = fields.content;
        _contact = fields.contact;

        if (err) {
            console.log('error ' + err);
            return res.json({"errcode": 40002, "errmsg": "解析发生错误"});
        }
        let filename = files.file.name;
        let nameArray = filename.split('.');
        let type = nameArray[nameArray.length - 1];
        let name = '';
        for (let i = 0; i < nameArray.length - 1; i++) {
            name = name + nameArray[i];
        }
        let date = new Date();
        let time = '_' + date.getFullYear() + "_" + date.getMonth() + "_" + date.getDay() + "_" + date.getHours() + "_" + date.getMinutes();
        let avatarName = name + time + '.' + type;
        console.log(avatarName);
        let newPath = form.uploadDir + "/" + avatarName;
        console.log(newPath);
        fs.renameSync(files.file.path, newPath); 

        _picurl = config.host + "/upload/" + avatarName;

        console.log(_picurl);

        helpModel.addFeedbackExtra(_chip,_model,_mac,_activeid,_ccosver,_category,_title,_content,_contact,_picurl, function(err,result) {
            if(err) {
              return output.error(req,res,err);
            } else {
              console.log(JSON.stringify(result));
              return res.json({"errcode": 00000, "errmsg": "提交成功"});
            }
        });
        */
    });

    form.on('error', function(err) {
        console.log('onError err = ' + err);
        return res.json({"errcode": 40002, "errmsg": "监听发生错误"});
    });
  };

  exports.queryFeedback = function (req, res, next) {

    helpModel.queryFeedback(function(err, result) {
        if(err){
          return res.json({"errcode": 40005, "errmsg": err});
        }
        return res.json({"errcode": 0, "total": result.length, "data": result});
      });
  };

  exports.queryFeedbackV2 = function (req, res, next) {

    console.log('queryFeedbackV2 = ' + JSON.stringify(req.body));
    let date1 = validator.trim(req.body.date1);
    let date2 = validator.trim(req.body.date2);
    let pageSize = validator.trim(req.body.pageSize);
    let pageNum = validator.trim(req.body.pageNum);

    helpModel.queryFeedbackV2(false, date1, date2, pageSize, pageNum, function(err, result) {
        if(err){
          return res.json({"errcode": 40005, "errmsg": err});
        }
        //console.log(result);
        return res.json({"errcode": 0, "total": result.length, "data": result});
      });
  };

  function escapeStringForCSV(oldString)
  {
    if (oldString.indexOf('\"') >= 0)
    {
      var i;
      var newstr = '';
      
      for (i=0; i < oldString.length; i++) {
        var ch = oldString.charAt(i);
        if (ch == "\"")
          newstr += '\"\"';
        else
          newstr += ch;
      }

      return '\"' + newstr + '\"';
    }
    else if (oldString.indexOf(',') >= 0)
    {
      return '\"' + oldString + '\"';
    }
    else if (oldString.indexOf('\r\n') >= 0)
    {
      return '\"' + oldString + '\"';
    }
    else
      return oldString;
  }

  exports.exportFeedbackV2 = function (req, res, next) {
    console.log('exportFeedbackV2 = ' + JSON.stringify(req.body));
    let date1 = validator.trim(req.query.date1);
    let date2 = validator.trim(req.query.date2);
    let pageSize = validator.trim(req.query.pageSize);
    let pageNum = validator.trim(req.query.pageNum);
    let filter = validator.trim(req.query.filter);
    let expIdList = new Array();                            // 导出的问题的ID列表

    helpModel.queryFeedbackV2(true, date1, date2, pageSize, pageNum, function(err, result) {
        if(err){
          return res.json({"errcode": 40005, "errmsg": err});
        }

        var filename = "export-feekback.csv";
        res.writeHead(200, {
          'Content-Type': 'application/octet-stream',                             //告诉浏览器这是一个二进制文件    
          'Content-Disposition': 'attachment; filename=' + encodeURI(filename),   //告诉浏览器这是一个需要下载的文件
        });
        res.write('\xEF\xBB\xBF', 'binary');
        res.write('日期,问题编号,机芯,机型,MAC,激活ID,酷开版本,问题类型,问题描述,图片地址,联系方式,是否已导出\n');

        var checkCondition;
        if (filter == "exist") {
          checkCondition = function(contact) {
            if (contact != null && contact != "")
              return true;
            else
              return false;
          };
        }
        else if (filter == "none") {
          checkCondition = function(contact) {
            if (contact == null || contact == "")
              return true;
            else
              return false;
          };
        } 
        else {
          checkCondition = function(contact) {
            return true;
          };
        }

        for (var i in result)
        {
          var curItem = result[i];
          if (checkCondition(curItem.contact))
          {
            var arr = curItem.optTime.split(" ");
            var curDate = arr[0];
            res.write(escapeStringForCSV('' + curDate) + ',');
            res.write(escapeStringForCSV('' + curItem.id) + ',');
            res.write(escapeStringForCSV('' + curItem.chip) + ',');
            res.write(escapeStringForCSV('' + curItem.model) + ',');
            res.write(escapeStringForCSV('' + curItem.mac) + ',');
            res.write(escapeStringForCSV('' + curItem.activeid) + ',');
            res.write(escapeStringForCSV('' + curItem.sysVersion) + ',');
            res.write(escapeStringForCSV('' + curItem.category) + ',');
            res.write(escapeStringForCSV('' + curItem.title + ' - ' + curItem.content) + ',');
            res.write(escapeStringForCSV('' + curItem.picurl) + ',');
            res.write(escapeStringForCSV('' + curItem.contact) + ',');
            if (curItem.hasExport == 0)
              res.write('否\n');
            else
              res.write('是\n');

            var curidx = expIdList.length;
            expIdList[curidx] = curItem.id;         // 把导出的问题的ID值加入列表中
          }
        }

        // 将已经导出的问题，标记为已导出的标志。
        helpModel.markExportFlag(expIdList, function(err, result) {

        });

        res.end();

        //return res.json({"errcode": 0, "total": result.length, "data": result});
      });
  };

  exports.login = function (req, res, next) {

    console.log('login = ' + JSON.stringify(req.body));
    let username = validator.trim(req.body.username);
    let password = validator.trim(req.body.password);

    helpModel.login(username, password, function(err, result) {
        if(err){
          return res.json({"errcode": 40005, "errmsg": err});
        }

        var hasUser = false;
        var userName = "";
        var email = "";
        for (var i in result) {
          hasUser = true;
          userName = result[i].userName;
          break;
        }

        if (hasUser) {

          req.session.regenerate(function(err) {
            if(err){
              return res.json({"errcode": 40005, "errmsg": "req.session.regenerate fail."});     
            }
            req.session.userName = userName;
            req.session.email = email;
            return res.json({"errcode": 0, "userName": userName, "email": email});
          });
        }
        else {
          return res.json({"errcode": 40005, "errmsg": "cannot find user."});
        }
      });
  };

  exports.checkLogin = function (req, res, next) {
    var loginUser = req.session.userName;
    console.log('checkLogin() loginUser = ' + loginUser);
    var isLogined = !!loginUser;
    if (isLogined) {
      return res.json({"isLogined": "true", "userName": loginUser});
    }
    else {
      return res.json({"isLogined": "false"});
    }
  }

