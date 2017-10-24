/**
 * @fileOverview 微信小程序的入口文件
 */
//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index');
var config = require('./config');

App({
    /**
     * 小程序初始化时执行，我们初始化客户端的登录地址，以支持所有的会话操作
     */
    onLaunch() {
        qcloud.setLoginUrl(config.service.loginUrl);
    }
    
    //1、系统事件部分
    onLaunch:function(){//小程序初始化时执行
    	var that=this;
    	that.curid=wx.getStorageSync('curid')||that.curid;//API：获取本地缓存，若不存在设置为全局属性
    	that.setlocal('curid',that.curid);//调用全局方法
    },
    //2、自定义全局方法部分
    setlocal:function(id,val){
    	wx.setStorageSync(id,val);//API:设置本地缓存
    },
    //3、自定义全局属性部分
    curid:"CN101010100",
    version:"1.0"
    
});