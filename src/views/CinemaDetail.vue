<template>
	<section id="cm-detail">
		<header class="cm-d-header">
			<div>
				<p class="tddd fb f16">{{ cinemaData.cinemaName }}</p>
				<p class="tddd f13 c6">{{ cinemaData.cinemaAddress }}</p>
			</div>
		</header>
		<section class="cm-welfare cm-d-welfare">
			<span class="label-mod label-orange">新人专享</span>
			<span class="label-mod">新人特惠，名额有限抢完即止</span>
		</section>
		<section class="film-info">
			<film :lists="filmLists"></film>
			<div class="sel-film">
				<p class="fb">{{ selFilm.movieName }}</p>
				<div class="full-star pr cm-star">
					<div class="score-start" :style="{width: `${selFilm.score*10}%`}"></div>
					<span class="score pa">{{ selFilm.score }}</span>
				</div>
			</div>
			<div class="sel-date pr">
				<!--<ul @click="selectDateTab">
					<li :data-num="item.num" v-for="item in palyDate">
						<span :data-num="item.num">{{ item.date}}</span>
						<span :data-num="item.num" class="font-icon">惠</span>
					</li>
				</ul>-->
        <ul @click="selectDateTab">
          <li :data-num="item.num" :data-date="item.date" v-for="item in playtime">
            <span :data-num="item.num" :data-date="item.date">{{ dateFormat(item.date)}}</span>
            <span :data-num="item.num" class="font-icon">惠</span>
          </li>
        </ul>
				<span class="move pa" :style="{left: `${105*selDateNum}px`}"></span>
			</div>
			<div class="tips">温馨提示:开场前5分钟关闭在线售票</div>
		</section>
		<playDate :dataNum="skedules"></playDate>
	</section>
</template>

<script>
import { mapMutations } from 'vuex'
import { film, playDate} from '../components/'
export default{
	data () {
		return {
		  selectMovie: 0,
		  skedules: [],
			filmLists: [],
			itemId: 0,
			selDateNum: 0,
			cinemaData: {},
			selFilm: {},
      palyDate: [],
      playtime: []
			/*palyDate: [
				{date: '今天 12-15', num: 0},
				{date: '明天 12-16', num: 1},
				{date: '后天 12-17', num: 2},
				{date: '周五 12-18', num: 3}
			]*/
		}
	},
	components: {
		film,
		playDate
	},

	methods: {
		...mapMutations([
		  'pushLoadStack',
		  'completeLoad',
		  'showCityList',
		  'updateAreaData',
      'updateMovieid'
		]),
		requestData (url, fn) {
		  this.pushLoadStack()
		  this.$http.get(url).then(fn).then(this.completeLoad)
		},
		getDataById (array, id) {
			for (let i = 0; i < array.length; i++) {
				if (array[i].id == id) {
					return array[i]
				}
			}
			return false
		},
		selectDateTab (event) {
		  //console.log(event)
      this.skedules = []
      let id = this.$route.params.id
			let num = event.target.getAttribute('data-num')
			this.selDateNum = num
      let date = event.target.getAttribute('data-date')
      //根据电影院id、电影id、选择的时间查询排场
      if (date) {
        this.$axios.get('/cinema/skedule/skeduleList/' + id + '/' + this.$store.state.cinema.movieid, {
          params: {skeduletime: date}

        }).then((resp) => {
          //console.log(resp)
          this.skedules = resp.data
        }).catch(() => {
          console.log("今天没有排场")
        })
      }
		},

    //时间格式化
    dateFormat(Time){
		  let time = new Date(Time)
      return `${time.getMonth() + 1 >= 10 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)}-${time.getDate() >= 10 ? time.getDate() : '0' + time.getDate()}`;
    },
	},

  computed: {
    movieid () {
      return this.$store.state.cinema.movieid;
    }
  },

  watch:{
    itemId () {
      this.selFilm = this.getDataById(this.filmLists, this.itemId)
    },

	  movieid(newv,oldv){
	    //查询该电影存入 this.selFilm
	    this.$axios('/movie/'+newv).then(({data})=>{
        this.selFilm = data
      })

	    //console.log(newv+":"+oldv)
      //console.log(this.$store.state.cinema.movieid)
      //清空时间安排和排场
      this.playtime = []
      this.skedules = []
	    //电影重新选择时
      let id = this.$route.params.id
      //获得选择的电影的时间列表
      this.$axios.get('/cinema/skedule/skeduleTimeList/'+id+'/'+newv).then((res)=>{
        for (let i=0; i<res.data.length;i++){
          this.playtime.push({'date':res.data[i],'num':i})
        }

        //获得第一个时间的排场信息
        this.$axios.get('/cinema/skedule/skeduleList/'+id+'/'+newv,{
          params: {skeduletime: this.playtime[0].date}
        }).then((resp)=> {
          //console.log(resp)
          this.skedules = resp.data
        }).catch(()=>{
          console.log("今天没有排场")
        })
      })
    }
  },

	created () {

		/*this.requestData('/movie/cinema_detail', (response) => {
			let data = response.data
			this.filmLists = data.data.data.returnValue.shows
			this.selFilm = this.filmLists[0]
		})
		this.cinemaData = this.getDataById(this.$store.state.cinema.area, this.$route.params.id)
		if (!this.cinemaData) {
			this.$router.push('/')
		}*/
    let id = this.$route.params.id
    //查询该电影院信息
		this.$axios.get('/cinema/id/'+id).then(({data})=>{
		  this.cinemaData = data
    })
    //查询该电影院的电影信息
    this.$axios.get('/cinema/movieList/'+id).then(({data})=>{
      this.filmLists = data
      this.selFilm = this.filmLists[0]
      //this.selectMovie = this.filmLists[0].id //存储选择电影的id
      //console.log(data)
      //获得第一个电影的时间列表
      this.$axios.get('/cinema/skedule/skeduleTimeList/'+id+'/'+this.filmLists[0].id).then((res)=>{
        //console.log(data)
        //将第一个电影id存入
        this.$store.commit('updateMovieid',this.filmLists[0].id);
        for (let i=0; i<res.data.length;i++){
          this.playtime.push({'date':res.data[i],'num':i})
        }

        //获得第一个时间的排场信息
        this.$axios.get('/cinema/skedule/skeduleList/'+id+'/'+this.filmLists[0].id,{
          params: {skeduletime: this.playtime[0].date}
        }).then((resp)=> {
         // console.log(resp)
          this.skedules = resp.data
        }).catch(()=>{
          console.log("今天没有排场")
        })
      })
    })

	}
}
</script>

