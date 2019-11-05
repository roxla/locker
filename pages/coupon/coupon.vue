<template>
	<view id="COUPON">
		<view class="shop-box" v-for="(item,index) in couponList" :key="index">
			<view class="shop-logo">
				<view class="shop-img">
					<image :src="item.merchantIoc" mode=""></image>
				</view>
			</view>
			<view class="shop-body-box">
				<view class="shop-body" @click="go(item.fkMerchantNo,item.cashCouponMoney)">
					<view class="shop-body-name">{{item.merchantName}}</view>
					<view class="shop-body-name" style="padding-right: 50rpx;">{{item.cashCouponName}}</view>
				</view>
				<view class="shop-body-coupon">
					<view class="coupon-name"><text>{{item.cashCouponMoney}}</text>元代金券</view>
					<view class="coupon-use">
						<button @click="showPopup(item.cashCouponRecordNo)" plain="true" class="mini-button" type="primary">使用</button>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="coupon" type="center" :custom="true" :mask-click="false">
			<view class="popup-box">
				<view class="popup-title">向店铺本出示二维码</view>
				<view class="popup-code-img">
					<view>
						<tki-qrcode ref="qrcode" cid="qrcode" :size="250" :val="val" :onval="true" :loadMake="true" :showLoading="false"/>
					</view>
				</view>
				<view class="popup-code-text">验证码：<br/><text>{{val}}</text></view>
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
import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue'
export default {
	components: {
		uniIcon,
		uniPopup,
		tkiQrcode
	},
	data() {
		return {
			couponList:[],
			val:" "
		}
	},
	onShow() {
		this.checkLogin();
		uni.showLoading({mask:true});
		this.getData();
	},
	onPullDownRefresh: function() {
		this.getData();
		uni.stopPullDownRefresh();
	},
	methods: {
		go(No,cost){
			uni.navigateTo({url: '../shop/shop?no='+No+'&cost='+cost});
		},
		showPopup(val){
			this.val = val;
			this.$refs.coupon.open();
		},
		hidePopup(){
			this.$refs.coupon.close();
		},
		getData(){
			uni.request({
				url: this.apiServer + 'merchantCashCoupon/getCashCouponRecord',
				data: {
					isEmploy:false,
					whetherToQuerySource:true
				},
				method: 'POST',
				header: {
					'content-Type': 'application/x-www-form-urlencoded',
					'token': uni.getStorageSync('opid')
				},
				success: (res) => {
					if(res.data.status == 200){
						let data = res.data.data;
						for(let i=0;i<data.length;i++){
							if(!data[i].merchantIoc){
								data[i].merchantIoc = '../../static/index/u207.png'
							};
						};
						this.couponList = data;
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
		}
	}
}
</script>

<style scoped>
#COUPON{
	background-color: #F2F2F2;
	padding-top: 20rpx;
	height: calc(100vh - 20rpx);
	overflow-y: scroll;
}
.shop-box{
	padding: 12.5rpx;
	display: flex;
	align-items: flex-start;
	border: 2.5rpx solid #008000;
	background-color: white;
	width: 88%;
	margin: 0rpx auto 20rpx;
	border-top-right-radius: 120rpx;
	border-bottom-left-radius: 120rpx;
}
.shop-logo{
	width: 63rpx;
}
.shop-img image{
	width: 62.5rpx;
	height: 62.5rpx;
}
.shop-body-box{
	width: calc(100% - 63rpx);
}
.shop-body{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0rpx 12.5rpx ;
	height: 62.5rpx;
	margin-bottom: 10rpx;
}
.shop-body-name{
	font-size: 0.8em;
	vertical-align: middle;
	font-weight: bold;
}
.shop-body-coupon{
	background-color: #FFECEC;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 37.5rpx;
	width: 85%;
	margin-bottom: 10rpx;
	border-bottom-right-radius: 55rpx;
	border-top-left-radius: 55rpx;
}
.coupon-name{
	font-size: 0.8em;
}
.coupon-name text{
	font-size: 1.5em;
	font-weight: 500;
	font-family: '黑体';
}
.mini-button{
	height: 50rpx;
	line-height: 50rpx;
	font-size: 0.7em;
}
.popup-box{
	position: relative;
	bottom: 50rpx;
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
}
.popup-code-img{
	display: flex;
	justify-content: center;
	margin-top: 50rpx;
}
.popup-code-text{
	text-align: center;
	margin: 10rpx 0rpx 30rpx;
	font-size: 0.9em;
}
.popup-code-text text{
	font-weight: bold;
}
.popup-close{
	position: absolute;
	top: 500rpx;
	z-index: 2;
	width: 100%;
	display: flex;
	justify-content: center;
}
</style>
