// pages/modi/modi.js
var Bmob = require('../../utils/bmob.js');
var getDistance = require('../../utils/distance.js').getDistance;
var that;
var star_a
var star_b
var end_c
var end_d
var distance
var Engineer
var u_name
var u_address
var u_phone
var hePhone
var sex
var avatarurl
var detailed
var bprovince
var bcity
var bjurisdiction
var bcityId
var waitOder = false;//状态
var oderid;
var special;
var user_address;
var urls = ["http://bmob-cdn-17927.b0.upaiyun.com/2018/06/20/5a2b19134025c6ca8091c6aa5f2e3b37.jpg"]
var timestamp;//时间戳
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
    that = this;
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
    timestamp = Date.parse(new Date());

    timestamp = timestamp / 1000;

    distance = getDistance(star_b, star_a
      , end_d, end_c)
    that.setData({
      distance: distance
    })
    var currentUser = Bmob.User.current();
    var userId = currentUser.id;
    var User = Bmob.Object.extend("_User");
    var user = new Bmob.Query(User);
    user.get(userId, {
      success: function (result) {
        Engineer = result.get("Engineer")
        u_name = result.get("nickName");

        u_phone = result.get("phone");
        hePhone = result.get("hePhonel");
        sex = result.get("sex")
        avatarurl = result.get("avatarUrl")
        detailed = result.get("detailed")
        bprovince = result.get("provi nce")
        bcity = result.get("city")
        bjurisdiction = result.get("jurisdiction")
        bcityId = result.get("cityid")
        user_address = result.get("address")
        if (u_name == null) {
          wx.showToast({
            title: '请登陆',
            icon: 'fail',
            image: '../image/error.png',
            duration: 1500
          })
        } else if (u_phone == null) {
          wx.showToast({
            title: '请绑定手机',
            icon: 'fail',
            image: '../image/error.png',
            duration: 1500
          })
        }
        else if (user_address == null) {
          wx.showToast({
            title: '请设置用户地址',
            icon: 'fail',
            image: '../image/error.png',
            duration: 1500
          })
        }
        else if (Engineer != 0 && Engineer != null) {
          wx.showToast({
            title: '工程师不能发布',
            icon: 'fail',
            image: '../image/error.png',
            duration: 1500
          })
        }
        else {
          wx.showLoading({
            title: 'Loading...',
            mask: true
          })
          setTimeout(function () {

            var currentUser = Bmob.User.current().id;
            var User = Bmob.Object.extend("User");
            var query = new Bmob.Query(User);
            console.log(currentUser)
            query.get(currentUser, {
              success: function (result) {
                console.log(result)
                that.setData({
                  message: result

                })
              },
              error: function (result, error) {
                console.log("查询失败");
              }
            });
            wx.hideLoading()
          })
        }
      },
      error: function (result, error) {
      }
    });
  },
  selectstar: function (star) {
    wx.chooseLocation({
      success: function (res) {
        star_a = res.longitude //经度
        star_b = res.latitude  //纬度
        u_address = res.address
        that.setData({
          star: res.address
        })
      },
      fail: function (res) {
      }
    })
  },
  selectend: function (end) {
    wx.chooseLocation({
      success: function (res) {
        end_c = res.longitude
        end_d = res.latitude
        special = res.address
        that.setData({
          end: res.address
        })
      },
      fail: function (res) {
      }
    })
  },
  release: function (v) {

    if (u_name == null) {
      wx.showToast({
        title: '请登陆',
        icon: 'success',
        image: '../image/error.png',
        duration: 1500
      })
    } else if (u_address == null) {
      wx.showToast({
        title: '请设置地址',
        icon: 'success',
        image: '../image/error.png',
        duration: 1500
      })
    } else if (special == null) {
      wx.showToast({
        title: '请设置地址',
        icon: 'success',
        image: '../image/error.png',
        duration: 1500
      })
    }
    else if (u_phone == null) {
      wx.showToast({
        title: '请绑定手机',
        icon: 'success',
        image: '../image/error.png',
        duration: 1500
      })
    } else if (u_address == null) {
      wx.showToast({
        title: '请设置地址',
        icon: 'success',
        image: '../image/error.png',
        duration: 1500
      })
    }
    else if (Engineer != 0 && Engineer != null) {
      wx.showToast({
        title: '工程师不能发布',
        icon: 'fail',
        image: '../image/error.png',
        duration: 1500
      })
    }
    else {

      wx.showLoading({
        title: 'Loading...',
        mask: true
      })

      setTimeout(function () {
        var currentUser = Bmob.User.current();
        var User = Bmob.Object.extend("_User");
        var UserModel = new User();
        var Oder = Bmob.Object.extend("Oder");
        var oder = new Oder();
        oder.set("avatarUrl", avatarurl);
        oder.set("name", u_name);
        oder.set("sex", sex);
        oder.set("userphone", u_phone);
        oder.set("hePhonel", hePhone);
        oder.set("address", u_address);
        oder.set("detailed", detailed);
        oder.set("latitude", star_b);
        oder.set("longitude", star_a);
        oder.set("end_latitude", end_d);
        oder.set("end_longitude", end_c);
        oder.set("options", "搭乘摩托车");
        oder.set("special", special);
        oder.set("pic_url", urls);
        //  城市
        //oder.set("province", bprovince)
        oder.set("city", bcity)
        // oder.set("jurisdiction", bjurisdiction)
        oder.set("cityid", bcityId)
        oder.set("timestamp", timestamp);//时间戳
        //oder.set("waitOder", waitOder)
        if (currentUser) {
          UserModel.id = currentUser.id;
          oder.set("own", UserModel);
          oder.save(null, {
            success: function (result) {
              wx.hideLoading()
              oderid = result.id;
              that.setData({
                oderid: oderid
              })
              //url: '../add/oder-release/oder-release?userOder=' + oderid
              wx.reLaunch({
                url: '../add/oder-release/oder-release?userOder=' + oderid,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
            },
            error: function (result, error) {
              console.log(error)
            }
          });
        } else {
          wx.showToast({
            title: '错误',
            icon: 'success',
            image: '../image/error.png',
            duration: 1500
          })
          wx.hideLoading()
        }
      })
    }
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