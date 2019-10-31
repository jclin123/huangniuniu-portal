<template>
  <section class="me">
    <mt-header title="我的" style="position:relative;background-color:#FF2C43;height:50px"></mt-header>
    <template>
      <mt-cell title="登录注册" to="/logintest" is-link value></mt-cell>
    </template>

    <template v-if="myshowall">
      <mt-cell title="我的电影票" to="/myorder" is-link value></mt-cell>
      <mt-cell title="消息通知" to="/notice" is-link value>
        <!--<span style="margin-right: 5px;">未读消息</span>
        <mt-badge type="error" size="small">1</mt-badge>-->
      </mt-cell>
      <mt-cell title="退出登录" @click.native="exitLogin" is-link value></mt-cell>
    </template>
  </section>
</template>

<script>
import { mapMutations } from "vuex";
import cookie from 'vue-cookie'

export default {
  name: "me",
  data() {
    return {
		myshowall:false
	};
  },
  components: {},
  methods: {
    //点击退出登录
    exitLogin(){
      let _this = this
      console.log("退出登录")
      let token = cookie.get("Huangniuniu_USERTOKEN")
      this.myshowall = false //登录标志为false
      //清除服务器端的cookie
      this.$axios.get("/auth/exituser").then(()=>{
        //设置该cookie值过期，清除客户端的cookie
        //cookie.set("Huangniuniu_USERTOKEN",token,"0");
        cookie.delete('Huangniuniu_USERTOKEN')  // 删除cookie
      })

    },

    ...mapMutations(["pushLoadStack", "completeLoad"])
  },
  created() {
    this.pushLoadStack()
    //console.log("/me初始化了")
    let cookiename = cookie.get("Huangniuniu_USERTOKEN")
    let _this = this
    //console.log(cookiename)
    if(cookiename){
      //存在，验证cookie正确性和刷新时效
      this.$axios.get("/auth/verifyuser").then(()=>{
        _this.myshowall = true  //登录状态
      }).catch(()=>{
        //跳转登录页
        //vm.$router.push('/logintest')
      })
    }
    this.completeLoad();//加载效果去除
  }
};
</script>

<style>
.me {
  /* padding-top: 10px; */
}
/* .page-title {
    overflow: hidden;
    height: 50px;
	text-align:center
} */
</style>

