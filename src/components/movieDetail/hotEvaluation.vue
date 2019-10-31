<template>
	<section id="hot-evaluation">
		<header class="h-e-header">
			<span>热门评价</span>
			<span>({{lists.total}}条)</span>
		</header>
		<ul>
			<li class="border-1px-bottom evl-item" v-for="item in lists.items">
				<figure class="he-u-icon fl">
					<img src="https://gw.alicdn.com/tps/i3/TB1yeWeIFXXXXX5XFXXuAZJYXXX-210-210.png_100x100.jpg" alt="">
				</figure>
				<section class="he-u-content">
					<div>
						<div class="ib">
							<span class="he-u-name">
								{{ item.nickname }}
							</span>
							<div class="full-star pr">
								<div class="score-start" :style="{width: `${item.score * 10}%`}"></div>
							</div>
						</div>
						<span class="fr he-u-time">{{dateFormat(item.commentTime)}}</span>
					</div>
					<article class="he-u-say">
						{{ item.commentWords }}
					</article>
				</section>
			</li>
		</ul>
    <div class="click-load-more" @click="clickLoadMore">
      <span v-show="lists.total > offset">点击查看更多</span>
      <!--<div v-show="clickLoadStatus === 'loading'" class="loading-icon">
        <span>加载中</span>
        <mt-spinner style="display: inline-block" type="fading-circle" color="rgb(100, 100, 100)" :size="19"></mt-spinner>
      </div>-->
      <span v-show="lists.total <= offset">没有更多了～</span>
    </div>

		<!--<p class="no-more">没有更多了～</p>-->
		<div style="height: 60px"></div>
	</section>
</template>
<script>
export default{
	data () {
		return {
      //clickLoadStatus: 'start',
      offset: 10,
      limit: 10,
      page: 2,
      total: 0,
      loaingLists: [],
		}
	},

  methods:{
    //时间格式化
    dateFormat(Time){
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
      this.loaingLists = this.lists.items;
      let id = this.$route.params.id
        setTimeout(() => {
          this.$axios.get('/comment/commentspage/'+id, {
            params: {
              pageNumber: this.page,

            }
          }).then(({data}) => {
            ++this.page;
            this.loaingLists = this.loaingLists.concat(data.items)
            this.lists.items = this.loaingLists
            this.total = data.total
            this.offset = this.offset + this.limit
            /*if (this.offset < this.total) {
              this.clickLoadStatus = 'start'
            } else {
              this.clickLoadStatus = 'complete'
            }*/
          })
        },100)
    },
  },

  /*watch:{
    lists(newv,oldv){
      this.loaingLists = this.lists
      if(this.offset >= this.lists.total){
        this.clickLoadStatus = 'complete'
      }
      console.log(this.loaingLists)
    }
  },*/

	props: {
		lists: {
			type: Object,
			default: () => ({})
		}
	},
	components: {
	}
}
</script>

<style>
#hot-evaluation {
	background-color: #fff;
	padding-left: 15px;
	box-sizing: border-box;
}
.h-e-header {
	padding: 12px 0;
} 
.h-e-header span:first-child {
	color: #000;
	font-size: 16px;
	font-weight: bold;
}
.h-e-header span:last-child {
	color: #666
}
.evl-item {
	padding-top: 10px;
}
.he-u-icon {
	width: 25px;
	height: 25px;
	border-radius: 100%;
	overflow: hidden;
}
.he-u-icon img {
	width: 100%;
	height: 100%;
}
.he-u-content {
	margin-left: 30px;
	padding-right: 10px;
	box-sizing: border-box;
}
#hot-evaluation .full-star,
.he-u-name {
	display: inline-block;
	vertical-align: middle;
}
#hot-evaluation .full-star {
	margin-top: -1px;
}
.he-u-name {
	max-width: 60px;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	font-size: 14px;
	color: #000;
	font-weight: bold;
}
.he-u-time {
	color: #666;
	font-size: 10px;
	margin-top: 4px;
}
.he-u-say {
	font-size: 12px;
	line-height: 20px;
	padding: 5px 0 15px;
}
.no-more {
	text-align: center;
	padding: 15px 0 10px;
	font-size: 14px;
	color: #666;
}
</style>

