var Bmob = require('../../../utils/bmob.js');
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
  onLoad: function(options) {
    that = this
  },
  back: function() {
    wx.reLaunch({
      url: '../../../pages/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    var currentUser = Bmob.User.current();
    var userId = currentUser.id;
    var Identification = Bmob.Object.extend("identification");
    var identification = new Bmob.Query(Identification);
    identification.equalTo("identification", userId);
    // 查询所有数据
    identification.find({
      success: function(results) {
        that.setData({
          identification:results
        })
      },
      error: function(error) {}
    });

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})