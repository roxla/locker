import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

Vue.prototype.apiServer = 'https://cabinet.fryxy.cn/testDeBug/';
Vue.prototype.checkLogin = function(){
	uni.login({
		provider: 'weixin',
		success: function(loginRes) {
			uni.request({
				url: 'https://cabinet.fryxy.cn/testDeBug/login/weChatAuthorized',
				method: 'POST',
				data: {
					code: loginRes.code,
					loginType: 'user'
				},
				header: {
					'content-Type': 'application/x-www-form-urlencoded',
				},
				success: (res) => {
					if(res.data.status == 505){
						uni.setStorageSync('sessionKey',res.data.data);
					}else if(res.data.status == 200){
						uni.setStorageSync('opid',res.data.data);
					}
				},
				fail: (res) => {
					uni.showToast({
						title: res.data.msg,
						icon: 'none',
						duration: 2000
					});
				}
			});
		}
	});
}

App.mpType = 'app'

Vue.prototype.wxCode = "";
const app = new Vue({
    ...App
})
app.$mount()
