<template>
	<section class="play-date">

    <section>
      <div class="line">
        <span class="ll le vm"></span>
        <i class="ic md vm"></i>
        <em class="lef" v-if="dataNum.length>0">今日场次</em>
        <em class="lef" v-if="dataNum.length==0">今日停止售票</em>
        <span class="lr le vm"></span>
      </div>
      <ul class="pdate">
        <li v-for="item in dataNum">
          <div class="pd pd-l fl">
            <div>
              <em class="fb">{{dateFormat(item.showDate)}}</em>
              <span class="fo f1">中文字幕 3D</span>
            </div>
            <div>
              <!--<span class="fo f2">{{dateFormat2(item.showDate)}} 散场</span>-->
              <span class="fo f3">{{item.roomName}}</span>
            </div>
          </div>
          <div class="pd pd-r fr pr">
            <div class="pr-l">
              <em class="fb prf">¥{{item.price}}</em>
              <span class="fo f4">¥50</span>
              <span class="label-mod label-orange">新人专享</span>
            </div>
            <button class="buy-btn f12 pa" @click="buy(item.id)">购买</button>
          </div>
        </li>
      </ul>

    </section>

		<div style="height: 60px;"></div>
	</section>
</template>

<script>
export default{

  methods:{
    //购买,跳转购买页面
    buy(id){
      this.$router.push({path:'/buymyfilm/' + id});
    },

    //时间格式化:开场时间
    dateFormat(Time){
      let time = new Date(Time)
      return `${time.getHours() >= 10 ? time.getHours() : '0' + time.getHours()} : ${time.getMinutes()>=10?time.getMinutes():'0'+time.getMinutes()}`;
    }

  },
	/*props: {
		dataNum: {
			type: Number,
			default: 0
		}
	}*/
  props: {
    dataNum: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style>
.play-date {
	background-color: #fff;
	padding-bottom: 10px;
}
.line {
	text-align: center;
	margin-top: 10px;
}
.lef {
	color: #999;
	font-weight: 400;
	font-size: 10px;
	margin-right: 1.5%;
}
.le {
	display: inline-block;
	width: 35%;
	border-bottom: 1px dashed #d7d7d7;
}
.ic {
	display: inline-block;
	width: 16px;
	height: 16px;
	border-radius: 100%;
	background-size: 90%;
	background-position: center center;
	background-repeat: no-repeat;
	margin-left: 1.5%;
}
.md {
	background-image: url('../../assets/images/md.svg');
	background-color: #b8dcf6;
}
.nd {
	background-image: url('../../assets/images/nd.svg');
	background-color: #faccaa;
}
.ad {
	background-image: url('../../assets/images/ad.svg');
	background-color: #cac1f8;
}
.pd, 
.pr-l {
	display: inline-block;
	width: 45%;
}
.pd div:nth-of-type(2) {
	margin-top: 2px;
}
.pdate li {
	height: 65px;
	padding: 15px 10px 10px 15px;
	border-bottom: 1px solid #ebebeb;
}
.pdate li:last-child {
	border-bottom: 0px;
}
.pdate em {
	font-size: 18px;
}
.pdate .buy-btn {
	left: 59%;
	bottom: 21px;
}
.fo {
	font-size: 12px;
	color: #999;
}
.f1 {
	margin-left: 22px;
}
.f3 {
	margin-left: 10px;
}
.f4 {
	display: block;
	text-decoration: line-through;
	margin: 2px 0;
}
.pr-l {
	text-align: right;
}
.prf {
	color: #fd2c32;
}
</style>

