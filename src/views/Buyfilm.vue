<template>
  <section>
    <mt-header fixed title="购买" style="background-color:#FF2C43;height:50px"></mt-header>
    <div style="height: 50px"></div>
    <div class="ticketinfo">
      <div class="ordertime">该场电影播放时间：{{dateFormat1(skedules.showDate)}}</div>
      <div class="mypl">
        <div>
          <em class="start-time">{{dateFormat2(skedules.showDate)}}</em>
          <span class="start-time ">{{skedules.movieName}}</span>
        </div>
        <div>
          <span class="mytext">{{runningTime}}分钟</span>
          <span class="mytext left-inline">{{skedules.roomName}}</span>
          <p class="mytextcinema">{{skedules.cinemaName}}</p>
          <p class="mytext">票数剩余:{{skedules.ticketsLeft}}</p>
        </div>
      </div>
      <div class="mypr">
        <div class>
          <em class="totalprice">¥{{countTotal}}</em>
          <div><span class="label-mod label-orange">单价:{{skedules.price}}</span></div>
          <div class="myspace"></div>
          <div class="mytext"><button class="selectNum" @click="removeOne()">-</button> ×{{num}}张 <button  class="selectNum" @click="addOne()">+</button></div>
          <!--<button class="mycomment">购买</button>-->
          <mt-button type="primary" class="mycomment" @click="buy()">购买</mt-button>
        </div>
      </div>
    </div>
    <p class="no-more"></p>
    <div style="height: 60px"></div>
  </section>
</template>
<script>
import { MessageBox } from "mint-ui";
import cookie from 'vue-cookie'
  export default {
    data(){
      return {
        ticketsLeft: 0,//剩余票数
        ticketsSold: 0,//卖出票数
        userid: null,
        nickname: '',
        runningTime: 0,//播放时长
        skedules: {},
        num:1,//购买票数
        price:0,//单价
        countTotal:0//总价
      }
    },
    methods : {
      //时间格式化，排场具体时间
      dateFormat1(Time){
        let date = new Date(Time)
        let year = date.getFullYear();
        let month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
        let day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
        let hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
        let minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
        let second =date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        // 拼接
        return year+"-"+month+"-"+day+" "+hours+":"+minutes;
      },

      //时间格式化，排场时间，时分
      dateFormat2(Time){
        let date = new Date(Time)
        //let year = date.getFullYear();
        let month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
        let day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
        let hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
        let minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
        //let second =date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        // 拼接
        return hours+":"+minutes;
      },

      handleClick(){
          this.$router.push('/buymyfilm');
      },
      addOne(){
        if(this.num == this.ticketsLeft){
          return;
        }else{
          this.num++
          this.countTotal=(this.num*(this.price*100))/100
          this.countTotal.toFixed(2)
        }

      },
      //购买
      buy(){
        //获得用户信息
        let cookiename = cookie.get("Huangniuniu_USERTOKEN")
        let _this = this
        let id = this.$route.params.id
        //console.log(cookiename)
        if(cookiename){
          //存在，验证cookie正确性和刷新时效
          this.$axios.get("/auth/verifyuser").then(({data})=>{
            MessageBox.confirm('', {
              message: '确认购买该电影票？',
              title: '提示',
              /*confirmButtonText: 'abc',
              cancelButtonText: '123'*/
            }).then(action => {
              if (action == 'confirm') {     //确认的回调
                _this.$axios.post("/order/insert",
                  this.$qs.stringify({
                    orderNum: this.num,
                    userid: this.userid,
                    skeduleid: id,
                    nickname: this.nickname
                  })
                ).then(()=>{
                  this.$messagebox("", "购买成功");
                  _this.$router.back()
                }).catch(()=>{
                  this.$messagebox("", "服务器异常，请稍后再购买");
                })
                //console.log("前往购买");
              }
            }).catch(err => {
              if (err == 'cancel') {     //取消的回调
                console.log("取消购买");
              }
            });
          }).catch(()=>{//没有登录，跳转登录页
            //跳转登录页
            _this.$router.push('/logintest')
          })
        }else{
          //跳转登录页
          _this.$router.push('/logintest')
        }

      },


      removeOne(){
        if(this.num>1)
        {
          this.num--
          this.countTotal=(this.num*(this.price*100))/100
          this.countTotal.toFixed(2)
        }
      }
    },
    computed:{
    },
    created(){
      //获得用户信息
      let cookiename = cookie.get("Huangniuniu_USERTOKEN")
      let _this = this
      //console.log(cookiename)
      if(cookiename){
        //存在，验证cookie正确性和刷新时效
        this.$axios.get("/auth/verifyuser").then(({data})=>{
          _this.userid = data.id
          _this.nickname = data.username
        }).catch(()=>{//没有登录，跳转登录页
          //跳转登录页
          _this.$router.push('/logintest')
        })
      }

      let id = this.$route.params.id
      //根据排场id获取排场信息
      this.$axios.get("/cinema/skedule/"+id).
        then(({data})=>{
          _this.skedules = data
          _this.price = data.price
          _this.countTotal = data.price
        //console.log(data)
        //根据电影id获得电影时长
        _this.$axios.get("/movie/"+_this.skedules.movieid).then((res)=>{
          _this.runningTime = res.data.runningTime
        })
      })


    }
  }
</script>
<style lang="">
.pr-r {
  display: inline-block;
  width: 50%;
  text-align: right;
}
.mypl {
  width: 68%;
  text-align: left;
  display: inline-block;
}
.mypr {
  width: 28%;
  text-align: right;
  display: inline-block;
}
.start-time {
  /*font-weight: bold;*/
    font-size: 15px;
}
.ticketinfo {
  padding: 15px 15px 12px 15px;
  border-bottom: 1px solid #ebebeb;
  height: 120px;
}
.mytext {
  font-size: 12px;
  color: #999;
}
.mytextcinema {
  font-size: 14px;
  color: #999;
}
.left-inline {
  margin-left: 10px;
}
.totalprice {
  color: #fd2c32;
  font-size: 18px;
}
.ordertime{
  font-size: 8px;
  color: #999;
  text-align:center
}
.mycomment {
  font-size: 13px;
  width: 62px;
  height: 32px;
}
.selectNum {
  padding: 0;
  display: inline-block;
  width: 16px;
  height: 16px;
  font-size: 16px;
  line-height: 10px;
  text-align: center;
  vertical-align: bottom
}
.myspace{
  width: 5px;
  height: 5px;
}
</style>
