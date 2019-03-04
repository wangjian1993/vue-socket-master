// const http = "https://cloud.alilo.com.cn";
// const getBannerList = http + "/baby/api/wx/getBannerList";
import axios from "axios";
import qs from "qs";
export function fetch(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      //instance创建一个axios实例，可以自定义配置，可在 axios文档中查看详情
      //所有的请求都会带上这些配置，比如全局都要用的身份信息等。
      headers: {
        "Content-Type": "application/json"
        // 'token_in_header': global_.token,//token从全局变量那里传过来
      },
      timeout: 30 * 1000 // 30秒超时
    });
    instance(options)
      .then(response => {
        //then 请求成功之后进行什么操作

        resolve(response); //把请求到的数据发到引用请求的地方
      })
      .catch(error => {
        console.log("请求异常信息：" + error);
        reject(error);
      });
  });
}
const cloudUrl = "https://cloud.alilo.com.cn/baby/api/wx/";
const aliloUrl = "https://www.alilo.com.cn";
const hhtUrl = "http://device.alilo.com.cn/g9s";
//const xckUrl = "http://ddm.wx.dandanman.com";
//const gzh_id = "gh_7f188fff0260";
//const app_id = "wxb82517341aa364b2";
// const gzh_id = "gh_64691b03e66f";
// const app_id = "wx1dacb8e1d63f3dc7";
// const xckUrl = "http://pre.yy.dandanman.com";
export default {
  getBannerList() {
    return fetch({
      url: cloudUrl + "getBannerList",
      method: "get",
      params: ""
    });
  },
  recommendSpecial() {
    return fetch({
      url: cloudUrl + "recommendSpecial",
      method: "get",
      params: {
        page: 0,
        pageSize: 7
      }
    });
  },
  getVideoData() {
    return fetch({
      url: cloudUrl + "videoAlbumList",
      method: "get",
      params: {
        page: 0,
        pageSize: 2
      }
    });
  },
  getSleepData() {
    return fetch({
      url: cloudUrl + "sleepZone",
      method: "get",
      params: ""
    });
  },
  getHabitData() {
    return fetch({
      url: cloudUrl + "characterTraining",
      method: "get",
      params: ""
    });
  },
  getFavData() {
    return fetch({
      url: cloudUrl + "allListening",
      method: "get",
      params: ""
    });
  },
  getFMData() {
    return fetch({
      url: aliloUrl + "/gw/resource/radioInfo",
      method: "post",
      params: {
        type: 1
      }
    });
  },
  getAlbumsData(tabStates) {
    return fetch({
      url: cloudUrl + "enterClassByType",
      method: "post",
      params: {
        page: 0,
        pageSize: 50,
        st: 2,
        type: tabStates
      }
    });
  },
  websockLogin(openid, did) {
    return fetch({
      url: hhtUrl + "/wechat/login",
      method: "get",
      params: {
        _: (+new Date()),
        openid: openid,
        diviceid: did
      }
    })
  },
  getSpecialInfo(id) {
    return fetch({
      url: cloudUrl + "getSpecialInfo",
      method: "get",
      params: {
        id: id
      }
    });
  }
};
