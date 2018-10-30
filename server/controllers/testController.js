var validator = require('validator');
var output = require('../common/output');
var logger = require('../common/logger');
var testModel = require('../models/testModel');
var fs = require('fs');
var path= require("path");
var formidable = require('formidable');


exports.uploadIssue = function (req, res, next) {

  // let chip = validator.trim(req.body.chip);
  // let model = validator.trim(req.body.model);
  // let pannelSize = validator.trim(req.body.pannelSize);
  // let issueType = validator.trim(req.body.issueType);
  // let issueContent = validator.trim(req.body.issueContent);
  // let contact = validator.trim(req.body.contact);
  // let picList = validator.trim(req.body.picList);


  // if (!chip || !model) {
  //   return res.json({"errcode": 40002, "errmsg": "不合法的参数"});
  // }
    let chip, model, issueType, issueContent, contact, picName;
    console.log('======>testController upload picture req = ' + JSON.stringify(req.body));
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = path.join(__dirname + "/../public/upload");
    form.keepExtensions = true;
    form.maxFieldsSize = 5 * 1024 * 1024;
    form.parse(req, function (err, fields, files){
        
        console.log(fields);
        chip = fields.chip;
        model = fields.model;
        issueType = fields.issueType;
        issueContent = fields.issueContent;
        contact = fields.contact;
        if (err) {
            console.log('=======>error ' + err);
            res.json({"errcode": 40002, "errmsg": "解析发生错误"});
        }
        var filename = files.file.name
        console.log(filename);
        var nameArray = filename.split('.');
        console.log(nameArray);
        var type = nameArray[nameArray.length - 1];
        console.log(type);
        var name = '';
        for (var i = 0; i < nameArray.length - 1; i++) {
            name = name + nameArray[i];
        }
        var date = new Date();
        var time = '_' + date.getFullYear() + "_" + date.getMonth() + "_" + date.getDay() + "_" + date.getHours() + "_" + date.getMinutes();
        var avatarName = name + time + '.' + type;
        console.log(avatarName);
        var newPath = form.uploadDir + "/" + avatarName;
        console.log(newPath);
        fs.renameSync(files.file.path, newPath); 
        // res.send({data:"/upload/"+avatarName})
        picName = "http://172.20.133.47:3010/upload/" + avatarName;

        testModel.addIssues(chip,model,picName,issueType,issueContent,contact, function(err,result) {
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


exports.queryIssue = function (req, res, next) {

  testModel.queryIssues(function(err, result) {
     if(err){
       return res.json({"errcode": 40005, "errmsg": err});
     }
     console.log('====>' + JSON.stringify(result));
     return res.json({"errcode": 0, "total": result.length, "data": result});
   });
};
