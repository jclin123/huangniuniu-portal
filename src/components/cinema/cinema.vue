<template>
	<section class="cinema-box" style="margin-top: 5px; background: #fff">
		<ul class="cm-item">
			<li v-for="item in cinemaList">
				<router-link :to="{ name: 'cdetail', params: { id: item.id }}">
					<div class="cm-name">
						<span class="tddd vm">{{ item.cinemaName }}</span>
						<span class="k-mode vm">IMAX厅</span>
					</div>
					<p class="cm-address tddd">{{ item.cinemaAddress }}</p>
					<div class="cm-welfare">
						<span class="label-mod label-border-blue">座</span>
						<span class="label-mod label-orange">新人专享</span>
					</div>
				</router-link>	
			</li>
      <div class="click-load-more" @click="clickLoadMore">
        <span v-show="clickLoadStatus === 'start'">点击查看更多</span>
        <div v-show="clickLoadStatus === 'loading'" class="loading-icon">
          <span>加载中</span>
          <mt-spinner style="display: inline-block" type="fading-circle" color="rgb(100, 100, 100)" :size="19"></mt-spinner>
        </div>
        <span v-show="clickLoadStatus === 'complete'">已经全部显示</span>
      </div>
		</ul>
		<div style="height: 60px; background: #f5f5f5"></div>
	</section>
</template>

<script>
  import { mapMutations } from 'vuex'
  export default {
    data() {
      return {
        cinemaList: [],
        offset: 0,
        limit: 10,
        pageNumber: 1,
        total: 0,
        loaingLists: [],
        clickLoadStatus: 'complete'
      }
    },

    created() {
      this.pushLoadStack()
      let id = this.$store.state.city.id
      //查询该城市的电影院
      this.$axios.get('/cinema/pagelist', {
        params: {cityid: id}
      }).then(({data}) => {
        ++this.pageNumber;
        this.loaingLists = this.loaingLists.concat(data.items)
        this.cinemaList = this.loaingLists
        this.total = data.total
        this.offset = this.offset + this.limit
        if (this.offset < this.total) {
          this.clickLoadStatus = 'start'
        } else {
          this.clickLoadStatus = 'complete'
        }

      }).finally(() => {
        this.completeLoad()
      })
    },

    computed: {
      cityName () {
        return this.$store.state.city.name;
      }
    },

    //监听城市名称是否变化，变化则查询该城市的电影院
    watch: {
      cityName(newName, oldName) {
        //清空数据
        this.pageNumber = 1
        this.loaingLists = []
        this.cinemaList = []
        this.total = 0
        this.offset = 0
        this.pushLoadStack()
        let id = this.$store.state.city.id
        //查询该城市的电影院
        this.$axios.get('/cinema/pagelist', {
          params: {cityid: id}
        }).then(({data}) => {
          ++this.pageNumber;
          this.loaingLists = this.loaingLists.concat(data.items)
          this.cinemaList = this.loaingLists
          this.total = data.total
          this.offset = this.offset + this.limit
          if (this.offset < this.total) {
            this.clickLoadStatus = 'start'
          } else {
            this.clickLoadStatus = 'complete'
          }

        }).finally(() => {
          this.completeLoad()
        })
      }
    },

    methods: {
      ...mapMutations([
        'pushLoadStack',
        'completeLoad',
        'showCityList'
      ]),

      clickLoadMore() {
        if (this.clickLoadStatus != 'complete') {
          this.clickLoadStatus = 'loading'
          setTimeout(() => {

            let cid = this.$store.state.city.id;
            //查询该城市的电影院
            this.$axios.get('/cinema/pagelist', {
              params: {
                cityid: cid,
                pageNumber: this.pageNumber
              }
            }).then(({data}) => {
              ++this.pageNumber;
              this.loaingLists = this.loaingLists.concat(data.items)
              this.cinemaList = this.loaingLists
              this.total = data.total
              this.offset = this.offset + this.limit
              if (this.offset < this.total) {
                this.clickLoadStatus = 'start'
              } else {
                this.clickLoadStatus = 'complete'
              }
            }).finally(() => {
              this.completeLoad();//加载效果去除
            })
          }, 500)
        }
      },
    }

  }
</script>


<style scoped>
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
