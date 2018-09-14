// pages/wait/enmsg/enmsg.js
var Bmob = require('../../../utils/bmob.js');
var getDistance = require('../../../utils/distance.js').getDistance;
var enmsg
var that
var a
var b
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
    enmsg = options.enmsg
    a=options.a
    b=options.b
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
    wx.showLoading({
      title: 'Loading',
      mask: true
    })
    setTimeout(function(){
      that.enmsgdetail()
    })
    
  },

  //获取师傅详情
  enmsgdetail: function () {
    var Identification = Bmob.Object.extend("identification");
    var identification = new Bmob.Query(Identification);
    identification.include("identification")
    identification.get(enmsg, {
      success: function (result) {
        var iden = result.get("identification")
        var distance = getDistance(a, b, iden.latitude, iden.longitude)
        that.setData({
          enmsg: result,
          distance:distance
        })
        wx.hideLoading()
      },
      error: function (result, error) {
        wx.showToast({
          title: '服务器繁忙',
          icon: 'fail',
          image: '../../image/error.png',
          duration: 1500
        })
      }
    });
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