export default {
  updateAreaData (state, { area }) {
  	state.area = area
  },
  //保存子组件选择的电影id
  updateMovieid(state,movieid){
    state.movieid = movieid
  }
}
