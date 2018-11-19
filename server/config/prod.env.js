/**
 * prod.env.js
 * author : fanyanbo@coocaa.com
 */

var path = require('path');

var config = {
  // debug 为 true 时，用于本地调试
  debug: false,

  rootPath: path.join(__dirname, '../'),

  get mini_assets() { return !this.debug; }, // 是否启用静态文件的合并压缩，详见视图中的Loader

  name: '帮助与反馈平台', // 平台名字
  description: '基于酷开系统的帮助与反馈业务平台', // 平台的描述
  keywords: 'nodejs, node, express, mysql',

  // 协议+域名+端口？
  host: 'https://webx.coocaa.com/hfdplatform', 
  // 程序运行的端口
  port: 3010,

  //数据库？
  mysql: {
    user: 'webx', // 用户名
    password: 'WebX_MySQL2018', // 密码
    database: 'help', // 数据库
    host: 'localhost', // host
    port: 3306, // 端口
    checkExpirationInterval: 24*60*60*1000, // How frequently expired sessions will be cleared; milliseconds
    connectionLimit: 1, // 连接池的连接个数，默认为 1
  //  prefix: 'scm_', // 数据表前缀，如果一个数据库里有多个项目，那项目之间的数据表可以通过前缀来区分
    dateStrings:true, // 强制timestamp,datetime,data类型以字符串类型返回，默认为false
    multipleStatements: true
  },

  session_secret: 'hfbp_ladygaga', // 务必修改
  cookie_name: 'hfbp_sid',
  cookie_maxAge: 24*60*60*1000,     //60分钟

  log_dir: path.join(__dirname, '../logs'),

  // 设置log输出路径等级:trace,debug,info,warn,error
  log_file_level: 'warn',
  log_console_level: 'trace',
  //设置当前输出路径：file,console,default
  log_cur: 'file',

  file_limit: '1MB',

};

module.exports = config;
