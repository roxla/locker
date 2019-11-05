<template>
	<view id="TEL">
		<view class="item-box">
			<view class="item-header">
				<view class="logo-box">
					<image src="../../static/index/u71.png" mode=""></image>
				</view>
			</view>
			<view class="item-main">
				<view class="main-title">申请获取以下权限</view>
				<view class="main-text">获取你的手机号</view>
				<view class="main-tips">为避免遗留物品而无法联系，需要获取您的手机号码</view>
			</view>
			<view class="item-button-box">
				<view class="item-button">
					<button type="primary" open-type="getPhoneNumber" @getphonenumber="getPhone" style="background-color: #2FACFF; color: #fff;">确认授权</button>
				</view>
				<view class="item-button">
					<button type="primary" @click="back('../index/index')" style="background-color: #EBEBEB;">取消</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			
		},
		methods: {
			back(url){
				uni.navigateBack({url: url});
			},
			getPhone(e){
				if(e.detail.errMsg == 'getPhoneNumber:ok'){
					uni.request({
						url: this.apiServer + 'weChatOperation/bindingInformation',
						method: 'POST',
						data: {
							weChatSessionKey: uni.getStorageSync('sessionKey'),
							weChatData: e.detail.encryptedData,
							weChatIV: e.detail.iv
						},
						header: {
							'content-Type': 'application/x-www-form-urlencoded',
						},
						success: (res) => {
							if(res.data.status == 200){
								uni.setStorageSync('opid',res.data.data);
								uni.navigateBack({url: '../index/index'});
							}else{
								uni.showToast({
									title: res.data.msg,
									icon: 'none',
									duration: 2000
								});
							}
						}
					});
				}else{
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
			}
		}
	}
</script>

<style scoped>
.item-box{
	width: 92%;
	margin: auto;
}
.item-header{
	border-bottom: 1px solid #8E8E8E;
	padding: 75rpx 0rpx;
	display: flex;
	justify-content: center;
}
.logo-box{
	width: 175rpx;
	height: 175rpx;
}
.logo-box image{
	width: 100%;
	height: 100%;
}
.item-main{
	width: 90%;
	margin: 25rpx auto 0rpx;
}
.main-title{
	font-size: 1em;
	margin-bottom: 20rpx;
}
.main-text{
	font-size: 0.8em;
	margin-bottom: 20rpx;
	color: #A4A4A4;
}
.main-tips{
	font-size: 0.8em;
	margin-bottom: 20rpx;
}
.item-button{
	margin-top: 20rpx;
}
.item-button button{
	height: 75rpx;
	line-height: 75rpx;
	font-size: 0.8em;
	border-radius: 1500rpx;
	color: #4B4B4B;
}
</style>
