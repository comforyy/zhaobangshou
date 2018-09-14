// pages/wait/unfinished/unfinished.js
var Bmob = require('../../../utils/bmob.js');
var unfinishId
var that
var order_no
var enuserid;
var currentId
var price
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
    unfinishId = options.id
  },

/**
 * 查询未完成订单详情
 */
  unfinish:function(){
    var Diary = Bmob.Object.extend("aftersales");
    var query = new Bmob.Query(Diary);
    query.include("enuserid.identification");
    query.include("enuserid");
    query.get(unfinishId, {
      success: function (result) {
        order_no = result.get("payId")
        that.setData({
          unfinish:result,
        })
      },
      error: function (object, error) {
        // 查询失败
      }
    });

  },
  submit:function(){
    wx.showLoading({
      title: '正在处理中',
      mask: true
    })
    setTimeout(function(){
      var res = {
      "order_no":order_no,
      "refund_fee": 0.01,
      "desc": "退款",
    }
    Bmob.refund(res).then(function (obj) {
      console.log(obj)
      var Diary = Bmob.Object.extend("aftersales");
      var query = new Bmob.Query(Diary);
      query.get(unfinishId, {
        success: function (result) {
          result.set('pay', 1);
          result.save();
          wx.showToast({
            title: '退款成功',
            image: '../../../image/success.png',
            duration: 1500,
            mask: true,
          })
          wx.hideLoading()
          wx.reLaunch({
            url: '../../../pages/wait/wait'
          })
          // The object was retrieved successfully.
        },
        error: function (object, error) {

        }
      });
    },
      function (err) {
        console.log('失败了', err)
        var Diary = Bmob.Object.extend("aftersales");
        var query = new Bmob.Query(Diary);
        query.get(unfinishId, {
          success: function (result) {
            wx.hideLoading()
            wx.showToast({
              title: '退款失败',
              image: '../../../image/error.png',
              duration: 1500,
              mask: true,
            })
            result.set('pay', 0);
            result.save();
            wx.hideLoading()
            // The object was retrieved successfully.
          },
          error: function (object, error) {

          }
        });
      });
    })
    
  },
  checkUser:function(){
    var currentUser = Bmob.User.current();
    currentId = currentUser.id
    var Diary = Bmob.Object.extend("_User");
    var query = new Bmob.Query(Diary);
    query.get(currentId, {
      success: function (result) {
        var enid = result.get("Engineer");
        console.log("==========="+enid)
        that.setData({
          enUser:enid
        })
      },
      error: function (object, error) {
        // 查询失败
      }
    });
  },
  price: function (e) {
    price = e.detail.value;
    console.log(price)
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
  that.unfinish()
    that.checkUser()
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