<template>
	<view id="INDEX" :style="'height:'+height+'px'">
		<view class="header-img-box">
			<image src="../../static/index/u68.png"></image>
		</view>
		<view class="index-main-box">
			<view class="index-main-title">
				<view class="main-title-left">
					<view class="title-logo-box">
						<image src="../../static/index/u71.png" mode=""></image>
					</view>
					<view class="title-name">芙蓉云存包</view>
				</view>
				<view class="main-title-right">
					<view class="function-button" @click="go('../direction/direction')">
						<view class="button-text">存件说明</view>
					</view>
					<view class="function-button" @click="lost()">
						<view class="button-text">物品遗忘</view>
					</view>
					<view class="function-button" @click="showPopup()">
						<view class="button-text">联系客服</view>
					</view>
				</view>
			</view>
			<view class="index-main-button">
				<button type="primary" v-if="!info" open-type="getUserInfo" @getuserinfo="userAuthorize">我要存包</button>
				<button type="primary" v-if="info" @click="storageBag()">我要存包</button>
			</view>
			<view class="index-main-button">
				<button type="primary" v-if="!info" style="background-color: #1975A2;" open-type="getUserInfo" @getuserinfo="userAuthorize">我要取件</button>
				<button type="primary" v-if="info" @click="pickupBag()" style="background-color: #1975A2;">我要取件</button>
			</view>
		</view>
		<uni-popup ref="coupon" type="center" :custom="true" :mask-click="false">
			<view class="popup-box">
				<view class="popup-title">客服热线</view>
				<view class="popup-text">客服热线：<text>0571-85873569</text></view>
				<view class="popup-text">服务时间：周一至周六  9:00至18:00</view>
				<view class="popup-button">
					<button type="primary" @click="server()">拨打客服热线</button>
				</view>
			</view>
			<view class="popup-close" @click="hidePopup()">
				<uni-icon type="clear" color="#fff" size="30" />
			</view>
		</uni-popup>
	</view>
</template>

<script>
import uniIcon from "@/components/uni-icon/uni-icon.vue"
import uniPopup from "@/components/uni-popup/uni-popup.vue"
export default {
	components: {
		uniIcon,
		uniPopup
	},
	data() {
		return {
			height: 0,
			caseId: "", //100001
			info:false,
		}
	},
	onLoad(options) {
		if(!!options.id){
			this.caseId = options.id;
		}else{
			this.caseId = "";
		}
		this.height = uni.getSystemInfoSync().windowHeight;
		this.getInfo();
	},
	onShow() {
		if(!uni.getStorageSync('opid')){
			this.checkLogin();
		}
	},
	methods: {
		getInfo(){
			let _this = this;
			uni.getSetting({
				success(res) {
					if(res.authSetting["scope.userInfo"]){
						_this.info = true;
					}else{
						_this.info = false;
					}
				}
			});
		},
		userAuthorize(e){
			uni.getUserInfo({
				provider: 'weixin',
				success: (infoRes) => {
					let data = JSON.parse(infoRes.rawData);
					this.info = true;
					this.checkTel();
				},
				fail: () => {
					uni.showModal({
						title: '警告',
						content: '您点击了拒绝授权，将无法使用小程序，请授权之后再使用!',
						showCancel: false,
						confirmText: "返回授权",
						success: function (res) {
							if (res.confirm) {
								console.log('用户点击确定');
							}
						}
					});
				}
			});
		},
		checkTel(){
			uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					uni.request({
						url: 'http://xyxh.fryxy.cn/testDeBug/login/weChatAuthorized',
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
								uni.navigateTo({url: '../tel/tel'});
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
		},
		server(){
			uni.makePhoneCall({
				phoneNumber: '0571-85873569'
			});
		},
		showPopup(){
			this.$refs.coupon.open();
		},
		hidePopup(){
			this.$refs.coupon.close();
		},
		go(url){
			uni.navigateTo({url: url});
		},
		lost(){
			uni.navigateTo({url: '../lost/lost'});
		},
		storageBag(){
			if(uni.getStorageSync('opid')){
				let id = this.caseId;
				if(!!id){
					uni.navigateTo({url: '../storage/storage?id='+id});
				}else{
					uni.scanCode({
						onlyFromCamera: true,
						success: function (res) {
							// console.log('条码类型：' + res.scanType);
							console.log(res.result);
							let id = res.result.split('id%3D')[1].split('#')[0];
							uni.navigateTo({url: '../storage/storage?id='+id});
						}
					});
				}
			}else{
				uni.navigateTo({url: '../tel/tel'});
			}
		},
		pickupBag(){
			if(uni.getStorageSync('opid')){
				uni.navigateTo({url: '../pickup/pickup'});
			}else{
				uni.navigateTo({url: '../tel/tel'});
			}
		}
	}
}
</script>

<style scoped>
image{
	width: 100%;
	height: 100%;
}
#INDEX{
	background-color: #F2F2F2;
}
.header-img-box{
	width: 100%;
	height: 305rpx;
}
.index-main-box{
	width: 94%;
	margin: auto;
}
.index-main-title{
	padding-left: 25rpx;
	margin-top: 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	height: calc(100vh - 800rpx);
}
.title-logo-box{
	width: 150rpx;
	height: 150rpx;
}
.title-name{
	font-family: "黑体";
	padding: 50rpx 0rpx 0rpx;
	font-size: 1.5em;
}
.function-button{
	padding-bottom: 35rpx;
	border-right: 1px solid #009900;;
}
.function-button:last-of-type{
	padding-bottom: 0rpx;
}
.button-text{
	padding: 10rpx 40rpx;
	color: #FFFFFF;
	background-color: #009900;
	font-size: 0.8em;
	border-top-left-radius: 250rpx;
	border-bottom-left-radius: 250rpx;
}
.index-main-button{
	margin-top: 50rpx;
}
.index-main-button button{
	width: 100%;
	height: 160rpx;
	line-height: 160rpx;
	border-radius: 25rpx;
	box-shadow: 0rpx 0rpx 25rpx rgba(0, 0, 0, 0.35);
}
.popup-box{
	background-color: rgba(255,255,255,0.8);
	border: 5rpx solid #009900;
	border-radius: 25rpx;
	width: 560rpx;
}
.popup-title{
	width: 80%;
	margin: auto;
	border-bottom-left-radius: 15rpx;
	border-bottom-right-radius: 15rpx;
	text-align: center;
	box-shadow: 0rpx 5rpx 7.5rpx #AFAEAE;
	font-size: 0.8em;
	padding: 15rpx 0rpx;
	background-color: white;
	font-weight: bold;
	margin-bottom: 50rpx;
}
.popup-text{
	font-size: 0.8em;
	text-align: center;
	margin-bottom: 10rpx;
}
.popup-text text{
	font-weight: bold;
}
.popup-button{
	width: 66%;
	margin: 40rpx auto 25rpx;
}
.popup-button button{
	height: 75rpx;
	line-height: 75rpx;
	font-size: 0.8em;
	background-color: #006600;
}
.popup-close{
	position: absolute;
	top: 380rpx;
	z-index: 2;
	width: 100%;
	display: flex;
	justify-content: center;
}
.login-button button{
	height: 75rpx;
	line-height: 75rpx;
	font-size: 0.8em;
}
</style>