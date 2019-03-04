// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/app.css'
import store from './store/index'
import { Datetime, Group } from "vux";
import 'lib-flexible/flexible.js'
import axios from "./api/config"
import base64 from './assets/js/base64'
import VueLazyLoad from "vue-lazyload";
import VueWechatTitle from 'vue-wechat-title';
Vue.use(VueWechatTitle);
Vue.component(Datetime.name, Datetime)
Vue.component(Group.name, Group)
Vue.config.productionTip = false
Vue.prototype.$axios = axios;
Vue.prototype.$base64 = base64;
Vue.use(VueLazyLoad, {
	error: "../static/images/fm_mask.png",
	loading: "../static/images/fm_mask.png"
});
/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	components: {
		App
	},
	template: '<App/>'
})
