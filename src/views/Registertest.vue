<template>
  <div id="registertest">
    <!-- 提醒栏 -->
    <div class="tipslogin">
      <span>正在注册</span>
      
          <keep-alive>
            <span class="closeSpan" @click="backto()">返回</span>
          </keep-alive>
      
    </div>
    <div class="imgDiv">
      <img src="../assets/logo.png" class="logo" />
    </div>
    <!-- 操作区域 -->
    <div class="operateDiv">
      <!-- 账号 -->
      <mt-field label="手机号" placeholder="请输入手机号" v-model="phonenumber" class="myinput"></mt-field>
      <mt-field label="昵称" placeholder="请输入昵称"  class="myinput" v-model="nickname"></mt-field>
      <!-- 密码 -->
      <mt-field
        label="密码"
        placeholder="请输入密码(6位-18位)"
        type="password"
        v-model="upass"
        class="myinput"
      ></mt-field>
      <mt-field
        label="确认密码"
        placeholder="确认输入密码"
        type="password"
        v-model="reupass"
        class="myinput"
      ></mt-field>
      <!-- 短信验证码 -->
      <mt-field placeholder="验证码" v-model="getCode" class="myinput">
        <span class="getCode" v-show="show" @click="getCodeMethod">获取短信验证码</span>
        <span v-show="!show" class="count">{{count}}s后重新获取</span>
      </mt-field>
      <!-- 登录和切换登录方式块 -->
      <div>
        <mt-button size="large" class="mybutton" @click.native="register">注册</mt-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      reupass: '',//确认密码
      nickname: '',//昵称
      phonenumber: "",//手机号
      upass: "",//密码
      getCode: "",//验证码
      show: true,//显示获取验证码的文字，false时显示倒计时
      count: 0,
      timer2: null,
      timer: null //计时器,验证码
    };
  },

  beforeDestroy() {
    clearTimeout(this.timer2);
  },

  methods: {
    backto(){
      this.$router.back()
    },
    // 登录显示模态框 调用 mint-ui 的 messagebox
    register() {
      //1、验证手机号
      let isregist = false
      let _this = this
      if (!this.phonenumber) {
        this.$messagebox("", "请输入手机号");
        return false;
      }
      // 验证手机号
      let regphone = /^1[0-9]{10}$/
      if (this.phonenumber.trim() == '' || this.phonenumber.length <= 10 || !regphone.test(this.phonenumber)) {
        this.$messagebox("", "请输入正确的手机号");
        return false;
     }else{
        //验证手机号是否被注册过
        this.$axios.get('/user/phonenumber',{
          params: {phonenumber: this.phonenumber}
        }).then(({data})=>{
          if(data == true){
            this.$messagebox("", "该手机号被注册过了~");
            isregist = true
            return false;
          }
        }).catch(()=>{
          this.$messagebox("", "检查手机号~");
          return false;
        })

      }

      //等上面手机号验证完再执行下面的其他验证
      this.timer2 = setTimeout(()=>{
        //console.log("123456")
        if(!isregist){
          console.log("手机号没有被注册过")
          //没有被注册过了,就校验下面的信息
          this.otherinfo()
        }
      }, 200);

    },

    //校验其他信息
    otherinfo(){
      let _this = this
      //2、验证昵称
      if(!this.nickname){
        this.$messagebox("", "请输入昵称");
        return false;
      }
      if (this.nickname.trim() == '' || this.nickname.length > 8 || this.nickname.length < 2) {
        this.$messagebox("", "昵称的长度在2-8位");
        return false;
      }
      //3、验证密码
      if (!this.upass) {
        this.$messagebox("", "请输入密码");
        return false;
      }
      let regpass = /^[A-Za-z0-9]{6,18}$/;
      if (this.upass.trim() == '' || !regpass.test(this.upass)) {
        this.$messagebox("", "密码的长度在6-18位的数字或字母");
        return false;
      }
      //4、验证确认密码
      if(!this.reupass){
        this.$messagebox("", "请输入确认密码");
        return false;
      }
      if (this.reupass.trim() == '' || !regpass.test(this.reupass)) {
        this.$messagebox("", "确认密码的长度在6-18位的数字或字母");
        return false;
      }
      if (this.reupass != this.upass) {
        this.$messagebox("", "两次密码不一致");
        return false;
      }

      //5、验证码验证
      if(!this.getCode){
        this.$messagebox("", "请输入验证码");
        return false;
      }

      let regcode = /^[0-9]{6}$/
      if (!regcode.test(this.getCode)) {
        this.$messagebox("", "请输入6位数字的验证码");
        return false;
      }

      //注册该用户
      this.$axios.post('/user/registry',this.$qs.stringify({
        account: this.phonenumber,
        nickname: this.nickname,
        userPassword: this.upass,
        code: this.getCode,
        roleType: 1
      })
      ).then(({data})=>{
        if(data){
          this.$messagebox("", "注册成功");
          _this.$router.push('/logintest')
        }else{
          this.$messagebox("", "注册失败，请稍后再注册");
        }
      }).catch(()=>{
        this.$messagebox("", "服务器异常，请稍后再试！");
      })
    },

    getCodeMethod(){
      let _this = this
      //axios请求
      //console.log("发送手机验证码");
      console.log(this.phonenumber)
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
a {
  text-decoration: none;
}
/* 图片 logo 根样式 */
.imgDiv {
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
