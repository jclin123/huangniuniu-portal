<template>
  <section style="height: 100%">
    <city></city>
    <header class="home-header border-bottom">
      <div class="city fl" @click="showCityList">
        <span class="vm city-name f14">{{ $store.state.city.name }}</span>
        <span class="city-arrow-icon vm"></span>
      </div>
      <div class="sel-lists f14 fl pr" @click="moveTab">
        <div hot='sel' :class="{selnav: selnav}">正在热映</div>
        <div :class="{selnav: !selnav}">即将上映</div>
        <span class="move pa" :style="{left: moveDistance}"></span>
      </div>
    </header>
    <section  v-show="selnav"  class="content">
      <swiper :imgs="imgs"></swiper>
      <hot :hotLists="hotLists"></hot>
    </section>
    <section  v-show="!selnav"  class="content">
      <coming :comingLists="comingLists" ></coming>
      <div class="click-load-more" @click="clickLoadMore">
        <span v-show="clickLoadStatus === 'start'">点击查看更多</span>
        <div v-show="clickLoadStatus === 'loading'" class="loading-icon">
          <span>加载中</span>
          <mt-spinner style="display: inline-block" type="fading-circle" color="rgb(100, 100, 100)" :size="19"></mt-spinner>
        </div>
        <span v-show="clickLoadStatus === 'complete'">已经全部显示</span>
      </div>
    </section>
    <play-video></play-video>
  </section>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { swiper, hot, city, coming, playVideo} from '../components/'

