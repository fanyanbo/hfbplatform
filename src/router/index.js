import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/components/Home'
import Dashboard from '@/components/Dashboard'

import UserList from '@/components/user/list'
import UserChangePwd from '@/components/user/changepwd'
import UserProfile from '@/components/user/profile'
import About from '@/components/user/about'

import Feedback from '@/components/page/feedback'
import Help from '@/components/page/help'
import FeedbackQ from '@/components/page/feedbackq'
import HelpQ from '@/components/page/helpq'
import DiscoveryQ from '@/components/page/discoveryq'

// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/components/Login'], resolve)

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/dashboard',
      leaf: true, // 只有一个节点
      menuShow: true,
      iconCls: 'iconfont icon-home', // 图标样式class
      children: [
        {path: '/dashboard', component: Dashboard, name: '首页', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '帮助反馈',
      menuShow: true,
      iconCls: 'iconfont icon-users',
      children: [
        {path: '/feekback', component: Feedback, name: '反馈管理', menuShow: true, iconCls: 'iconfont icon-books2'},
        {path: '/help', component: Help, name: '帮助管理', menuShow: true, iconCls: 'iconfont icon-users'}, 
        {path: '/feekbackq', component: FeedbackQ, name: '反馈查询', menuShow: true, iconCls: 'iconfont icon-books2'},
        {path: '/discoveryq', component: DiscoveryQ, name: '探索发现查询', menuShow: true, iconCls: 'iconfont icon-users'},
        {path: '/helpq', component: HelpQ, name: '帮助查询', menuShow: true, iconCls: 'iconfont icon-users'},
      ]
    },
    {
      path: '/',
      component: Home,
      name: '设置',
      menuShow: true,
      iconCls: 'iconfont icon-setting1',
      children: [
        {path: '/user/profile', component: UserProfile, name: '个人信息', menuShow: true, iconCls: 'iconfont icon-setting'},
        {path: '/user/changepwd', component: UserChangePwd, name: '修改密码', menuShow: true, iconCls: 'iconfont icon-books2'},
        {path: '/user/list', component: UserList, name: '用户列表', menuShow: true, iconCls: 'iconfont icon-users'},
        {path: '/user/about', component: About, name: '关于', menuShow: true, iconCls: 'iconfont icon-home1'}
      ]
    },
  ]
})