<style>
#cm-detail {
	background: #fff;
	height: 100%;
}
.cm-d-header {
	padding: 13px 0 0 15px;
	box-sizing: border-box;
}
.cm-d-header>div {
	padding: 0 15px 13px 0;
	border-bottom: 1px solid #ebebeb;
}
.cm-d-header p:last-child {
	margin-top: 6px;
	color: #666;
}
.cm-d-welfare {
	padding: 0 15px 15px;
	margin-top: 15px;
}
.cm-d-welfare::after {
	content: '>';
	float: right;
	font-size: 16px;
	color: #999;
	font-weight: 100;
	transform: scaleY(1.3);
	line-height: 15px;
}
.film-info {
	background-color: #4685a4;
}
.sel-film {
	text-align: center;
	background-color: #fff;
	padding: 5px 0;
	border-bottom: 1px solid #ebebeb;
}
.sel-film p {
	font-size: 16px;
}
.cm-star {
	display: inline-block;
	margin: 3px 0 0 -29px;
	height: 15px;
	width: 73px;
}
.cm-star .score {
	right: -24px;
	font-size: 13px;
	top: 1px;
}
.sel-date {
	width: 100%;
	overflow: hidden;
	overflow-x: scroll;
}
.sel-date ul {
	width: 480px;
}
.sel-date li {
	float: left;
	width: 100px;
	height: 40px;
	line-height: 40px;
	background-color: #fff;
	font-size: 13px;
	color: #555;
	padding-left: 5px;
}
.font-icon {
	color: #fff;
	height: 20px;
	border-radius: 3px;
	background-color: #ff9201;
	margin-left: 5px;
}
.sel-date .move {
	width: 105px;
	transition: left .3s ease-in-out;
}
.tips {
	padding: 5px 15px;
	font-size: 12px;
	color: #ffa101;
    text-align: left;
    background-color: #fbf9e4;
    border-top: 1px solid #fbeccd;
    border-bottom: 1px solid #fbeccd;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
	height: 0;
	background-color: transparent;
}
</style>

