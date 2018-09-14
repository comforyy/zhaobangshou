var Bmob = require('../../utils/bmob.js');
var that
var gourmet_address
var manage
var phones
var times
var prices 
var msg
var latitude
var longitude
var STATE_CARSTOP=0;
var classname = 0
Page({

  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
  },
  btnlocal:function(){
    that.local()
  },
  management:function(m){
    manage = m.detail.value
  },
  phone:function(p){
    phones = p.detail.value
  },
  /**
   *  time:function(t){
    times = t.detail.value
  },
   */
 
  price:function(pr){
    prices = pr.detail.value
  },
  selectmsg:function(se){
    msg = se.detail.value
  },
  bindDateChange:function(b){
    times = b.detail.value
    that.setData({
      date: b.detail.value
    })
  },
  local: function (e) {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        gourmet_address = res.address
         latitude = res.latitude;
        longitude = res.longitude;
        console.log(res)
        that.setData({
          localaddress: gourmet_address
        })
      },
      fail: function (res) {
      },
      complete: function (res) {
      },
    })
  },
  release:function(){
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    setTimeout(function(){
      that.addData()
    })
  },
  /**
   * 添加数据
   */
  addData:function(){
    var currentUser = Bmob.User.current();
    var User = Bmob.Object.extend("_User");
    var UserModel = new User();
    var Diary = Bmob.Object.extend("shared");
    var diary = new Diary();
    diary.set("STATE_CARSTOP", 0);
    diary.set("classname",classname);
    diary.set("gourmet_address", gourmet_address);
    diary.set("manage", manage);
    diary.set("phones", phones);
    diary.set("times", times);
    diary.set("prices", prices);
    diary.set("times", times);
    diary.set("msg", msg);
    diary.set("name","共享车位")
      UserModel.id = currentUser.id;
      diary.set("sharedUser", UserModel);
    
    diary.save(null, {
      success: function (result) {
        wx.hideLoading()
        wx.reLaunch({
          url: '../../pages/shared/shared'
        })
      },
      error: function (result, error) {
        wx.hideLoading()
        console.log('创建日记失败');

      }
    });
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