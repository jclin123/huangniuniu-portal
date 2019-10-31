<template>
  <section>
    <mt-header fixed title="评论" style="background-color:#FF2C43;height:50px"></mt-header>
    <div style="height: 50px"></div>
    <form action>
      <div class="page-field">
        <div class="page-part scoreradio tipscomment">
        <br />
        <span>评分:</span>
          <ul class="StarsWrap">
            <li v-for="(i,index) in list" :key="index" @click="clickStars(index)">
              <img :src="xing>index?stara:starb" style="width: 20px;height: 20px"/>
            </li>
            <!--<li>{{rateScoreText}}</li>-->
          </ul>&nbsp;&nbsp;
          <p>{{rateScoreText}}</p>
        </div>
        <div class="page-part">
          <mt-field class="form-control" v-model="comments" placeholder="电影好看吗？评论一下吧！" type="textarea" rows="12"></mt-field>
          <mt-button @click.native="openConfirm" size="large" type="danger" plain>发布</mt-button>
        </div>
      </div>
    </form>
  </section>
</template>
<script>
import { MessageBox } from "mint-ui";
import cookie from 'vue-cookie'
export default {
    data() {
    return {
      userid: null,
      nickname: '',
      movieid: null, //电影id
      movieName: '',//电影名称
      comments: '',//评论内容
      rateScoreText: '',
      rateScoreDesc: ['非常不满意，很不好看', '不满意，不好看', '一般，感觉一般', '比较满意，还不错', '非常满意,非常好看'],
      stara: 'static/images/lxx.jpg',//亮星星
      list: [0,1,2,3,4],
      starb: 'static/images/axx.jpg',//暗星星
      xing: 0,
    }
  },

  created(){
    let id = this.$route.params.id
    //根据排场id查询得到电影id
    this.$axios.get("/cinema/skedule/"+id).then(({data})=>{
      this.movieid = data.movieid
      this.movieName = data.movieName
    })

    let cookiename = cookie.get("Huangniuniu_USERTOKEN")
    let _this = this
    if(cookiename){
      //存在，验证cookie正确性和刷新时效
      this.$axios.get("/auth/verifyuser").then(({data})=>{
        _this.userid = data.id;
        _this.nickname = data.username
      }).catch(()=>{
        //跳转登录页
        _this.$router.push('/logintest')
      })
    }
  },

  methods: {
    clickStars(i){
      this.rateScoreText=this.rateScoreDesc[i]
      this.xing = i+1
      //console.log("点击了"+(i+1)+"颗星")
    },

    openConfirm() {
      let id = this.$route.params.id
      let _this =this
      //先评分
      if (this.xing == 0) {
        this.$messagebox("", "请给出评分");
        return false;
      }

      if (!this.comments.trim()) {
        this.$messagebox("", "请填写评论内容");
        return false;
      }
      if (this.comments.trim() == '' || this.comments.length > 200 || this.comments.length < 2) {
        this.$messagebox("", "评论字数在2-200字之间");
        return false;
      }

          //添加评论
          _this.$axios.post("/comment",
            _this.$qs.stringify({
              userid: _this.userid,
              nickname: _this.nickname,
              movieid: _this.movieid,
              movieName: _this.movieName,
              commentWords: _this.comments,
              score: _this.xing * 2,
              skeduleid: id
            })
          ).then(()=>{
            _this.$messagebox("", "评论成功");
            _this.$router.push('/me')
          }).catch(()=>{
            _this.$messagebox("", "评论失败，请稍后再评论");
          })

    }
  }
}
</script>
<style lang="">
    .tipscomment {
        font-size: 16px;
        color: #999;
    }
    .scoreradio input{
        border:1px solid  #fd2c32;
        margin-left: 5px;
        
    }
    .scoreradio {
        margin-bottom: 10px;
    }

    /*加星星*/
    .StarsWrap{
      width: 100%;
      height: 0.2rem;
      margin: 0.1rem 0;
    }
    .StarsWrap li{
      float: left;
      margin-right: 0.1rem;
    }
</style>
