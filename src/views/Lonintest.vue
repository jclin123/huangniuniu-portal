<template>
  <div id="mydiv">
    <!-- 提醒栏 -->
    <div class="tipslogin">
      <span>请登录</span>
      <span class="closeSpan"><a href="javascript:void(0)" @click="backto()">返回</a></span>
    </div>
    <div class="imgDiv">
      <img src="../assets/logo.png" class="logo" />
    </div>
    <!-- 操作区域 -->
    <div class="operateDiv">
      <!-- 账号 -->
      <mt-field placeholder="请输入手机号" v-model="phonenumber" class="myinput"></mt-field>
      <!-- 密码 -->
      <mt-field
        v-show="isPass"
        placeholder="请输入密码"
        type="password"
        v-model="upass"
        class="myinput"
      ></mt-field>
      <!-- 短信验证码 -->
      <mt-field v-show="!isPass" placeholder="校验码" v-model="code" class="myinput">
        <span class="getCode" v-show="show" @click="getCodeMethod">获取短信验证码</span>
        <span v-show="!show" class="count">{{count}}s后重新获取</span>
      </mt-field>
      <!-- 免费注册块 -->
      <div class="registerDiv">
        <router-link to="/registertest"><span>免费注册</span></router-link>
        <!-- <span v-show="forgetPassShowroNot">忘记密码</span> -->
      </div>
      <!-- 登录和切换登录方式块 -->
      <div>
        <mt-button size="large" class="mybutton" @click.native="login">登录</mt-button>
        <mt-button
          size="large"
          type="primary"
          class="mybutton"
          @click.native="changeLoginMethod"
        >{{defaultAccountText}}</mt-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      phonenumber: "",//手机号
      upass: "",//密码
      isPass: true,//是否用密码登录
      code: "",//验证码
      show: true,//显示获取验证码的文字，false时显示倒计时
      count: 0,//显示时间
      timer: null,//获取验证码的计时器
      // 切换登录方式按钮默认显示的文本
      defaultAccountText: "短信验证码登录"
    };
  },
  methods: {
    backto(){
      this.$router.back();
      //console.log('我是中国二年')
    },

    //发送验证码
    getCodeMethod(){
      let _this = this
      //axios请求
      //console.log("发送手机验证码");
      this.$axios.post('/user/code',this.$qs.stringify({
          phonenumber: this.phonenumber
        })
      ).then(()=>{
        // 验证码倒计时
        if (_this.count == 0) {
          _this.count = 60;
          _this.show = false;
          _this.timer = setInterval(() => {
            if (_this.count > 0 && _this.count <= 60) {
              _this.count--;
            } else {
              _this.show = true;
              clearInterval(_this.timer);
              _this.timer = null;
            }
          }, 1000);
        }
        console.log("发送成功")
      }).catch(()=>{
        //console.log("发送失败")
        _this.$messagebox("", "验证码发送失败,请重新发送");
      })


    },


    // 登录显示模态框 调用 mint-ui 的 messagebox
    login() {
      let _this = this
      //密码登录
      if(this.isPass){
        if (!this.phonenumber) {
          this.$messagebox("", "请输入手机号");
          return false;
        }
        if (!this.upass) {
          this.$messagebox("", "请输入密码");
          return false;
        }
        //密码登录
        //console.log("密码登录")
        this.$axios.post("/auth/accountpassword",this.$qs.stringify({
            account: this.phonenumber,
            password: this.upass
          })
        ).then(()=>{
          this.$messagebox("", "登录成功");
          _this.$router.push('/')
        }).catch(()=>{
          this.$messagebox("", "手机号或者密码错误");
        })
      }else{
        //验证码登录
        if (!this.phonenumber) {
          this.$messagebox("", "请输入手机号");
          return false;
        }
        if (!this.code) {
          this.$messagebox("", "请输入验证码");
          return false;
        }
        //验证码登录
        //console.log("验证码登录")
        this.$axios.post("/auth/phonenumbercode",this.$qs.stringify({
            phonenumber: this.phonenumber,
            code: this.code
          })
        ).then(()=>{
          this.$messagebox("", "登录成功");
          _this.$router.push('/')
          //_this.$router.back()
        }).catch(()=>{
          this.$messagebox("", "手机号或者验证码错误");
        })
      }

    },
    // 切换登录方式
    changeLoginMethod() {
      this.phonenumber = ''
      this.upass = ''
      this.code = ''
      if (this.isPass) {
        this.defaultAccountText = "账户密码登录";
      } else {
        this.defaultAccountText = "短信验证码登录";
      }
      this.isPass = !this.isPass;
    }
  }
};
</script>

<style lang="" scoped>
/* 你需要登录才能继续仿问的布局样式 */
.tipslogin {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 52px;
  background: rgb(238, 238, 238);
  padding-left: 20px;
  padding-right: 20px;
}
/* 半闭样式 */
.closeSpan {
  color: rgb(153, 153, 153);
}
/* 图片 logo 根样式 */
.imgDiv {
  padding-top:30px;
  display: flex;
  justify-content: center;
}
/* 图片样式 */
.logo {
  width: 80px;
  height: 80px;
}
/* 上面的线隐藏 */
.mint-cell-wrapper {
  background-image: linear-gradient(180deg, #fff, #fff 0%, transparent 0%);
}
/* 输入框底边框样式 */
.mint-cell-wrapper {
  border-bottom: 1px solid #FF2C43;
}

/* 修改按钮按钮下的默认颜色 */
.mint-button::after {
  background-color: transparent;
}
/* 操作区域的样式*/
.operateDiv {
  padding-left: 20px;
  padding-right: 20px;
}
/* 输入框边距 */
.myinput {
  margin-top: 30px;
}
/* 获取短信验证码字体颜色 */
.getCode {
  color: #FF2C43;
  font-size: 17px;
  border-left: 1px solid #b5b5b5;
  padding-left: 7px;
}
/* 免费注册根样式 */
.registerDiv {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/* 免费注册字体样式*/
.registerDiv span {
  color: #555;
}
/* 登录短信验证按钮边距 */
.mybutton {
  margin-top: 20px;
}
/* 修改默认 butoon 的样式 达到和淘宝登录一样 */
.mint-button--default {
  background: -webkit-linear-gradient(left, #FF2C43, #FF2C43) no-repeat;
  border-radius: 25px;
  color: #fff;
  height: 48px;
}
/* 同上 */
.mint-button--primary {
  border-radius: 25px;
  height: 48px;
  background-color: transparent;
  border: 1px solid #FF2C43;
  color: #FF2C43;
}
/* 修改默认弹框的样式，达到基本和淘宝的效果一样 */
.mint-msgbox {
  border-radius: 8px;
  width: 70%;
}
/* 弹出框内容样式 */
.mint-msgbox-content {
  min-height: 50px;
  font-size: 18px;
}
/* 弹出内容居中 */
.mint-msgbox-message {
  line-height: 50px;
}
/* 弹出框确定按钮样式 */
.mint-msgbox-btns {
  height: 60px;
}
/* 弹出框确定按钮字体 */
.mint-msgbox-confirm {
  color: #FF2C43;
}
</style>
