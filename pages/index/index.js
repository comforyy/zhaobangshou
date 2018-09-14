//index.js
//获取应用实例
var Bmob = require('../../utils/bmob.js');
var Tencent = require('../../utils/qqmap-wx-jssdk.js');
var app = getApp()
var that;
var address;
var map;
Page({
  data: {
    img_urls: [
      "http://bmob-cdn-17927.b0.upaiyun.com/2018/05/28/defa21e440429c9c80ee8654223dc500.jpg",
      "http://bmob-cdn-17927.b0.upaiyun.com/2018/05/28/2313d76840f0f28880b748e4b7eb8476.jpg"
    ],
    interval: 5000,
    duration: 2000,
    contents: [0, 1, 2, 3, 4, 5],
    isRequest: true
  },
  /**
   *  var version = Bmob.Object.extend("version");
    var query = new Bmob.Query(version);
    query.get("VBGh444L", {
      success: function(result) {
        var title = result.get("title");
      },
      error: function(object, error) {
        // 查询失败
      }
    });
   */
  onLoad: function() {
    that = this
    that.Splash()
    map = new Tencent({
      key: 'VH5BZ-2EO6F-CR4JC-NUOCL-5ZQ7S-SWFTC' // 必填
    });
  },
  onShow: function() {
    that.Splash()
    that.address()
  },
  address: function() {
    var remove_time = wx.getStorageSync("addressTime")
    var timestamp = new Date().getTime()
    var res = ''
    if (timestamp > remove_time) {
      // 过期
      console.log("过期")
      wx.removeStorageSync("addressTime");
      wx.removeStorageSync("address")
      console.log("111111111"+remove_time)
      that.getAddress()
    } else {
      console.log("从缓存中取出")
      res = wx.getStorageSync("address")
      that.setData({
        address: res.result.address
      })
    }
  },
  getAddress: function() {
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: function(res) {
        console.log("22222222")
        map.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(addressRes) {
            wx.getStorage({
              key: 'address',
              success: function(res) {
                
              },
              fail: function(res) {
                
              },
              complete: function(res) {
                wx.setStorageSync("address", addressRes)
                var timestamp = new Date().getTime()
                var remove_time = 3600000 * 1 + timestamp
                wx.setStorageSync("addressTime", remove_time)
                var address = addressRes.result.formatted_addresses.recommend;
                that.setData({
                  address: address
                })
                wx.hideLoading()
              },
            })
          }
        })
      },
      fail: function(res) {
        console.log("333333333"+res.getAddress)
        wx.showModal({
          title: '警告',
          content: '如果你拒绝授权地址见不能正常使用本程序',
          showCancel: true,
          success: function(res) {
            if (res.confirm) {
              wx.openSetting({
                success: function(res) {
                  if (res.authSetting["scope.userLocation"] == true) {
                    wx.getLocation({
                      type: 'gcj02',
                      altitude: true,
                      success: function(res) {
                        map.reverseGeocoder({
                          location: {
                            latitude: res.latitude,
                            longitude: res.longitude
                          },
                          success: function(addressRes) {
                            wx.setStorageSync("address", addressRes)
                            var timestamp = new Date().getTime()
                            var remove_time = 3600000 * 1 + timestamp
                            wx.setStorageSync("addressTime", remove_time)
                            var address = addressRes.result.formatted_addresses.recommend;
                            that.setData({
                              address: address
                            })
                            wx.hideLoading()
                          }
                        })
                      },
                      fail: function(res) {},
                      complete: function(res) {},
                    })
                  }
                },
                fail: function(res) {},
                complete: function(res) {},
              })
            }
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      },
    })
  },
  clickAddress: function() {
    wx.showLoading({
      title: '重新获取位置...',
      mask: true
    })
    setTimeout(function() {
      wx.removeStorageSync("address")
      var res = ''
      that.getAddress()
    })

  },
  Splash: function(S) {
    wx.getNetworkType({
      success: function(res) {
        
        if (res.networkType === "none") {
          wx.showToast({
            title: '无网络状态',
            icon: 'success',
            image: '../image/error.png',
            duration: 1500
          })
          wx.hideTabBar({
            aniamtion: true
          })
          that.setData({
            network: 1
          })
        } else {
          that.setData({
            network: 0
          })
          wx.showTabBar({
            aniamtion: true
          })
        }
      }
    })

  },
  weixiu: function(v) {
    wx.navigateTo({
      url: '../weixiu/weixiu',
    })
  },
  anzhuang: function(v) {
    wx.navigateTo({
      url: '../anzhuang/anzhuang',
    })
  },
  qingjie: function(v) {
    wx.navigateTo({
      url: '../qingjie/qingjie',
    })

  },
  banyun: function(v) {
    wx.navigateTo({
      url: '../banyun/banyun',
    })
  },
  zhuangxiu: function(v) {
    wx.navigateTo({
      url: '../zhuangxiu/zhuangxiu',
    })
  },
  kaisuo: function(v) {
    wx.navigateTo({
      url: '../huansuo/huansuo',
    })
  },
  zhineng: function(z) {
    wx.navigateTo({
      url: '../zhineng/zhineng',
    })
  },
  modi: function(m) {
    wx.navigateTo({
      url: '../modi/modi',
    })
  },
  parking: function (p) {
    wx.navigateTo({
      url: '../parking/parking',
    })
  },
  nanny:function(){
    wx.navigateTo({
      url: '../nanny/nanny'
    })
  },
  gengduo: function(v) {
    wx.navigateTo({
      url: '../more/more',
    })
  },
  onPullDownRefresh: function() {
    that.Splash()
    that.getAddress()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  onShareAppMessage:function(){
    return {
      title: '微信小程序联盟',
      desc: '最具人气的小程序开发联盟!',
      path: '/pages/index/index'
    }
  }
})