import Vue from 'vue'
import VueRouter from 'vue-router'
import Mint from 'mint-ui';
import store from './store'
import config from './config'
import  './http'
import qs from 'qs'

import VueResource from 'vue-resource'
import 'mint-ui/lib/style.css'
import 'assets/css/common.css'
import 'assets/css/swiper.min.css'

import Home from './views/Home'
import MovieDetail from './views/MovieDetail'
import Cinema from './views/Cinema'
import MovieCinema from './views/MovieCinema'
import CinemaDetail from './views/CinemaDetail'
import Me from './views/Me'
import NoData from './views/NoData'
import App from './App'
import NotFound from './components/404'
import LazyLoad from './components/lazyload'
import Myorder from './views/Myorder'
import Logintest from './views/Lonintest'
import Registertest from './views/Registertest'
import Mainui from './views/Mainui'
import Notice from './views/Notice'
import Comment from './views/Comment'
import Buyfilm from './views/Buyfilm'

import cookie from 'vue-cookie'

Vue.use(LazyLoad)
Vue.use(Mint)
Vue.use(VueRouter)
Vue.use(VueResource)

Vue.prototype.$qs = qs;
let vm = new Vue();
//Vue.config.productionTip = false

const routes = [
  {
    path:'/logintest',
    name: 'logintest',
    component : Logintest
  },
  {
    path:'/registertest',
    name: 'registertest',
    component : Registertest
  },
  {
    path:'/',
    name:'mainui',
    component: Mainui,
    redirect: '/home',
    children:[
      {
        path : '/',
        component : Home
      },
      {
        path : '/mv',
        component : Home
      },{
        path : '/movie/detail/:id',
        name: 'detail',
        component : MovieDetail
      },{
        path : '/cinema',
        name: 'cinema',
        component : Cinema
      },{
        path : '/cinema/:id',
        name: 'MovieCinema',
        component : MovieCinema
      },{
        path : '/cinema/detail/:id',
        name: 'cdetail',
        component: CinemaDetail
      },{
        path : '/me',
        component : Me
      },{
        path : '/no',
        component : NoData
      },
      {
        path : '/myorder',
        name:'myorder',
        component : Myorder
      },
      {
        path : '/notice',
        component:Notice
      },
      {
        path:'/comment/:id',
        component:Comment
      },
      {
        path:'/buymyfilm/:id',
        component:Buyfilm
      },
      {
        path : '*',
        component : NotFound
      }
    ]
  }
]

// const routes = [{
//   path : '/',
//   component : Home
// },{
//   path : '/mv',
//   component : Home
// },{
//   path : '/movie/detail/:id',
//   name: 'detail',
//   component : MovieDetail
// },{
//   path : '/cinema',
//   component : Cinema
// },{
//   path : '/cinema/detail/:id',
//   name: 'cdetail',
//   component: CinemaDetail
// },{
//   path : '/me',
//   component : Me
// },{
//   path : '/no',
//   component : NoData
// },{
//   path : '*',
//   component : NotFound
// }];
//
 const router = new VueRouter({
    //mode: 'history',  //history模式
   routes
 });

router.beforeEach((to, from, next) => {
  //store._mutations.pushLoadStack[0]()

  let cookiename = cookie.get("Huangniuniu_USERTOKEN")

  if(to.path == '/me'){
    //console.log("/me")
    next()
  }
  //从查询该电影的电影院页面跳转到电影院详情页面
   /* if(from.path == '/cinema/:id' && to.path =='/cinema/detail/:id'){
      console.log("cid=>cdetailid")
      console.log(from.path)
    }*/
  //console.log(cookiename)
  else if(cookiename){
    //存在，验证cookie正确性和刷新时效
    vm.$axios.get("/auth/verifyuser").then(()=>{
      //console.log(data);
      next()
    }).catch(()=>{
      next()
    })
  }
  else if(!cookiename) {
    next()
  }
  //next()
})


router.afterEach(route => {
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
  window.onscroll = null
  setTimeout(() => {
    //store._mutations.completeLoad[0]()
  }, 100)
})

var app = new Vue({
  el: '#app',
  router,
  store,
  ...App,
});
