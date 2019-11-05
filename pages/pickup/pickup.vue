<template>
	<view id="LOST" :style="'height:'+height+'px'">
		<view class="lost-header">
			<view class="header-logo">
				<image src="../../static/pickup/u169.png" mode=""></image>
			</view>
			<view class="header-text">
				<view class="header-text-left">{{name}}</view>
				<view class="header-text-right" v-if="typeName">{{typeName}}</view>
				<view class="header-text-right" v-if="!typeName">柜子类型</view>
			</view>
		</view>
		<view class="lost-info">存放时间：{{startTime}}</view>
		<view class="tel-box" @click="telCall()">
			<view class="">联系电话：{{tel}}</view>
			<view class=""><uni-icon type="arrowright" color="#999" size="20" ></uni-icon></view>
		</view>
		<view class="lost-info address">存放地点：{{address}}</view>
		
		<view class="lost-price-box">
			<view class="lost-price">
				<view class="">费用合计</view>
				<view class="">￥<text>{{cost}}</text>元</view>
			</view>
		</view>
		<view class="lost-info">使用时长：{{time}} 小时</view>
		<view class="lost-info">免费时长：{{freetime}} 分钟</view>
		<view class="lost-info">收费标准：{{setCost}}元/{{setTime}}小时</view>
		<view class="lost-remark-box" v-if="isApply">
			<view class="lost-remark-title">请填写遗忘在柜子中的物品详情（必填）</view>
			<view class="lost-remark">
				<textarea maxlength="300" v-model="remark" placeholder="请填写遗忘在柜子中的物品详情"/>
			</view>
			<view class="text-num">{{textNum}}/300</view>
		</view>
		<view class="lost-button-box">
			<view class="lost-button">
				<button type="primary" @click="forgotten()" v-if="!isApply" style="background: #1975A2;" >遗忘申请</button>
				<button type="primary" @click="priceOrder(false)" v-if="isApply" style="background: #1975A2;" >确认申请</button>
			</view>
			<view class="lost-button">
				<button @click="priceOrder(true)" type="primary" style="background: #029709;">取出物品</button>
			</view>
		</view>
	</view>
</template>

