<template>
	<view id="STORAGE" :style="'height:'+height+'px'">
		<view class="storage-box">
			<view class="storage-tips">
				<view class="tips-title">
					<view class="title-img">
						<image src="../../static/storage/u465.png" mode=""></image>
					</view>
					<view class="title-text">温馨提示！</view>
				</view>
				<view class="tips-text">温馨提示温馨提示温馨提示温馨提示温馨提示温馨提示温馨提示温馨提示温！</view>
			</view>
			<view class="storage-main">
				<view class="storage-button">
					<button @click="storage(case_1)" type="primary" style="background-color: #0095DD;">
						{{case_1.typeName}}<text>{{case_1.rent}}</text>元/<text class="text-time">{{case_1.settlingTime}}</text>小时
					</button>
				</view>
				<view class="storage-button">
					<button @click="storage(case_2)" type="primary" style="background-color: #026CD7;">
						{{case_2.typeName}}<text>{{case_2.rent}}</text>元/<text class="text-time">{{case_2.settlingTime}}</text>小时
					</button>
				</view>
				<view class="storage-button">
					<button @click="storage(case_3)" type="primary" style="background-color: #0C36DE;">
						{{case_3.typeName}}<text>{{case_3.rent}}</text>元/<text class="text-time">{{case_3.settlingTime}}</text>小时
					</button>
				</view>
				<view class="storage-button">
					<button @click="go('../free/free?id='+caseNo)" type="primary">免费存包</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			height: 0,
			caseNo:"",
			case_1:{},
			case_2:{},
			case_3:{}
		}
	},
	onLoad(options) {
		this.caseNo = options.id;
		this.height = uni.getSystemInfoSync().windowHeight;
		uni.showLoading({mask:true});
		this.getData();
	},
	methods: {
		go(url){
			uni.navigateTo({url: url});
		},
		getData(){
			uni.request({
				url: this.apiServer + 'subCabinetType/getSubCabinetType',
				method: 'POST',
				header: {
					'content-Type': 'application/x-www-form-urlencoded',
				},
				success: (res) => {
					if(res.data.status == 200){
						let data = res.data.data;
						for(let i=0;i<data.length;i++){
							data[i].rent = parseFloat(data[i].rent).toFixed(2);
						};
						this.case_1 = data[0];
						this.case_2 = data[1];
						this.case_3 = data[2];
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
		storage(data){
			uni.request({
				url: this.apiServer + 'cabinetProcessing/userOpenCabinet',
				method: 'POST',
				data: {
					cabinetNo: this.caseNo,
					subCabinetTypeNo: data.pkNo
				},
				header: {
					'content-Type': 'application/x-www-form-urlencoded',
					'token': uni.getStorageSync('opid')
				},
				success: (res) => {
					if(res.data.status == 200){
						uni.showToast({
							title: '开柜成功',
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
				}
			})
		}
	}
}
</script>

<style scoped>
#STORAGE{
	background-color: #F2F2F2;
}
.storage-box{
	width: 92%;
	margin: auto;
	padding-top: 20rpx;
}
.storage-tips{
	padding: 15rpx;
	background-color: #FFDFDF;
	border: 1px solid #FF6666;
	border-radius: 25rpx;
}
.tips-title{
	display: flex;
	align-items: center;
}
.title-img{
	width: 50rpx;
	height: 50rpx;
	padding-right: 20rpx;
}
.title-img image{
	width: 100%;
	height: 100%;
}
.title-text{
	color: #D85F56;
	font-size: 0.9em;
}
.tips-text{
	font-size: 0.7em;
	padding-left: 70rpx;
	margin-top: 10rpx;
}
.storage-main{
	width: 84%;
	margin: auto;
	padding-top: 15rpx;
}
.storage-button{
	margin-top: 35rpx;
}
.storage-button button{
	width: 100%;
	height: 160rpx;
	line-height: 160rpx;
	border-radius: 25rpx;
	box-shadow: 0rpx 0rpx 10rpx rgba(0, 0, 0, 0.35);
	font-size: 1em;
}
.storage-button text{
	font-size: 1.2em;
	font-weight: bold;
	margin: 0rpx 6rpx;
}
.text-time{
	font-size: 0.7em;
}
</style>
