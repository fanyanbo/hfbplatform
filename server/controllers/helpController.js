var validator = require('validator');
var output = require('../common/output');
var helpModel = require('../models/helpModel');
var fs = require('fs');
var path= require("path");
var formidable = require('formidable');

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
    let category = validator.trim(req.body.category);
    let title = validator.trim(req.body.title);
    let content = validator.trim(req.body.content);
    let contact = validator.trim(req.body.contact);
    
    helpModel.addFeedback(chip,model,mac,activeid,category,title,content,contact,function(err, result) {
        if(err) {
            return output.error(req,res,err);
        } else {
            console.log(JSON.stringify(result));
            return res.json({"errcode": 00000, "errmsg": "提交成功"});
        }
     });
  };

  exports.addFeedbackExtra = function (req, res, next) {

    let _chip,_model,_mac,_activeid,_category,_title,_content,_contact,_picurl;
    console.log('addFeedbackExtra = ' + JSON.stringify(req.body));
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = path.join(__dirname + "/../public/upload");
    form.keepExtensions = true;
    form.maxFieldsSize = 5 * 1024 * 1024;
    form.parse(req, function (err, fields, files){
        
        console.log(fields);
        _chip = fields.chip;
        _model = fields.model;
        _mac = fields.mac;
        _activeid = fields.activeid;
        _category = fields.category;
        _title = fields.title;
        _content = fields.content;
        _contact = fields.contact;

        if (err) {
            console.log('error ' + err);
            return res.json({"errcode": 40002, "errmsg": "解析发生错误"});
        }
        let filename = files.file.name
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

        let picurlP = "http://172.20.133.47:3010/upload/" + avatarName;
        let picurlD = "http://localhost:3010/upload/" + avatarName;

        process.env.NODE_ENV === 'development' ? _picurl = picurlP : _picurl = picurlD;

        console.log(_picurl);

        helpModel.addFeedbackExtra(_chip,_model,_mac,_activeid,_category,_title,_content,_contact,_picurl, function(err,result) {
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

  exports.queryFeedback = function (req, res, next) {

    helpModel.queryFeedback(function(err, result) {
        if(err){
          return res.json({"errcode": 40005, "errmsg": err});
        }
        return res.json({"errcode": 0, "total": result.length, "data": result});
      });
  };



