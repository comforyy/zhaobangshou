var Bmob = require('../../utils/bmob.js');
var app = getApp();
var nickName;
var Engineer;
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nickName: "",
    avatarUrl: "",
    Engineer: "",

  },
  onLoad: function (v) {
    that = this;
  },

  userInfoHandler: function (e) {
    wx.getSetting({
      success: function (res) {
        that.setData({
          login:1
        })
        var nickName = e.detail.userInfo.nickName
        var avatarUrl = e.detail.userInfo.avatarUrl
        var currentUser = Bmob.User.current();
        var objectId = currentUser.id;
        var User = Bmob.Object.extend("_User");
        var user = new Bmob.Query(User);
        user.get(objectId, {
          success: function (result) {
            result.set('nickName', nickName);
            result.set('avatarUrl', avatarUrl);
            
            result.save();
            wx.navigateTo({
              url: '../../../tbphone/tbphone',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })

          },
          error: function (object, error) {

          }
        });
      },
      fail: function (res) {

      },
      complete: function (res) { },
    })
  },
  tb_phone: function (e) {
    if (nickName == null) {
      return;
    } else {
      wx.navigateTo({
        url: '../../../tbphone/tbphone',
      })
    }
  },
  modinfo: function (f) {
    if (nickName == null) {
      return;
    } else {
      wx.navigateTo({
        url: '../../../modinfo/modinfo',
      })
    }

  },
  attestation: function (f) {
    if (nickName == null) {
      return;
    } else {
      var currentUser = Bmob.User.current();
      var userId = currentUser.id;
      var Identification = Bmob.Object.extend("identification");
      var identification = new Bmob.Query(Identification);
      identification.equalTo("identification", userId);
      // 查询所有数据
      identification.find({
        success: function (results) {
          if (results.length > 0) {
            wx.navigateTo({
              url: 'attestation/msg_success',
              success: function(res) {},
              fail: function(res) {  
              },
              complete: function(res) {},
            })
          } else {
            wx.navigateTo({
              url: '../../../attestation/attestation',
            })
          }
        },
        error: function (error) {
        }
      });
    }

  },
  money:function(){
    wx.navigateTo({
      url: '../../../money/money',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  understand: function () {
    wx.navigateTo({
      url: '../../../understand/understand',
    })
  },
  text: function () {
    wx.navigateTo({
      url: '../Atext/Atext',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  onShow: function () {
    var remove_time = wx.getStorageSync("loginTime")
    var timestamp = new Date().getTime()
    var res = ''
    if (timestamp > remove_time) {
      // 过期
      console.log("过期")
      wx.removeStorageSync("loginMsg")
      that.login()
    } else {
      console.log("从缓存中取出")
      res = wx.getStorageSync("loginMsg")
      nickName = res.nickName;
      Engineer = res.Engineer
      that.setData({
        nickName: res.nickName,
        avatarUrl: res.avatarUrl,
        Engineer: res.Engineer
      })
    }
    
  },
  login:function(){
    var currentUser = Bmob.User.current();
    var objectId = currentUser.id;
    var User = Bmob.Object.extend("_User");
    var user = new Bmob.Query(User);
    user.get(objectId, {
      success: function (result) {
        nickName = result.get('nickName');
        Engineer = result.get("Engineer")
        var avatarUrl = result.get('avatarUrl');
        //写入编号
        if (nickName == null) {
          wx.showToast({
            title: '请登陆',
            image: '../image/error.png',
            duration: 1500
          })
          that.setData({
            login:0
          })
          var User = Bmob.Object.extend("_User");
          var query = new Bmob.Query(User);
          var num = 0;
          query.get(objectId, {
            success: function (result) {
              result.set('Engineer', num);
              result.save();
              // The object was retrieved successfully.
            },
            error: function (object, error) {

            }
          });

        } else if (avatarUrl == null) {
          wx.showToast({
            title: '请登陆',
            image: '../image/error.png',
            duration: 1500
          })
        } else {
          wx.setStorageSync("loginMsg", result)
          var timestamp = new Date().getTime()
          //console.log(timestamp)
          // 设置8小时后过期
          var remove_time = 3600000 * 1 + timestamp
          wx.setStorageSync("loginTime", remove_time)
          if (Engineer == null) {
            that.setData({
              nickName: nickName,
              avatarUrl: avatarUrl,
            })
          } else if (Engineer != null) {
            that.setData({
              nickName: nickName,
              avatarUrl: avatarUrl,
              Engineer: Engineer
            })
          }

        }

      },
      error: function (object, error) {

      }
    });
  },
  onPullDownRefresh:function(){
    that.login()
    wx.stopPullDownRefresh()
  }
})