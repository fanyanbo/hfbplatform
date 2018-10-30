/**
 * Created by fanyanbo on 2018/10/11.
 * 测试相关api
 */
// import * as API from './'

// export default {
//   //调用jsonp接口
//   getinfo: params => {
//     console.log("====>getinfo params=" + JSON.stringify(params));
//     return API.GET('/test/getinfo', params)
//   }
// }


import originJSONP from 'jsonp'   //引入jsonp
import * as API from '.'

//进行封装并export
function jsonp(url,data,option) {
    url += (url.indexOf('?')<0? '?' : '&')+param(data)
    console.log('===>jsonp url = ' + url);
    return new Promise((resolve,reject)=>{
      originJSONP(url,option,(err,data)=>{
        if(!err){
          resolve(data)
        }else{
          reject(err)
        }
      })
    })
}

//对data进行处理，并encodeURIComponent()进行转码。
function param(data) {
    let url = ''
    for(var k in data) {
        let value = data[k] !== undefined? data[k] : ''
        url += '&' + k + '=' + encodeURIComponent(value)
    }
    return url ? url.substring(1) : ''
}

export default {

  getinfo: params => {
    console.log("====>getinfo params=" + JSON.stringify(params));
    const baseUrl = "http://localhost:3010/test/getinfo";  
    const data = {
        "rememberId": 157,
        "activeId": 139,
        "userKeyId": 49971737,
        "source": 1
    };
    const options = {                      
        param: 'callback'
    };
    return jsonp(baseUrl,data,options);
  },

  uploadFile: params => {
    return API.POST('/help/uploadPic', params)
  },

  uploadInfo: params => {
    return API.POST('/help/uploadInfo', params)
  },

  submitIssue: params => {
    return API.POST('/help/uploadIssue', params)
  },

  getIssue: params => {
    return API.POST('/help/queryIssue', params)
  },

  submitCase: params => {
    return API.POST('/test/addCase', params);
  }

}
