/**
 * Created by fanyanbo on 2017/11/13.
 * 用户相关api
 */
import * as API from './'

export default {
  //登录
  login: params => {
    console.log("====>login params=" + JSON.stringify(params));
    return API.POST('/login', params)
  },
  //登出
  logout: params => {
    return API.POST('/logout', params)
  },
  //修改个人信息
  changeProfile: params => {
    console.log("====>changeProfile params=" + JSON.stringify(params));
    return API.POST('/profile', params)
  },

  //修改密码
  changePwd: params => {
    return API.POST('/changePwd', params)
  },

  //查询用户信息列表
  findList: params => {
    return API.POST('/findList', params)
  },
}
