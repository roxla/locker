<template>
	<view id="SHOP" :style="'height:'+height+'px'">
		<view class="header-box">
			<view class="header-logo-box">
				<image :src="icon" mode=""></image>
			</view>
			<view class="header-main-box">
				<view class="header-main-name">{{name}}</view>
				<view class="header-main-cost"><text>{{cost}}</text>元代金券</view>
			</view>
		</view>
		<view class="main-box">
			<view class="main-title">商家联系信息</view>
			<view class="main-info">联系电话：{{tel}}</view>
			<view class="main-info address">
				<view class="address-text">联系地址：{{address}}</view>
				<view class="address-icon" @click="locationMap()">
					<uni-icon type="location" size="26"></uni-icon>
				</view>
			</view>
		</view>
		<view class="main-box">
			<view class="main-title">使用规则</view>
			<view class="main-info">使用规则：</view>
		</view>
		<view class="main-box">
			<view class="main-title">店家介绍</view>
			<view class="shop-info info ql-editor" v-if="article!=''">
				<u-parse :content="article" @preview="preview" @navigate="navigate" ></u-parse>
			</view>
		</view>
	</view>
</template>

<script>
import uParse from '@/components/u-parse/u-parse.vue'
import uniIcon from "@/components/uni-icon/uni-icon.vue"
import "@/components/quill/quill.core.css";
import "@/components/quill/quill.snow.css";
import "@/components/quill/quill.bubble.css";
export default {
	components: {
		uParse,
		uniIcon
	},
	data() {
		return {
			height: 0,
			name:"",
			icon:"",
			article:"",
			address:"",
			tel:"",
			cost:0,
			lat:0,
			lng:0
		}
	},
	onLoad(options) {
		this.cost = options.cost;
		this.checkLogin();
		this.height = uni.getSystemInfoSync().windowHeight;
		uni.showLoading({mask:true});
		this.getData(options.no);
	},
	methods: {
		preview(src, e) {
			// do something
		},
		navigate(href, e) {
			// do something
		},
		getData(No){
			uni.request({
				url: this.apiServer + 'merchant/merchantData',
				method: 'POST',
				data: {
					merchantNo:No
				},
				header: {
					'content-Type': 'application/x-www-form-urlencoded',
					'token': uni.getStorageSync('opid')
				},
				success: (res) => {
					if(res.data.status == 200){
						let data = res.data.data;
						if(!data.merchantIoc){
							this.icon = '../../static/index/u207.png'
						}else{
							this.icon = data.merchantIoc;
						};
						this.lat = parseFloat(data.lng);
						this.lng = parseFloat(data.lat);
						this.article = data.merchantIntroduce;
						this.tel = data.merchantMobile;
						this.address = data.merchantAddress;
						this.name = data.merchantName;
					}else if(res.data.status == 588){
						this.checkLogin();
						uni.showToast({
							title: '登录失效，请再试一次',
							icon: 'none',
							duration: 2000
						});
					}else{
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
							duration: 2000
						});
					}
				},
				fail: (res) => {
					uni.showToast({
						title: '网络异常',
						icon: 'none',
						duration: 2000
					});
					setTimeout(() => {
						uni.navigateBack({url: '../index/index'});
					}, 2000);
				},
				complete: (res) => {
					uni.hideLoading();
				}
			});
		},
		locationMap(){
			uni.openLocation({
				latitude: this.lat,   //纬度
				longitude: this.lng,   //经度
				name: this.name,
				address: this.address,
				success: function () {
					console.log('success');
				}
			});
		}
	}
}
</script>

<style scoped>
#SHOP{
	background-color: #E4E4E4;
}
.header-box{
	display: flex;
	align-items: center;
	background-color: #2FACFF;
	padding: 10rpx 10rpx 20rpx 40rpx;
}
.header-logo-box{
	border: 5rpx solid white;
	background-color: white;
	border-radius: 12.5rpx;
	width: 150rpx;
	height: 150rpx;
	overflow: hidden;
	margin-right: 50rpx;
}
.header-logo-box image{
	width: 100%;
	height: 100%;
}
.header-main-box{
	font-size: 0.8em;
	color: white;
}
.header-main-name{
	font-weight: bold;
	margin-bottom: 25rpx;
}
.header-main-cost text{
	font-size: 1.5em;
	font-weight: 600;
	font-family: '黑体';
}
.main-box{
	background-color: white;
	margin-top: 20rpx;
	font-size: 0.8em;
}
.main-title{
	border-left: 10rpx solid #009900;
	font-weight: bold;
	padding: 15rpx 10rpx;
}
.main-info{
	word-wrap: break-word;
	border-top: 1px solid #E4E4E4;
	padding: 15rpx 10rpx 15rpx 20rpx;
}
.address{
	display: flex;
	align-items: center;
}
.address-text{
	word-wrap: break-word;
	width: calc(100% - 26px);
}
.address-icon{
	width: 26px;
}
.shop-info{
	border-top: 1px solid #E4E4E4;
}
</style>
