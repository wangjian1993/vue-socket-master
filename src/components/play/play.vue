<template>
  <div class="playBox">
    <div class="play-img">
      <img
        src="../../assets/images/J6J6.png"
        alt=""
      >
    </div>
    <div class="play-text">
      <marquee
        class="songstitle"
        direction="left"
        behavior="scroll"
        scrollamount="2"
        scrolldelay="0"
        loop="-1"
        width="100%"
        height="100%"
      >{{songsList.song || "故事机离线"}}</marquee>
    </div>
    <div class="play-btn">
      <span @click="deviceClick(5)"><img
          src="../../assets/images/icon_device_pre.png"
          alt=""
        ></span>
      <span @click="devicePlay(songsList.status)">
        <img
          v-if="songsList.status == 'playing'"
          src="../../assets/images/icon_device_play.png"
          alt=""
        >
        <img
          v-else-if="songsList.status == 'pause'"
          src="../../assets/images/icon_device_pause.png"
          alt=""
        >
        <img
          v-else="songsList.status == ''"
          src="../../assets/images/icon_device_pause.png"
          alt=""
        >
      </span>
      <span @click="deviceClick(4)"><img
          src="../../assets/images/icon_device_next.png"
          alt=""
        ></span>
      <span @click="deviceLoop(songsList.playmode)">
        <img
          v-if="songsList.playmode == 0"
          src="../../assets/images/icon_device_one.png"
          alt=""
        >
        <img
          v-else-if="songsList.playmode == 1"
          src="../../assets/images/icon_device_loop.png"
          alt=""
        >
        <img
          v-else="songsList.playmode == ''"
          src="../../assets/images/icon_device_loop.png"
          alt=""
        >
      </span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import Bus from "../../assets/js/bus.js";
