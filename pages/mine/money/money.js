// pages/mine/money/money.js
var Bmob = require('../../../utils/bmob.js');
var that
var mon
var objectId 
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
    that.Wallet()
  },
  Wallet:function(){
    var currentUser = Bmob.User.current();
    objectId = currentUser.id;
    var User = Bmob.Object.extend("_User");
    var user = new Bmob.Query(User);
    user.include("identification")
    user.get(objectId, {
      success: function (result) {
        var iden = result.get("identification")
        if (iden != null) {
         mon = iden.money
          that.setData({
            money:mon
          })
        } else {
          that.setData({
            money: 0
          })
        }
      },
      error: function (object, error) {

      }
    });
  },
  income:function(){
    wx.navigateTo({
      url: 'income/income?moneyId='+objectId,
    })
  },
  gowithdrawal:function(){
    wx.navigateTo({
      url: 'moneydetail/moneydetail?withdrawalId=' + objectId,
    })
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