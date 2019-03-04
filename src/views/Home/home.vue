<template>
  <div class="app">
    <!-- 搜索 -->
    <div class="search-box">
      <router-link
        to=""
        class="search"
      >
        <div class="search-img">
          <img src="../../assets/images/home_icon_search.png" />
        </div>
        <div class="search-text">
          搜索专辑、故事
        </div>
        <div class="search-rigth">
          <img src="../../assets/images/home_icon_shaixuan.png" />
        </div>
      </router-link>
    </div>
    <!-- tab -->
    <div class="index-tab">
      <p>
        <router-link to="">讲故事</router-link>
      </p>
      <p>
        <router-link to="">讲故事</router-link>
      </p>
      <p>
        <router-link to="">讲故事</router-link>
      </p>
      <p>
        <router-link to="">讲故事</router-link>
      </p>
    </div>
    <!-- 轮播 -->
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div
          class="swiper-slide"
          v-for="item in bannerData"
        ><img :src="item.path" /></div>
      </div>
      <!-- Add Pagination -->
      <div class="swiper-pagination"></div>
    </div>
    <!-- 精品推荐 -->
    <list
      :name="title[0].name"
      :title="title[0].title"
      :item="recommend"
      :num="title[0].num"
    ></list>
    <!-- 古诗 -->

  </div>
</template>
<script>
import Swiper from "../../../static/js/swiper.min.js";
import List from "@/components/list";
let swiper;
export default {
  data() {
    return {
      bannerData: [],
      recommend: [],
      title: [
        {
          name: "精品推荐",
          title: "最热门的内容都在这里",
          num: 6
        },
        {
          name: "精品推荐",
          title: "最热门的内容都在这里",
          num: 4
        },
        {
          name: "精品推荐",
          title: "最热门的内容都在这里",
          num: 4
        }
      ]
    };
  },
  created() {
    this.bannerList();
    this.getRecommendData();
  },
  methods: {
    // 轮播图
    bannerList() {
      var that = this;
      that.$axios.getBannerList().then(function(res) {
        that.bannerData = res.data.content.bannerList;
        setTimeout(() => {
          swiper = new Swiper(".swiper-container", {
            initialSlide: 0,
            slidesPerView: 1,
            spaceBetween: 20,
            autoplay: {
              delay: 8000,
              stopOnLastSlide: false,
              disableOnInteraction: false
            },
            loop: true,
            autoplayDisableOnInteraction: false,
            slidesPerView: "auto", //设置slider容器能够同时显示的slides数量(carousel模式)。可以设置为数字（可为小数，小数不可loop），或者 'auto'则自动根据slides的宽度来设定数量。loop模式下如果设置为'auto'还需要设置另外一个参数loopedSlides。
            centeredSlides: true,
            pagination: {
              el: ".swiper-pagination",
              clickable: true
            }
          });
        }, 10);
      });
    },
    //专辑列表
    getRecommendData() {
      var that = this;
      that.$axios.recommendSpecial().then(function(res) {
        that.recommend = res.data.content.list;
      });
      that.$axios.getSleepData().then(function(res) {
        that.sleepData = res.data.content.list;
      });
      that.$axios.getVideoData().then(function(res) {
        that.videoData = res.data.content.list;
      });
      that.$axios.getFMData().then(function(res) {
        that.fmData = res.data.content.radioInfoList;
      });
      that.$axios.getHabitData().then(function(res) {
        that.habitData = res.data.content.list;
      });
      that.$axios.getFavData().then(function(res) {
        that.favData = res.data.content.list;
      });
    }
  },
  components: {
    List
  }
};
</script>

<style lang='less' scoped>
@import url("../../assets/css/index.less");
@import url("../../assets/css/swiper.min.css");
</style>
