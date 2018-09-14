var Bmob = require('../../utils/bmob.js');
var that 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oneclickcolor:"#5bb9e9",
    twoclickcolor:"#fff"
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
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    setTimeout(function(){
      var a = 0
      var c = 0
      that.chinckData(a,c)
    })
    that.setData({
      oneclickcolor: "#5bb9e9",
      twoclickcolor: "#fff"
    })
  },

one:function(){
  var aa = that.data.oneclickcolor == '#fff' ? '#5bb9e9' :'#5bb9e9'
that.setData({
  oneclickcolor:aa,
  twoclickcolor:"#fff"
})
  wx.showLoading({
    title: 'Loading...',
    mask: true
  })
  setTimeout(function () {
    var a = 0
    var c = 0
    that.chinckData(a,c)
  })
},
two:function(){
  var aa = that.data.twoclickcolor == '#5bb9e9' ? '#5bb9e9' : '#5bb9e9'
  that.setData({
    twoclickcolor: aa,
    oneclickcolor:"#fff"
  })

  wx.showLoading({
    title: 'Loading...',
    mask: true
  })
  setTimeout(function () {
    var b = 1
    var c = 2
    that.chinckData(b,c)
  })
},
/**
 * 获取数据
 */
chinckData:function(a,c){
  var Diary = Bmob.Object.extend("shared");
  var query = new Bmob.Query(Diary);
  query.equalTo("STATE_CARSTOP", a);
  query.descending("createdAt");
  if(c==2){
    var currentUser = Bmob.User.current();
    
    query.equalTo("suboderUser", currentUser.id);
  }
  query.find({
    success: function (results) {
      that.setData({
        sharedData:results
      })
      wx.hideLoading()
    },
    error: function (error) {
      
      wx.hideLoading()
    }
  });
},

  shared_click:function(e){
    var id = e.currentTarget.dataset.sharedid
    wx.navigateTo({
      url: 'shareddetail/shareddetail?sharedid='+id
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
    wx.stopPullDownRefresh();
    that.onShow()
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