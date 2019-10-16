
// appKey
// 你的企业的appKey (仅在您的服务器向七鱼服务器发送数据时需要，七鱼服务器向您的服务器发送数据时无此参数)
// time
// 当前 UTC 时间戳，从 1970 年 1 月 1 日 0 点 0 分 0 秒开始到现在的秒数
// checksum
// SHA1(appSecret + md5 + time), 三个参数拼接的字符串，进行SHA1哈希计算，转化成16进制字符(String，小写)
// 
// 其中，checksum 用于校验数据的完整性，其计算规则中，AppSecret 可在七鱼管理页面「设置」->「消息接口」页面找到，
// md5 为整个请求 json 字符串的 md5 哈希值（小写形式），即 md5 = MD5(content).toLowwerCase()，如果是上传文件，
// 则是整个文件内容的 md5，time 就是请求参数中的 time。处于安全性考虑，每个 checksum 的有效期为 5 分钟，
// 请确认发起请求的服务器是与标准时间同步的，比如有NTP服务。


const https = require('https');
const querystring = require('querystring');
const crypto = require('crypto');
var fs = require('fs');

var appKey = "395edf0429daf86f912d722a518a87e6";
var AppSecret = "BD46D278B72048DE81E3F22A4B113E8D";
	
function QiYuPost(){}

QiYuPost.prototype.post = function(chip, model, mac, activeid, ccosver, category, title, content, contact, file0base64, file1base64, file2base64, fileName0, fileName1, fileName2) {
	if (contact == "" || contact == null || contact == undefined)	// 如果联系方式是空的话，不提交工单
		return;
	createTicket(chip, model, mac, activeid, ccosver, category, title, content, contact, file0base64, file1base64, file2base64, fileName0, fileName1, fileName2);
}

function createTicket(chip, model, mac, activeid, ccosver, category, title, content, contact, file0base64, file1base64, file2base64, fileName0, fileName1, fileName2) {
	
	let postData = {
		"title": title,
		"uid": activeid,
		"content": content,
		"staffId": "3871590",
		"userMobile": contact,
		"targetGroupId": "397886066",
		"templateId":"3134692",
		"customFields" : [
			{
				"id":    "2887083",
				"value": chip
			},
			{
				"id":    "2876087",
				"value": model
			},
			{
				"id":    "2881082",
				"value": mac
			},
			{
				"id":    "2887084",
				"value": activeid
			},
			{
				"id":    "2878083",
				"value": ccosver
			},
			{
				"id":    "2879088",
				"value": contact
			},
		]
	};
	
	if (file0base64 != "" || file1base64 != "" || file2base64 != "") {
		var fileinfos = new Array();
		var cnt = 0;
		
		if (file0base64 != "") {
			var fileinfo = new Object();
			fileinfo.fileName = fileName0;
			fileinfo.type = 1;
			fileinfo.payload = file0base64;
			fileinfos[cnt] = fileinfo;
			cnt++;
		}
		
		if (file1base64 != "") {
			var fileinfo = new Object();
			fileinfo.fileName = fileName1;
			fileinfo.type = 1;
			fileinfo.payload = file1base64;
			fileinfos[cnt] = fileinfo;
			cnt++;
		}
		
		if (file2base64 != "") {
			var fileinfo = new Object();
			fileinfo.fileName = fileName2;
			fileinfo.type = 1;
			fileinfo.payload = file2base64;
			fileinfos[cnt] = fileinfo;
			cnt++;
		}
		postData.attachments = fileinfos;
	}
	
	let timestamp = new Date().getTime();
	timestamp = parseInt(timestamp / 1000);
	let timestampStr = timestamp.toString();				// 获取时间戳
	let dataStr = JSON.stringify(postData);
	let md5func = crypto.createHash('md5');
	let contentMd5 = md5func.update(dataStr).digest('hex');
	let sha1Source = AppSecret + contentMd5 + timestampStr;
	let sha1func = crypto.createHash('sha1');
	let checksum = sha1func.update(sha1Source).digest('hex');
	let urlpath = '/openapi/v2/ticket/create?appKey=' + appKey + '&time=' + timestampStr + '&checksum=' + checksum;
	
	console.log('appKey = ' + appKey);
	console.log('AppSecret = ' + AppSecret);
	console.log('timestampStr = ' + timestampStr);
	console.log('md5 = ' + contentMd5);
	console.log('checksum = ' + checksum);
	console.log('path = ' + urlpath);
	//console.log('dataStr = ' + dataStr);
	
	const options = {
		host: 'qiyukf.com',
		path: urlpath,
		method: 'POST',
		headers: { 
			'Content-Type':'application/json;charset=utf-8'
		}
	}

	const req = https.request(options, (res) => {
		console.log('statusCode:', res.statusCode);
		console.log('headers:', res.headers);
		res.on('data', (d) => {
			console.log('ret=' + d);					//将buffer转为字符串或者使用d.toString()
			let b = JSON.parse('' + d);				//将buffer转成JSON
			//console.log(b.image_id);
		});
	});
	
	req.on('error', (e) => {
		console.error(e);
	});
	
	req.write(dataStr);
	req.end();

}

var poster = new QiYuPost();

//poster.post('8H87', 'G7200', '123456789015', '384135', '6.0.2', '无聊测试', '不是问题', '不是问题,只是测试', '13800138000', '1111.jpg');

module.exports = poster;


