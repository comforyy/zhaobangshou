// pages/wait/server-finish/server-finish.js
var Bmob = require('../../../utils/bmob.js');
var finishid
var that
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
  finishid = options.finishid
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
      title: '加载中',
      mask: true
    })
    setTimeout(function () {
      that.finishDetail()
    })
  },
  finishDetail: function () {
    var Complete = Bmob.Object.extend("complete");
    var query = new Bmob.Query(Complete);
    query.include("enuserid.identification");
    query.get(finishid, {
      success: function (result) {
        console.log(result)
        that.setData({
          finish: result
        })
        wx.hideLoading()
      },
      error: function (result, error) {

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