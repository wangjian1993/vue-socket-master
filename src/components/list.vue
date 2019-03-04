<template>
  <div class="app">
    <div class="title">
      <p class="main-name">{{name}}</p>
      <p class="sub-name">{{title}}</p>
    </div>
    <div class="content">
      <div
        class="content-list"
        v-for="(item,index) in item"
        v-if='index < num'
        @click="goAudio(item.id)"
      >
        <img
          v-lazy="item.picurl == undefined? item.pic:item.picurl "
          alt=""
        >
        <span>{{item.name}}</span>
        <p>{{item.description}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    name: "",
    num: "",
    item: "",
    title: ""
  },
  methods: {
    goAudio(id) {
      this.$router.push({
        path: "/audio",
        query: {
          id: id
        }
      });
    }
  },
  components: {}
};
</script>
<style lang='less' scoped>
.app {
  margin: 0.813rem 0;
  .title {
    width: 90%;
    margin: 0 auto;
    .main-name {
      font-size: 0.507rem;
      color: #222222;
      font-weight: 700;
    }
    .sub-name {
      font-size: 0.32rem;
      color: #666666;
    }
  }
  .content {
    width: 95%;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    .content-list {
      width: 50%;
      img {
        width: 4.267rem;
        height: 4.267rem;
        display: block;
        margin: 0.32rem auto;
        border-radius: 0.133rem;
      }
      span {
        display: block;
        width: 4.267rem;
        margin: 0rem auto;
        font-size: 0.4rem;
        color: #222222;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      p {
        width: 4.267rem;
        margin: 0rem auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.347rem;
        color: #aaaaaa;
      }
    }
  }
}
</style>
