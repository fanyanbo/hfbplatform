require('colors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
// var logger = require('morgan');
var logger = require('./common/logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var helmet = require('helmet');
var compress = require('compression');
var requestLog = require('./common/request_log');
var config = require('./config/config');

var signRouter = require('./routes/sign_router');
var apiRouterV1 = require('./routes/api_router_v1');
var testRouter = require('./routes/test_router');
// var users = require('./routes/users');

var app = express();

// 静态文件目录
var staticDir = path.join(__dirname, 'public');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(requestLog);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(helmet.frameguard('sameorigin')); //防止点击劫持
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(compress());
// 静态文件目录
app.use(express.static(staticDir));

// 进行跨域访问设置
//app.use(cors());
// app.use('/',function(req, res, next){
//   res.header("Access-Control-Allow-Origin", "http://localhost:8080");
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
//   next();
// });
app.use(cors({
    origin:['http://localhost:8080'],
    methods:['GET','POST'],
    alloweHeaders:['Conten-Type','Authorization','Content-Length', 'Accept,X-Requested-With'],
    credentials:true
}));

// app.use('/', index);
app.use('/help', testRouter);
app.use('/', signRouter);
app.use('/v1', apiRouterV1);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