export default{
  data () {
    return {
      moveDistance: '5%',
      imgs: [], //正在热映的轮播图
      comingLists: [],
      loaingLists: [],
      selnav: true,
      clickLoadStatus: 'start',
      offset: 0,
      limit: 10,
      page: 1,
      total: 0,
      hotLists: [] //正在热映
    }
  },
  components: {
    swiper,
    hot,
    city,
    coming,
    playVideo
  },
  /*computed: mapGetters([
    'hotLists'
  ]),*/
  methods: {
    ...mapMutations([
      'pushLoadStack',
      'completeLoad',
      'showCityList',
      'pushComingList'
    ]),
    moveTab (event) {
      event.target.getAttribute('hot') ? this.selectHotTab() : this.slectComingTab()
    },
    selectHotTab () {
      this.selnav = true
      this.moveDistance = '5%'
      this.pushComingList({lists: []})
    },
    slectComingTab () {
      this.selnav = false
      this.moveDistance = '55%'
      this.pushComingList({lists: this.loaingLists})
    },
    getWeekDay (num) {
      let weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      return weeks[num]
    },
    clickLoadMore () {
      if (this.clickLoadStatus != 'complete') {
        this.clickLoadStatus = 'loading'
        setTimeout(() => {

          let cid = this.$store.state.city.id;
          this.$axios.get('/movie/getMovieByCityid', {
            params: {
              page: this.page,
              cid: cid,
              ishot: false

            }
          }).then(({data}) => {
            ++this.page;
            this.loaingLists = this.loaingLists.concat(data.items)
            this.comingLists = this.sortComingData(this.loaingLists)
            this.total = data.total
            this.offset = this.offset + this.limit
            this.completeLoad();//加载效果去除
            if (this.offset < this.total) {
              this.clickLoadStatus = 'start'
            } else {
              this.clickLoadStatus = 'complete'
            }
          })
        },500)
      }
    },
    /*requestData (url, fn) {
      this.pushLoadStack()
      this.$http.get(url).then(fn).then(this.completeLoad)
    },*/
    sortComingData (lists) {
      let comingLists = []
      lists.forEach((item) => {
        let hasItem = false
        for (let i = 0; i < comingLists.length; i++) {
          if (item.releaseTime === comingLists[i].releaseTime) {
            comingLists[i].movies.push(item)
            hasItem = true 
            break
          }
        }
        if (!hasItem) {
          let comingItem = {
            releaseTime: '',
            day: '',
            movies: []
          }
          comingItem.releaseTime = item.releaseTime
          comingItem.day = this.getWeekDay(new Date(item.releaseTime).getDay())
          comingItem.movies.push(item)
          comingLists.push(comingItem)
        }
      })
      return comingLists
    }
  },

  computed: {
    cityName () {
      return this.$store.state.city.name;
    }
  },

  //监听城市名称是否变化，变化则查询该城市的电影
  watch:{
    cityName(newName,oldName){
      //console.log(newName+":"+oldName)
      //刷新该城市的电影
      let cid = this.$store.state.city.id;
      //初始化参数
      this.pushComingList({lists: []}) //初始化即将上映为空
      this.page = 1;
      this.offset = 0;
      this.clickLoadStatus = 'start'
      this.comingLists = []
      this.loaingLists = []
      this.total = 0

      //轮播图
      this.$axios.get('/movie/getHotMovie',{
        params:{
          cid: cid,
        }
      }).then(({data})=>{
        this.imgs = data;
      })

      //正在热映
      this.pushLoadStack();//加载效果
      //查询正在热映的电影，赋值给hotLists
      this.$axios.get('/movie/getMovieByCityidNoPage',{
        params:{
          cid: cid,
          ishot: true
        }
      }).then(({data})=>{
        //console.log(data)
        this.hotLists = data;
        this.completeLoad();//加载效果去除
      }).finally(()=>{
        this.completeLoad();//加载效果去除
      })

      //即将上映电影
      this.$axios.get('/movie/getMovieByCityid',{
        params:{
          cid: cid,
          ishot: false
        }
      }).then(({data})=>{
        //console.log(data)
        this.loaingLists = data.items
        this.total = data.total
        this.comingLists = this.sortComingData(data.items)  //即将上映
        //判断是否全部加载完,加载完成
        if(this.total < this.limit){
          this.clickLoadStatus = 'complete';
        }
        this.offset = this.offset + this.limit
        ++this.page;
      }).catch(reason => {
        console.log("没有即将的上映电影")
        this.clickLoadStatus = 'complete';
      })
    }
  },

  created () {
    this.pushComingList({lists: []}) //初始化即将上映为空

    let cid = this.$store.state.city.id;
    //轮播图
    /*this.requestData('/movie/swiper', (response) => {
      let data = response.data
      this.imgs = data.data.data.returnValue
      //console.log("swiper="+JSON.stringify(data))
    })*/
    this.$axios.get('/movie/getHotMovie',{
      params:{
        cid: cid,
      }
    }).then(({data})=>{
      console.log(data)
      this.imgs = data;
    })

    this.pushLoadStack();//加载效果
    //查询正在热映的电影，赋值给hotLists
    this.$axios.get('/movie/getMovieByCityidNoPage',{
      params:{
          cid: cid,
          ishot: true
      }
    }).then(({data})=>{
      //console.log(data)
      this.hotLists = data;
      this.completeLoad();//加载效果去除
    }).finally(()=>{
      this.completeLoad();//加载效果去除
    })



    //正在即将上映查询
   /* this.requestData(`/movie/coming/?limit=${this.limit}&offset=${this.offset}`, (response) => {
      let data = response.data
      let lists = data.data.data.returnValue
      //模拟索引数据的id号
      lists.forEach((item, index) => {
        item.mID = index  
      })

      this.loaingLists = lists
      this.total = data.total
      this.comingLists = this.sortComingData(lists)  //即将上映
      this.offset = this.offset + this.limit
    })*/
    //this.pushLoadStack();//加载效果
    this.$axios.get('/movie/getMovieByCityid',{
      params:{
        cid: cid,
        ishot: false
      }
    }).then(({data})=>{
      //console.log(data)
      this.loaingLists = data.items
      this.total = data.total
      this.comingLists = this.sortComingData(data.items)  //即将上映
      //判断是否全部加载完,加载完成
      if(this.total < this.limit){
        this.clickLoadStatus = 'complete';
      }
      this.offset = this.offset + this.limit
      ++this.page;
      this.completeLoad();//加载效果去除
    }).catch(reason => {
      console.log("没有即将的上映电影")
      //this.completeLoad();//加载效果去除
      this.clickLoadStatus = 'complete';
    }).finally(()=>{
      this.completeLoad();//加载效果去除
    })

  }
}
</script>

<style>
.home-header {
  height: 40px;
  font-size: 0px;
  background-color: #fff;
}
.selnav {
  color: #ff4d64;
}
.city {
  width: 35%;
  height: 100%;
  line-height: 40px;
  text-align: center;
  display: inline-block;
}
.city-arrow-icon {
  margin-left: 4px;
  width: 12px;
  height: 12px;
  display: inline-block;
}
.city-arrow-icon:after {
  content: "";
  display: block;
  width: 6px;
  height: 6px;
  margin-left: 0;
  border: 1px solid #50505a;
  border-top: 0 none;
  border-left: 0 none;
  margin-left: 2px;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}
.content {
  margin-bottom: 58px;
}
.sel-lists {
  width: 65%;
  display:-moz-box; 
  display: -webkit-box;
  display: box;
}
.sel-lists div {
  -moz-box-flex: 1.0; 
  -webkit-box-flex: 1.0; 
  line-height: 40px;
  text-align: center;
}
.move {
  display: inline-block;
  bottom: 0px;
  width: 40%;
  border-bottom: 3px solid #ff4d64;
  -webkit-transition: left 0.7s ease-in-out;
  transition: left 0.7s ease-in-out;
}
.click-load-more {
  height: 42px;
  line-height: 42px;
  text-align: center;
  color: #333;
  font-size: 15px;
  background-color: #fff;
  margin: 5px 0 8px;
}
.loading-icon span {
  vertical-align: middle;
}
</style>
