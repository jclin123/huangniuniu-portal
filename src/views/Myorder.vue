<template>
  <section>
    <mt-header fixed title="我的电影票" style="background-color:#FF2C43;height:50px"></mt-header>
    <div style="height: 50px"></div>
    <div class="ticketinfo" v-for="item in OrderMessage">
      <div class="ordertime">下单时间:{{dateFormat1(item.orderTime)}}</div>
      <div class="mypl">
        <div>
          <em class="start-time">{{dateFormat2(item.showDate)}}</em>
          <span class="start-time left-inline">{{item.movieName}}</span>
        </div>
        <div>
          <span class="mytext">{{item.cinemaName}}</span>
          <span class="mytext left-inline">{{item.roomName}}</span>
          <p class="mytext">座位号:{{item.seat}}号</p>
          <p class="mytext">订单号:{{item.id}}</p>
        </div>
      </div>
      <div class="mypr">
        <div class>
          <em class="totalprice">¥{{item.totalPrice}}</em>
          <div class="mytext">×{{item.orderNum}}张</div>
          <button class="mycomment" @click="toComment(item.skeduleid)">评价</button>
        </div>
      </div>
    </div>

    <div class="click-load-more">
      <span v-show="total > offset" @click="clickLoadMore">点击查看更多</span>
      <span v-show="total <= offset">没有更多了～</span>
    </div>

    <div style="height: 60px"></div>
  </section>
</template>
<script>
import cookie from 'vue-cookie'
  export default {
    data() {
      return {
        userid: null,
        //seatlist: [],//座位号
        //seat: '',
        loaingLists: [],
        offset: 0,
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        OrderMessage: []
      };
    },

    created(){
      let cookiename = cookie.get("Huangniuniu_USERTOKEN")
      let _this = this
      //console.log(cookiename)
      if(cookiename){
        //存在，验证cookie正确性和刷新时效
        this.$axios.get("/auth/verifyuser").then(({data})=>{
          _this.userid = data.id;
          //根据用户id查询订单信息
          _this.$axios.get("/order/selectOrderMessageByUserid/"+_this.userid,
            {params:{
                pageNumber: _this.pageNumber,
                pageSize: _this.pageSize,
                userid: _this.userid
              }}
          ).then((res)=>{
            //console.log(res)
            _this.OrderMessage = res.data.items
            _this.total = res.data.total
            ++_this.pageNumber
            _this.offset = _this.offset + _this.pageSize
          })

        }).catch(()=>{
          //跳转登录页
          _this.$router.push('/logintest')
        })
      }
    },

    methods : {
      //时间格式化，下单时间
      dateFormat1(Time){
        let date = new Date(Time)
        let year = date.getFullYear();
        let month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
        let day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
        let hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
        let minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
        let second =date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        // 拼接
        return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+second;
      },

      //时间格式化，排场时间
      dateFormat2(Time){
        let date = new Date(Time)
        //let year = date.getFullYear();
        let month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
        let day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
        let hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
        let minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
        //let second =date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        // 拼接
        return month+"-"+day+" "+hours+":"+minutes;
      },

      //点击加载更多
      clickLoadMore () {
        this.loaingLists = this.OrderMessage;
        let _this = this
        setTimeout(() => {
          this.$axios.get("/order/selectOrderMessageByUserid/"+_this.userid,
            {params:{
                pageNumber: _this.pageNumber,
                pageSize: _this.pageSize,
                userid: _this.userid
              }}
          ).then(({data}) => {
            ++_this.pageNumber;
            _this.loaingLists = _this.loaingLists.concat(data.items)
            _this.OrderMessage = _this.loaingLists
            _this.total = data.total
            _this.offset = _this.offset + _this.pageSize
          })
        },100)
      },

      toComment(skeduleid){
        //判断当前时间>排场时间，并且该用户没有评论过该排场，则可以评论
        this.$axios.get("/cinema/skedule/"+skeduleid).then(({data})=>{
          //获得排场时间
          let sktime = data.showDate
          let Date1 = new Date(sktime);
          let Date2 = new Date();//当前时间
          if(Date2 < Date1){
            this.$messagebox("", "请观看电影之后再评论");
          }
          else{
            this.$axios("/comment/getcomment/"+this.userid+"/"+skeduleid).then(({data})=>{
              if(data == false){
                this.$messagebox("", "该排场的电影已经评论过了");
              }else{
                //没有评论过该排场的电影
                this.$router.push('/comment/'+skeduleid)
              }
            }).catch(()=>{
              this.$messagebox("", "该排场的电影已经评论过了");
            })

          }
        })

      }
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
  height: 87px;
}
.mytext {
  font-size: 12px;
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
  margin-top: 8px;
  float:right;
  border:1px solid #fd2c32;
}
</style>