<script>
import uniIcon from "@/components/uni-icon/uni-icon.vue";
export default {
	components:{
		uniIcon,
	},
	data() {
		return {
			height:0,
			userData:{},
			name:"",
			typeName:"",
			startTime:"",
			tel:"",
			address:"",
			cost:0,
			time:0,
			freetime:0,
			setCost:0,
			setTime:"",
			// 遗忘
			isApply: false,
			remark:"",
			textNum:0,
		}
	},
	onLoad() {
		this.height = uni.getSystemInfoSync().windowHeight;
		uni.showLoading({mask:true});
		this.getData();
	},
	watch:{
		remark(val){
			this.textNum = this.remark.length
		},
		immediate: true,
		deep: true
	},
	methods: {
		getData(){
			uni.request({
				url: this.apiServer + 'cabinetRentEmploymentRecord/getTheUserHireDetails',
				method: 'POST',
				data:{
					fkCabinetRecordStatusNo:"0001"
				},
				header:{
					'content-Type': 'application/x-www-form-urlencoded',
					'token': uni.getStorageSync('opid')
				},
				success: (res) => {
					if(res.data.status == 200){
						if(!!res.data.data){
							let data = res.data.data;
							this.startTime = data.startTime.split('.')[0];
							this.typeName = data.subCabinetType.typeName;
							this.typeName = data.subCabinetType.typeName;
							this.time = data.subCabinetType.settlingTime;
							this.cost = parseFloat(data.subCabinetType.rent).toFixed(2);
							this.userData = data;
							this.getCaseData(data.fkCabinetNo);
							this.getNormData(data.fkSubCabinetTypeNo);
							this.getTelData(data.fkSpaceCharacterNo);
						}else{
							uni.showModal({
								title: '提示',
								content: '您无包裹在存或已申请物品遗忘',
								confirmText: '返回首页',
								showCancel: false,
								success: function (res) {
									if (res.confirm) {
										uni.navigateBack({url: '../index/index'});
									}
								}
							});
						};
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
		getCaseData(No){
			uni.request({
				url: this.apiServer + 'cabinetManage/getCabinetOne',
				method: 'POST',
				data:{
					cabinetNo:No
				},
				header:{
					'content-Type': 'application/x-www-form-urlencoded'
				},
				success: (res) => {
					if(res.data.status == 200){
						let data = res.data.data;
						this.name = data.nameLocker;
						this.address = data.cabinetAddress;
						this.freetime = data.freeTime;
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
			});
		},
		getNormData(No){
			uni.request({
				url: this.apiServer + 'subCabinetType/getSubCabinetTypeOne',
				method: 'POST',
				data:{
					subCabinetTypeNo:No
				},
				header:{
					'content-Type': 'application/x-www-form-urlencoded'
				},
				success: (res) => {
					if(res.data.status == 200){
						let data = res.data.data;
						this.setCost = parseFloat(data.rent).toFixed(2);
						this.setTime = data.settlingTime;
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
			});
		},
		getTelData(No){
			uni.request({
				url: this.apiServer + 'spaceCharacter/getSpaceCharacterOne',
				method: 'POST',
				data:{
					spaceCharacterNo:No
				},
				header:{
					'content-Type': 'application/x-www-form-urlencoded',
					'token': uni.getStorageSync('opid')
				},
				success: (res) => {
					if(res.data.status == 200){
						this.tel = res.data.data.spaceCharacterMobile;
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
			});
		},
		forgotten(){
			let that = this;
			uni.showModal({
				title: '提示',
				content: '请提交申请前，电话联系柜子管理员!',
				cancelText: '返回',
				confirmText: '填写备注',
				success: function (res) {
					if (res.confirm) {
						that.isApply = true;
					}
				}
			});
		},
		telCall(){
			uni.makePhoneCall({
				phoneNumber: this.tel
			});
		},
		priceOrder(data){
			uni.request({
				url: this.apiServer + 'cabinetRentEmploymentRecord/orderAndSettlement',
				method: 'POST',
				header:{
					'content-Type': 'application/x-www-form-urlencoded',
					'token': uni.getStorageSync('opid')
				},
				success: (res) => {
					if(res.data.status == 200){
						this.payOrder(res.data.data,data);
					}else if(res.data.status == 101){
						if(data){
							this.openCase();
						}else{
							this.postForget(this.userData);
						};
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
			});
		},
		postForget(data){
			if(this.remark.length > 0){
				uni.request({
					url: this.apiServer + 'cabinetRentEmploymentRecord/applyForForgetting',
					method: 'POST',
					data:{
						fkCabinetRecordNo: data.cabinetRecorNo,
						forgetRemark: this.remark
					},
					header:{
						'content-Type': 'application/x-www-form-urlencoded',
						'token': uni.getStorageSync('opid')
					},
					success: (res) => {
						if(res.data.status == 200){
							uni.showToast({
								title: '申请成功，请去首页——物品遗忘中查看',
								icon: 'none',
								duration: 2000
							});
							setTimeout(() => {
								uni.navigateBack({url: '../index/index'});
							}, 2000);
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
				});
			}else{
				uni.showToast({
					title: '请填写备注信息',
					icon: 'none',
					duration: 2000
				});
			}
		},
		payOrder(data,type){
			if(type){
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: data.timeStamp,
					nonceStr: data.nonceStr,
					package: data.package,
					signType: data.signType,
					paySign: data.paySign,
					success: (res) => {
						if(res.errMsg == 'requestPayment:ok'){
							this.openCase();
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
			}else{
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: data.timeStamp,
					nonceStr: data.nonceStr,
					package: data.package,
					signType: data.signType,
					paySign: data.paySign,
					success: (res) => {
						if(res.errMsg == 'requestPayment:ok'){
							this.postForget(this.userData);
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
			};
		},
		openCase(){
			uni.request({
				url: this.apiServer + 'cabinetProcessing/customerStatementOpenTheCabinet',
				method: 'POST',
				data:{
					cabinetRecordNo:this.userData.cabinetRecorNo
				},
				header:{
					'content-Type': 'application/x-www-form-urlencoded',
					'token': uni.getStorageSync('opid')
				},
				success: (res) => {
					if(res.data.status == 200){
						uni.showToast({
							title: '开柜成功',
							icon: 'none',
							duration: 2000
						});
						setTimeout(() => {
							uni.navigateBack({url: '../index/index'});
						}, 2000);
					}else if(res.data.status == 588){
						this.checkLogin();
						uni.showToast({
							title: '登录失效，请再试一次',
							icon: 'none',
							duration: 2000
						});
					}else{
						uni.showToast({
							title: res.data.msg+'请联系客服',
							icon: 'none',
							duration: 2000
						});
					};
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
#LOST{
	background-color: #F2F2F2;
	font-size: 0.8em;
}
.address{
	word-wrap: break-word;
	height: 80rpx;
	overflow-y: scroll;
}
.lost-header{
	display: flex;
	align-items: center;
	padding: 10rpx;
	background-color: white;
	margin-bottom: 5rpx;
}
.header-logo{
	width: 55rpx;
	height: 55rpx;
}
.header-logo image{
	width: 100%;
	height: 100%;
}
.header-text{
	width: calc(100% - 60rpx);
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-weight: bold;
	padding: 0rpx 10rpx 0rpx 25rpx;
}
.lost-info{
	padding: 15rpx 25rpx 15rpx 35rpx;
	background-color: white;
	border-bottom: 2.5rpx solid #F2F2F2;
}
.lost-price-box{
	background-color: white;
	margin: 20rpx 0rpx 5rpx;
}
.lost-price{
	border-left: 10rpx solid #009900;
	padding: 15rpx 25rpx;
	font-weight: bold;
	display: flex;
	justify-content: space-between;
}
.lost-price text{
	font-size: 1.2em;
}
.lost-remark-box{
	margin-top: 20rpx;
	background-color: white;
	height: 315rpx;
	width: 100%;
	position: absolute;
}
.lost-remark-title{
	border-bottom: 2.5rpx solid #F2F2F2;
	padding: 15rpx 25rpx;
	border-left: 10rpx solid #009900;
	font-weight: bold;
}
.lost-remark{
	padding: 15rpx 25rpx 0rpx 35rpx;
}
.lost-remark textarea{
	width: 100%;
	height: 175rpx;
}
.text-num{
	height: 40rpx;
	line-height: 40rpx;
	padding: 10rpx 25rpx;
	text-align: right;
	font-size: 0.9em;
	color: #AFAFAF;
	vertical-align: middle;
}
.applied-title{
	border-left-color: #B04600;
}
.applied-text{
	overflow-y: scroll;
	max-height: calc(315rpx - 101rpx);
}
.lost-remark-item{
	margin-bottom: 15rpx;
	word-wrap: break-word;
}
.lost-remark-item:last-of-type{
	margin-bottom: 0rpx;
}
.lost-button-box{
	width: 90%;
	margin: auto;
	height: calc(100vh - 670rpx);
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
}
.lost-button{
	width: 48%;
}
.lost-button button{
	height: 90rpx;
	line-height: 90rpx;
	font-size: 1em;
}
.tel-box{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 15rpx 5rpx 15rpx 35rpx;
	background-color: white;
	border-bottom: 2.5rpx solid #F2F2F2;
}
</style>
