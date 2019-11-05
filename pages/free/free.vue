<template>
	<view id="FREE">
		<view class="item-box">
			<view class="item-title">免费存包说明</view>
			<view class="item-info">{{bagText}}</view>
		</view>
		<view class="item-box">
			<view class="item-title">可选的代金券</view>
			<view class="item-main">
				<view class="shop-box" v-for="(item,index) in couponList" :key="index">
					<view class="shop-logo">
						<view class="shop-img">
							<image :src="item.merchantIoc" mode=""></image>
						</view>
					</view>
					<view class="shop-body-box">
						<view class="shop-body" @click="go('../shop/shop?no='+item.merChantNo+'&cost='+item.cashCouponMoney)">
							<view class="shop-body-name">{{item.merchantName}}</view>
							<view class="shop-body-name" style="padding-right: 50rpx;">{{item.cashCouponName}}</view>
						</view>
						<view class="shop-body-coupon">
							<view class="coupon-name"><text>{{item.cashCouponMoney}}</text>元代金券</view>
							<view class="coupon-use">
								<button @click="priceOrder(item)" plain="true" class="mini-button" type="primary">免费存包</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import uniIcon from "@/components/uni-icon/uni-icon.vue"
export default {
	components: {
		uniIcon
	},
	data() {
		return {
			caseNo:"",
			height: 0,
			bagText:"如您选购如下任一款消费卷，即可享受当天一次性免费存包，欢迎您选购！",
			couponList:[],
		}
	},
	onLoad(options) {
		this.caseNo = options.id;
		this.checkLogin();
		uni.showLoading({mask:true});
		this.height = uni.getSystemInfoSync().windowHeight;
		this.getData();
	},
	methods: {
		go(url){
			uni.navigateTo({url: url});
		},
		getData(){
			uni.request({
				url: this.apiServer + 'couponForCabinet/getCouponForCabinetMap',
				method: 'POST',
				data: {
					cabinetNo:this.caseNo
				},
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
		},
		priceOrder(data){
			let cost = parseFloat(data.cashCouponMoney)*100;
			uni.request({
				url: this.apiServer + 'weChatOperation/unifiedOrder',
				method: 'POST',
				data: {
					totalFee: 1
				},
				header: {
					'content-Type': 'application/x-www-form-urlencoded',
					'token': uni.getStorageSync('opid')
				},
				success: (res) => {
					if(res.data.status == 200){
						this.payOrder(res.data.data,data);
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
				}
			})
		},
		payOrder(data,item){
			uni.requestPayment({
				provider: 'wxpay',
				timeStamp: data.timeStamp,
				nonceStr: data.nonceStr,
				package: data.package,
				signType: data.signType,
				paySign: data.paySign,
				success: (res) => {
					if(res.errMsg == 'requestPayment:ok'){
						this.buyCoupon(item);
					};
				},
				fail: (err) => {
					if(err.errMsg == 'requestPayment:fail cancel'){
						uni.showToast({
							title: '已取消支付',
							icon: 'none',
							duration: 2000
						});
					}else{
						uni.showToast({
							title: '支付失败',
							icon: 'none',
							duration: 2000
						});
					}
				}
			});
		},
		buyCoupon(data){
			uni.request({
				url: this.apiServer + 'merchantCashCoupon/purchaseCoupons',
				method: 'POST',
				data: {
					fkMerchantCashCouponNo:data.cashCouponNo,
					cabinetNo:this.caseNo
				},
				header: {
					'content-Type': 'application/x-www-form-urlencoded',
					'token': uni.getStorageSync('opid')
				},
				success: (res) => {
					if(res.data.status == 200){
						uni.showToast({
							title: '购买成功，请去选择柜子类型',
							icon: 'none',
							duration: 1000
						});
						setTimeout(() => {
							uni.navigateBack({url: '../storage/storage'});
						}, 1000);
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
				}
			})
		}
	}
}
</script>

<style scoped>
#FREE{
	
}
.item-box{
	font-size: 0.8em;
}
.item-title{
	border-left: 10rpx solid #009900;
	font-weight: bold;
	padding: 15rpx 20rpx;
}
.item-info{
	word-wrap: break-word;
	border-top: 1px solid #E4E4E4;
	padding: 15rpx 10rpx 15rpx 30rpx;
	border-bottom: 1px solid #E4E4E4;
}
.item-main{
	padding-top: 20rpx;
	height: calc(100vh - 270rpx);
	overflow-y: scroll;
	border-top: 1px solid #E4E4E4;
}
.shop-box{
	padding: 12.5rpx;
	display: flex;
	align-items: flex-start;
	border: 2.5rpx solid #008000;
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
	font-size: 0.8em;
}
</style>
