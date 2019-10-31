import axios from 'axios'
import config from './config'
import Vue from 'vue'
import cookie from 'vue-cookie'

axios.defaults.baseURL = config.api; // 设置axios的基础请求路径
axios.defaults.timeout = 5000; // 设置axios的请求时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.withCredentials = true
axios.defaults.crossDomain = true

let vm = new Vue();
Vue.prototype.$axios = axios;// 将axios添加到 Vue的原型，这样一切vue实例都可以使用该对象

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
});

