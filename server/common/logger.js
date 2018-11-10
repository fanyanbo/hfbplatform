var config = require('../config/index');
var pathLib = require('path')

var env = process.env.NODE_ENV || "development"
console.log('logger.js env ' + env);

var log4js = require('log4js');
log4js.configure({
    appenders: {
      fileLogs: { type: 'file', filename: pathLib.join(config.log_dir, 'cheese.log') },
      console: { type: 'console' }
    },
    categories: {
       file: { appenders: ['fileLogs'], level: config.log_file_level },
       console: { appenders: ['console'], level: config.log_console_level },
       default: { appenders: ['console', 'fileLogs'], level: 'trace' }
   }
});

var logger = log4js.getLogger(config.log_cur);

module.exports = logger;
