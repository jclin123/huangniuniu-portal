<template>
	<div class="swiper-container" id="swiper">
    <div class="swiper-wrapper">
    	<div class="swiper-slide" v-for="item in imgs">
        <router-link :to="{ name: 'detail', params: { id: item.id }}">
				    <img class="img" :src="item.poster" style="height: 140px"/>
        </router-link>
		  </div>
    </div>
	<div class="swiper-pagination"></div>
</div>
</template>

<script>
import Swiper from '../../assets/js/swiper.min.js'
export default{
	name: 'swiper',
  data () {
	  return{
	  }
  },
  props: {
  	imgs: {
  		type: Array,
  		default: () => []
  	}
  },
  watch: {
  	imgs() {
  		this.$nextTick(() => {
		  	new Swiper ('.swiper-container', {
			    loop: true,
			    pagination: '.swiper-pagination',
			    paginationClickable: true,
			    autoplay : 2000,
				autoplayDisableOnInteraction : false,		    
			}) 
  		})
  	}
  }
}
</script>

<style>
	img {
		width: 100%;
		height: auto;
	}
	#swiper .swiper-pagination-bullet {
		background: #e5e8e8;
		opacity: 1; 
	}
	#swiper .swiper-pagination-bullet-active {
		background: #ff5733;
	}
</style>