export default {
  data() {
    return {
      openID: "oeVNPv7AsCtwLCfjdHH7ch9u9TXA",
      deviceID: "HD0000011",
      wsuri: "",
      websock: null, //建立的连接
      lockReconnect: false, //是否真正建立连接
      timeout: 10 * 1000, //30秒一次心跳
      timeoutObj: null, //心跳心跳倒计时
      serverTimeoutObj: null, //心跳倒计时
      timeoutnum: null, //断开 重连倒计时
      lastRunTime: Date.now(), //上次播放声音的时间
      configsType: null,
      dataOnmessage: "",
      deviceFlag: false //设备是否在线
    };
  },
  computed: {
    ...mapState({
      songsList: state => state.songsList
    })
  },
  created() {
    //页面刚进入时开启长连接
    // this.websocketLogin();
    Bus.$on("audioClic", data => {
      this.setAudio(data);
    });
  },
  destroyed: function() {
    //页面销毁时关闭长连接
    this.websocketclose();
  },
  methods: {
    // 登录
    websocketLogin() {
      var that = this;
      that.$axios.websockLogin(that.openID, that.deviceID).then(function(res) {
        that.uid = res.data.uid;
        that.did = res.data.did || 0;
        that.wsuri = res.data.ws_path;
        that.initWebSocket();
        if (res.data.online) {
          // that.playText = "歌曲正在路上";
          that.deviceFlag = true;
        } else {
          // that.playText = "故事机离线中";
          that.deviceFlag = false;
        }
      });
    },
    initWebSocket() {
      //建立连接
      var that = this;
      //建立连接
      that.websock = new WebSocket(that.wsuri);
      //连接成功
      that.websock.onopen = that.websocketonopen;
      //连接错误
      that.websock.onerror = that.websocketonerror;
      //接收信息
      that.websock.onmessage = that.websocketonmessage;
      //连接关闭
      that.websock.onclose = that.websocketclose;
    },
    reconnect() {
      //重新连接
      var that = this;
      if (that.lockReconnect) {
        return;
      }
      that.lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      that.timeoutnum && clearTimeout(that.timeoutnum);
      that.timeoutnum = setTimeout(function() {
        //新连接
        that.initWebSocket();
        that.lockReconnect = false;
      }, 5000);
    },
    reset() {
      //重置心跳
      var that = this;
      //清除时间
      clearTimeout(that.timeoutObj);
      clearTimeout(that.serverTimeoutObj);
      //重启心跳
      that.start();
    },
    start() {
      //开启心跳
      var self = this;
      self.timeoutObj && clearTimeout(self.timeoutObj);
      self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj);
      self.timeoutObj = setTimeout(function() {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (self.websock.readyState == 1) {
          //如果连接正常
          console.log("1111");
          self.websock.send(
            '{"protocolType":0,"body":"' +
              self.$base64.doEncode('{"action":3000}') +
              '"}'
          );
          self.websock.send(
            '{"protocolType":0,"body":"' +
              self.$base64.doEncode(
                '{"from":"UID:' +
                  self.uid +
                  '","to":"DID:' +
                  self.did +
                  '","action":103}'
              ) +
              '"}'
          );
        } else {
          //否则重连
          console.log("222");
          self.reconnect();
        }
        self.serverTimeoutObj = setTimeout(function() {
          //超时关闭
          self.websock.close();
        }, self.timeout);
      }, self.timeout);
    },
    websocketonopen() {
      //连接成功事件
      var self = this;
      //生成二维码(参数内容，canvas的id)
      self.websock.send(
        '{"protocolType":0,"body":"' +
          self.$base64.doEncode(
            '{"from":"UID:' +
              self.uid +
              '","to":"DID:' +
              self.did +
              '","action":103}'
          ) +
          '"}'
      );
      //开启心跳
      this.start();
    },

    websocketonerror(e) {
      //连接失败事件
      //错误
      console.log("WebSocket连接发生错误");
      //错误提示
      //重连
      this.reconnect();
    },
    websocketclose(e) {
      //连接关闭事件
      //关闭
      console.log("connection closed (" + e.code + ")");
      //提示关
      //重连
      this.reconnect();
    },
    websocketonmessage(event) {
      //接收服务器推送的信息
      //打印收到服务器的内容
      var that = this;
      that.dataOnmessage = JSON.parse(event.data);
      if (that.dataOnmessage.protocolType != undefined) {
        that.data = JSON.parse(that.$base64.doDecode(that.dataOnmessage.body));
        if (that.data.action != "3000") {
          if (that.configsType == null) {
            that.configsType = true;
          }
        }
      } else {
        that.data = that.dataOnmessage;
        if (that.data.action != "3000") {
          if (that.configsType == null) {
            that.configsType = true;
          }
        }
      }
      if (that.data.action == "802") {
        that.did = data.from.substring(4, that.data.from.length);
        if (that.configsType) {
          that.websock.send(
            '{"from":"UID:' +
              that.uid +
              '","to":"DID:' +
              that.did +
              '","action":103}'
          );
        } else if (!that.configsType) {
          that.websock.send(
            '{"protocolType":0,"body":"' +
              base64.doEncode(
                '{"from":"UID:' +
                  that.uid +
                  '","to":"DID:' +
                  that.did +
                  '","action":103}'
              ) +
              '"}'
          );
        }
      } else if (that.data.action == "910") {
        that.canDeviceMode = true;
      } else if (that.data.action == "104") {
        this.songs(that.data);
      } else if (that.data.action == "806") {
        this.songs("");
      }
      //收到服务器信息，心跳重置
      this.reset();
    },
    websocketsend(msg) {
      //向服务器发送信息
      //数据发送
      this.websock.send(msg);
    },
    songs(list) {
      var that = this;
      that.setSongs(list);
    },
    //上下一曲
    deviceClick(action) {
      var that = this;
      if (that.deviceFlag) {
        var msg = "";
        if (action == 5) {
          msg =
            '{"protocolType":0,"body":"' +
            that.$base64.doEncode(
              '{"from":"UID:' +
                that.uid +
                '","to":"DID:' +
                that.did +
                '","action":5}'
            ) +
            '"}';
        } else if (action == 4) {
          msg =
            '{"protocolType":0,"body":"' +
            that.$base64.doEncode(
              '{"from":"UID:' +
                that.uid +
                '","to":"DID:' +
                that.did +
                '","action":4}'
            ) +
            '"}';
        }
        that.websocketsend(msg);
      }
    },
    //播放暂停
    devicePlay(state) {
      var that = this;
      var msg = "";
      if (that.deviceFlag) {
        if (state == "playing") {
          msg =
            '{"protocolType":0,"body":"' +
            that.$base64.doEncode(
              '{"from":"UID:' +
                that.uid +
                '","to":"DID:' +
                that.did +
                '","action":2}'
            ) +
            '"}';
        } else {
          msg =
            '{"protocolType":0,"body":"' +
            that.$base64.doEncode(
              '{"from":"UID:' +
                that.uid +
                '","to":"DID:' +
                that.did +
                '","action":1}'
            ) +
            '"}';
        }
        that.websocketsend(msg);
      }
    },
    //歌曲循环
    deviceLoop(mode) {
      var that = this;
      var playmode = (mode + 1) % 2;
      if (that.deviceFlag) {
        var msg =
          '{"protocolType":0,"body":"' +
          that.$base64.doEncode(
            '{"from":"UID:' +
              that.uid +
              '","to":"DID:' +
              that.did +
              '","action":909,"playmode":' +
              playmode +
              "}"
          ) +
          '"}';
        that.websocketsend(msg);
      }
    },
    setAudio(data) {
      var that = this;
      if (!that.deviceFlag) return;
      var path =
        data.path.indexOf("https:") > -1
          ? data.path.replace("https", "http")
          : data.path;
      var songs = JSON.stringify([
        {
          id: data.music_id || data.radioid,
          singer: "",
          posters: "",
          language: "国语",
          name: data.name,
          albumname: data.specialname,
          albumid: data.special_id,
          type: 5,
          res: [
            {
              filesize: "",
              lrc: "",
              fmt: "mp3",
              duration: data.lengthOfTime,
              url: path
            }
          ]
        }
      ]);
      var msg =
        '{"protocolType":0,"body":"' +
        that.$base64.doEncode(
          '{"from":"UID:' +
            that.uid +
            '","to":"DID:' +
            that.did +
            '","action":205,"rmidxs":"-1,"}'
        ) +
        '"}';
      var msg1 =
        '{"protocolType":0,"body":"' +
        that.$base64.doEncode(
          '{"from":"UID:' +
            that.uid +
            '","to":"DID:' +
            that.did +
            '","action":203,"songs":' +
            songs +
            "}"
        ) +
        '"}';
      that.websocketsend(msg);
      that.websocketsend(msg1);
    },
    ...mapActions(["setSongs"])
  }
};
</script>

<style lang='less' scoped>
.playBox {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 1.8rem;
  background: #fff;
  z-index: 9000;
  display: flex;
  .play-img {
    width: 2rem;
    img {
      width: 1.2rem;
      height: 1.2rem;
      display: block;
      margin: 0.3rem 0 0 0.4rem;
    }
  }
  .play-text {
    width: 3rem;
    line-height: 1.8rem;
  }
  .play-btn {
    line-height: 1.8rem;
    padding-left: 0.3rem;
    span {
      padding: 0 0.2rem;
    }
  }
}
</style>
