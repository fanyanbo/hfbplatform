import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/components/Home'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/helloworld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      leaf: true, // 只有一个节点
      menuShow: true,
      iconCls: 'iconfont icon-home'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      leaf: true, // 只有一个节点
      menuShow: true,
      iconCls: 'iconfont icon-home'
    }
  ]
})
