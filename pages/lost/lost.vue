<template>
	<view id="LOST" :style="'height:'+height+'px'">
		<uni-collapse v-for="(item,index) in lostList" :key="index" accordion="true">
		    <uni-collapse-item :thumb="item.cabinetIcon" :title="item.nameLocker" :show-animation="true">
				<view class="lost-item">处理方: {{item.cabinetAddress}}</view>
				<view class="lost-item" @click="server(item.Tel)">联系方式: {{item.Tel}}</view>
				<view class="lost-item">是否取出: {{item.cabinetType}}</view>
				<view class="lost-item">申请时间: {{item.ForgetDate}}</view>
				<view class="lost-item">取出时间: {{item.outDate}}</view>
				<view class="lost-item">物品备注: {{item.forgetRemark}}</view>
		    </uni-collapse-item>
		</uni-collapse>
	</view>
</template>

<script>
import uniIcon from "@/components/uni-icon/uni-icon.vue";
import uniCollapse from "@/components/uni-collapse/uni-collapse.vue"
import uniCollapseItem from "@/components/uni-collapse-item/uni-collapse-item.vue"
export default {
	components:{
		uniIcon,
		uniCollapse,
		uniCollapseItem
	},
	data() {
		return {
			height:0,
			lostList:[]
		}
	},
	onLoad() {
		this.height = uni.getSystemInfoSync().windowHeight;
		uni.showLoading({mask:true});
		this.getData();
	},
	methods: {
		formatDate(now){ 
			let year=now.getFullYear();
			let month=now.getMonth()+1;
			let date=now.getDate();
			let hour=now.getHours();
			let minute=now.getMinutes();
			let second=now.getSeconds();
			if(month<10){
			month = '0' + month;
			};
			if(date<10){
			date = '0' + date;
			};
			if(hour<10){
			hour = '0' + hour;
			};
			if(minute<10){
			minute = '0' + minute;
			};
			if(second<10){
			second = '0' + second;
			};
			return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
		},
		getData(){
			uni.request({
				url: this.apiServer + 'cabinetRentEmploymentRecord/getCabinetRecordForgeList',
				method: 'POST',
				header:{
					'content-Type': 'application/x-www-form-urlencoded',
					'token': uni.getStorageSync('opid')
				},
				success: (res) => {
					if(res.data.status == 200){
						if(!!res.data.data){
							let data = res.data.data;
							this.lostList = [];
							for(let i=0;i<data.length;i++){
								data[i].ForgetDate = this.formatDate(new Date(data[i].ForgetDate));
								if(data[i].cabinetOut){
									data[i].cabinetIcon = '../../static/lost/ok.png';
									data[i].cabinetType = '已取出';
								}else{
									data[i].cabinetIcon = '../../static/lost/later.png';
									data[i].cabinetType = '未取出';
								};
								this.getTelData(data[i].fkSpaceCharacterNo,data[i]);
							};
						}else{
							uni.showModal({
								title: '提示',
								content: '您无申请的物品遗忘信息',
								confirmText: '返回首页',
								showCancel: false,
								success: function (res) {
									if (res.confirm) {
										uni.navigateBack({url: '../index/index'});
									}
								}
							});
						}
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
		getTelData(No,data){
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
						data.Tel = res.data.data.spaceCharacterMobile;
						this.lostList.push(data);
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
		server(no){
			uni.makePhoneCall({
				phoneNumber: no
			});
		}
	}
}
</script>

<style scoped>
#LOST{
	background-color: #F2F2F2;
	font-size: 0.8em;
}
.lost-item{
	background-color: white;
	padding: 20rpx 30rpx;
	border-top: 1px solid #D7D5DA;
	word-break: break-all;
}
</style>
