var Bmob = require('../../../utils/bmob.js');
var puoder;
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    puoder:"",
    pick:""
  },
  callPhone:function(e){
    var phone = e.currentTarget.dataset.callphone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    puoder = options.baojieId
    console.log(puoder)
  },
  pucancel:function(){
    wx.reLaunch({
      url: '../../../pages/index/index',
      success: function (res) { }
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
    var User = Bmob.Object.extend("User");
    var user = new Bmob.Query(User);
    user.include("identification")
    user.get(puoder, {
      success: function (result) {
        console.log(result)
        that.setData({
          pick:result
        })
      },
      error: function (result, error) {
        console.log(error)
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