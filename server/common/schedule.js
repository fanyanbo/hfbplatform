let schedule = require('node-schedule');
let helpModel = require('../models/helpModel');
let logger = require('./logger');

let _schedule;
// 开启定时查询任务，保持连接的活跃，防止8小时断开
exports.startQuerySchedule = function () {
    logger.warn('startQuerySchedule...');
    let rule = new schedule.RecurrenceRule();
    let hours = [1,7,13,19];
    let minutes = [30];
    let seconds = [30];
    rule.hour = hours;
    rule.minute = minutes;
    rule.second = seconds;
    _schedule = schedule.scheduleJob(rule,function(){
      helpModel.queryDiscovery(function(err,result){
        if(err) logger.error('计时器查询发生错误');
        else {
          logger.warn('query schedule: ' + new Date());
          logger.warn('query result: ' + JSON.stringify(result[0]));
        }
      });
    })
};

exports.cancelSchedule = function() {
  _schedule.cancel();
}
