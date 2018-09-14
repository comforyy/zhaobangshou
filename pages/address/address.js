// pages/address/address.js
let plugin = requirePlugin("myPlugin")
let routeInfo
var enla
var enlo
var enadname
var longitude
var latitude
var that
wx.getLocation({
  type: '',
  altitude: true,
  success: function(res) {},
  fail: function(res) {},
  complete: function(res) {},
})
Page({
  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    enla = options.la
    enlo = options.lo
    enadname = options.adname
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: function (res) {
        console.log(111111)
        latitude = res.latitude
        longitude = res.longitude
        if (latitude != null) {
          routeInfo = {
            startLat: res.latitude,    //起点经度 选填
            startLng: res.longitude,    //起点纬度 选填
            startName: "我的位置",   // 起点名称 选填
            endLat: enla,    // 终点经度必传
            endLng: enlo,  //终点纬度 必传
            endName: enadname,  //终点名称 必传
            mode: "car"  //算路方式 选填
          }
          that.setData({
            routeInfo: routeInfo
          })
        } else {
          wx.showLoading({
            title: '加载中',
            mask: true
          })
          setTimeout(function(){
            
          },2000)
        }


      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      
  }
})