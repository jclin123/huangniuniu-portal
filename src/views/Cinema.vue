<template>
	<section id="cinema">
		<city></city>
    <header class="home-header border-bottom">
      <div class="city fl" @click="showCityList">
        <span class="vm city-name f14">{{ $store.state.city.name }}</span>
        <span class="city-arrow-icon vm"></span>
      </div>
    </header>
		<!--<cinemaArea></cinemaArea>-->
		<cinema></cinema>
	</section>
</template>

<script>
import { mapMutations } from 'vuex'
import { cinema, cinemaArea, city } from '../components/'
export default{
	data () {
		return {
		}
	},
	components: {
		cinema,
		cinemaArea,
		city
	},
	methods: {
		...mapMutations([
		  'pushLoadStack',
		  'completeLoad',
		  'showCityList'
		]),

	}
}
</script>

<style>
  .city-arrow-icon {
    margin-left: 4px;
    width: 12px;
    height: 12px;
    display: inline-block;
  }

  .home-header {
    height: 40px;
    font-size: 0px;
    background-color: #fff;
  }
</style>

