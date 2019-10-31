<template>
    <section>
        <mt-header fixed title="消息通知" style="background-color:#FF2C43;height:50px"></mt-header>
        <div class="page-header-main">
         <div style="height: 50px"></div>   
        <ul class="cm-item">
			<li v-for="item in OrderMessage">
				<p>
          {{dateFormat1(item.orderTime)}}
        </p>
        <p>
          &emsp;&emsp;您已成功购买{{dateFormat2(item.showDate)}}的电影票，请及时到{{item.cinemaName}}观看！
          更多影票信息请查看我的电影票。
        </p>
			</li>

		</ul>
      <div class="click-load-more">
           <span v-show="total > offset" @click="clickLoadMore">点击查看更多</span>
           <span v-show="total <= offset">没有更多了～</span>
      </div>

		<div style="height: 60px"></div>
        </div>
    </section>
</template>

<script>
import cookie from 'vue-cookie'
  export default {
    data() {
      return {
        userid: null,
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
        return month+"月"+day+"日"+hours+"时"+minutes+"分";
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

    }
  }
</script>

<style>
.cm-item {
	padding-left: 15px;
	box-sizing: border-box;
}
.cm-item li {
	padding: 15px 15px 12px 0px;
	border-bottom: 1px solid #ebebeb;
}
.cm-item li:last-child {
	border-bottom: 0px;
}
.cm-name {
	font-weight: 400;
	color: #424242;
	font-size: 16px;
}
.cm-name span:first-child {
	max-width: 83%;
}
.cm-address {
	color: gray;
	font-size: 10px;
}
.cm-welfare {
	font-size: 10px;
	color: gray;
}
.cm-address, .cm-welfare {
	margin-top: 10px;
}
.label-mod.label-border-blue {
	border: 1px solid #00b8f0;
	color: #00b8f0;
}
.label-mod.label-orange {
	background: #ff8625;
    border-color: #ff8625;
    color: #fff;
}
.label-mod {
	display: inline-block;
	margin: 0 1px;
	padding: 0 1px;
	line-height: 14px;
	min-width: 12px;
	font-size: 12px;
	text-align: center;
	border-radius: 2px;
	font-weight: 400;
	border: 1px solid transparent;
}
.k-mode {
	display: inline-block;
	border: 1px solid #adb6ca;
	color: #adb6ca;
	overflow: hidden;
	border-radius: 2px;
	font-size: 12px;
}
</style>
