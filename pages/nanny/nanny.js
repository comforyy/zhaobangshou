var Bmob = require('../../utils/bmob.js');
var that
var gourmet_address
var demand
var phones
var latitude
var longitude
var home
var time
var data
var area
var kids
var wega
var msg
var STATE_CARSTOP
var classname = 1
var name
Page({

  data: {
    nannyhome: ["住家", "不住家", "均可"],
    indexhome:null ,
    nannyservertime: ["1-3个月", "4-6个月", "7-12个月", "12个月以上"],
    indexserver: null,
    nannydata: ["一周内", "两周内", "一个月内"],
    indexnannydata: null,
    nannyarea: ["90平左右或以下", "90-120平", "120-150平", "150-180平", "180以上"],
    indexarea: null,
    nannykids: ["无", "3岁~6岁", "7岁~9岁", "10岁以上"],
    indexkids: null,
    nannywage: ["4000~6000元", "5000~7000元", "6000~7000元", "7000元以上"],
    indexwage: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
  },
  btnlocal: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        gourmet_address = res.address
        /**
         * latitude = res.latitude;
        longitude = res.longitude;
         */
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
  management: function (p) {
    demand = p.detail.value
  },
  phone:function(ph){
    
    phones = ph.detail.value
    console.log(phones)
  },
  nannyhome: function (nh) {
    
    home = that.data.nannyhome[nh.detail.value]
    that.setData({
      indexhome: nh.detail.value
    })
  },
  nannyservertime: function (nst) {
    time = that.data.nannyservertime[nst.detail.value] 
    that.setData({
      indexserver: nst.detail.value
    })
  },
  nannydata: function (nd) {
    data = that.data.nannydata[nd.detail.value]
    that.setData({
      indexnannydata: nd.detail.value
    })
  },
  nannyarea: function (na) {
    area = that.data.nannyarea[na.detail.value]
    that.setData({
      indexarea: na.detail.value
    })
  },
  nannykids: function (nk) {
    kids = that.data.nannykids[nk.detail.value]
    that.setData({
      indexkids: nk.detail.value
    })
  },
  nannywage: function (nw) {
    wega = that.data.nannywage[nw.detail.value]
    console.log(wega)
    that.setData({
      indexwage: nw.detail.value
    })
  },
  selectmsg: function (st) {
    msg = st.detail.value
  },
  release:function(){
    wx.showLoading({
      title: 'Loading...'
    })
    setTimeout(function(){
      that.postmsg()
    })
  },
  postmsg:function(){
    var currentUser = Bmob.User.current();
    var User = Bmob.Object.extend("_User");
    var UserModel = new User();
    var Diary = Bmob.Object.extend("shared");
    var diary = new Diary();
    diary.set("STATE_CARSTOP", 0);
    diary.set("classname",classname)
    diary.set("gourmet_address", gourmet_address);
    diary.set("demand", demand);
    diary.set("phones",phones);
    diary.set("home", home);
    diary.set("time", time);
    diary.set("data", data);
    diary.set("area", area);
    diary.set("kids", kids);
    diary.set("wage",wega)
    diary.set("msg", msg);
    diary.set("name","共享保姆")
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