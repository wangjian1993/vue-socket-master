<template>
  <div class="app">
    <div class="audio-info">
      <div class="info-img">
        <img src="" alt="">
      </div>
      <div class="info-text">
          <p></p>
          <p></p>
      </div>
      <div class="info-icon">
        <img src="" alt="">
        <img src="" alt="">
      </div>
    </div>
    <div
      class="audio-list"
      v-for="(item,index) in audioData"
    >
      <span>{{item.name}}</span>
      <button @click="demandAudio(item)">点播</button>
    </div>
  </div>
</template>

<script>
import Bus from "../../assets/js/bus.js";
export default {
  data() {
    return {
      audioData: []
    };
  },
  created() {
    var id = this.$route.query.id;
    this.getAudioData(id);
  },
  methods: {
    getAudioData(id) {
      var that = this;
      that.$axios.getSpecialInfo(id).then(function(res) {
        that.audioData = res.data.content.musicList;
      });
    },
    demandAudio(data) {
      console.log("点击");
      Bus.$emit("audioClic", data);
    }
  },
  components: {}
};
</script>

<style lang='less' scoped>
@import url('../../assets/css/audio.less');
</style>
