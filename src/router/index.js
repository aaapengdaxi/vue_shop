import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
import Right from '@/components/right/Rights.vue'
import Role from '@/components/right/Roles.vue'
Vue.use(VueRouter)

const routes = [
  {path:'/',redirect:'/login'},
  {path:'/login',component:Login},
  {path:'/home',component:Home,redirect:'/welcome',children:[
    {path:'/welcome',component:Welcome},
    {path:'/users',component:User},
    {path:'/rights',component:Right},
    {path:'/roles',component:Role}
  ]}
]
const router = new VueRouter({
  routes
})
//a路由向b路由跳转的时候会执行
//导航守卫  防止非法访问 不登录就访问
router.beforeEach((to,from,next)=>{
    //to  去哪 clg 
    // console.log(to)
    //from 来自哪里
    // console.log(from)
    //去登录页面就放行
    if(to.path == '/login') return next()
    //不是的话就检查有没有token
    const tokenStr = window.sessionStorage.getItem('token')
    //没有的话 就让它去登录
    if(!tokenStr) return next('/login')
    //有的话放行
    next()
})

//本质就是改写了element内部的push方法
//对错误进行了捕获
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router
