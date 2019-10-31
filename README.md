# vue2.0构建[黄牛牛](https://h5.m.taobao.com/app/movie/pages/index/index.html?from=def&spm=a1z2r.7661912.h5-movie-list.121&sqm=a1z2r.7661912.1.1&bottomtab=show)页面

## 如何运行
下载项目
```
 git clone https://github.com/canfoo/vue2.0-taopiaopiao.git
```
 打开一个终端，安装依赖包
```
 npm install
```

启动前端开发服务
```
 npm run dev
```

## 项目预览
![Mou icon](./Screenshots/1.gif) ----------
![Mou icon](./Screenshots/2.gif)
![Mou icon](./Screenshots/3.gif) ----------
![Mou icon](./Screenshots/4.gif)

## 主要目录结构
> build  
> config <br/>
> src  //前端主要开发目录<br/>
>  --assets  //存放前端静态资源<br/>
>  --components  //存放组件<br/>
>  --store  //vuex数据流管理<br/>
>  --views  //页面试图，由vue-router引入<br/>
>  --App.vue <br/>
>  --main.js  //前端入口文件<br/>
>server  //后台服务<br/>
>  --bin  //启动后台服务配置<br/>
>  --database  //存放页面所需要的json数据<br/>
>  --public  //前端部署时存放在后台服务的位置<br/>
>  --routes  //路由于请求接口管理<br/>
>  --views  //前端模板存放位置<br/>
>  --app.js  //后台服务入口<br/>
