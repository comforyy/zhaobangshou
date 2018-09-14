var Bmob = require('../../utils/bmob.js');
var getDistance = require('../../utils/distance.js').getDistance;
var that;
var latitude; //纬度
var longitude; //经度
var Engineer;

var bcity; //城市
var bjurisdiction; //辖区
var bprovince; //省份
var bcityId; //城市id

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var that;
Page({
  data: {
    AllOderList: {},
    waitOder: {},
    orderList: {},
    tabs: ["待雇佣", "服务中", "已完成","未完成", "已失效"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },
  onLoad: function() {
    that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function(e) {
    if (e.currentTarget.id == 0) {
      wx.showLoading({
        title: 'Loading...',
        mask: true
      })
      setTimeout(function () {
        that.onShow()
        wx.hideLoading()
      })
    } else if (e.currentTarget.id == 1) {
      wx.showLoading({
        title: 'Loading...',
        mask: true
      })
      setTimeout(function() {
        that.servicing();
        wx.hideLoading()
      })
    } else if (e.currentTarget.id == 2) {
      wx.showLoading({
        title: 'Loading...',
        mask: true
      })
      setTimeout(function() {
        that.finish();
        wx.hideLoading()
      })
    } else if (e.currentTarget.id == 3) {
      that.afsales()
    } else if (e.currentTarget.id == 4){
      that.invalid()
    }
    that.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  //服务中状态
  servicing: function() {
    var currentUser = Bmob.User.current();
    var Hire = Bmob.Object.extend("hire");
    var query = new Bmob.Query(Hire);
    var isme = new Bmob.User();
    isme.id = currentUser.id;
    if (Engineer == 0) {
      query.equalTo("userOder", isme);
      query.descending('createdAt');
      query.include("EnuserOder");
      query.include("userOder");

      query.find({
        success: function(results) {
          wx.hideLoading()
          that.setData({
            bpickupList: results
          })

        },
        error: function(error) {
          console.log("查询失败: " + error.code + " " + error.message);
        }
      });
    } else if (Engineer != 0) {

      query.equalTo("EnuserOder", isme);
      query.descending('createdAt');
      query.include("EnuserOder");
      query.include("userOder");
      query.find({
        success: function(results) {
          wx.hideLoading()
          that.setData({
            EnOder: results
          })
        },
        error: function(error) {
          console.log("查询失败: " + error.code + " " + error.message);
        }
      });
    }
  },
  //已完成状态
  finish: function() {
    var currentUser = Bmob.User.current();
    var Complete = Bmob.Object.extend("complete"); //==================订单是否完成表
    var complete = new Bmob.Query(Complete);
    var isme = new Bmob.User();
    isme.id = currentUser.id;
    if (Engineer == 0) {
      complete.equalTo("userid", isme);
      complete.descending('createdAt');
      complete.include("enuserid");
      complete.include("userid");

      complete.find({
        success: function(results) {
          wx.hideLoading()
          console.log(results)
          that.setData({
            usercomplete: results
          })
        },
        error: function(error) {
          console.log("查询失败: " + error.code + " " + error.message);
        }
      });
    } else if (Engineer != 0) {

      complete.equalTo("enuserid", isme);
      complete.descending('createdAt');
      complete.include("enuser");
      complete.include("userid");
      complete.find({
        success: function(results) {
          wx.hideLoading()
          that.setData({
            Encomplete: results
          })
        },
        error: function(error) {
          console.log("查询失败: " + error.code + " " + error.message);
        }
      });
    }
  },
  //未完成订单
  afsales:function(){
    var currentUser = Bmob.User.current();
    var invalidId = currentUser.id;
    console.log(invalidId)
    var Aftersales = Bmob.Object.extend("aftersales");
    var aftersales = new Bmob.Query(Aftersales);
    if(Engineer>0){
        aftersales.equalTo("START_ODER", 1);
      aftersales.equalTo("enuserid", invalidId);
    }else{
      aftersales.equalTo("START_ODER", 1);
      aftersales.equalTo("userid", invalidId);
    }
    
    // 查询所有数据
    aftersales.find({
      success: function (results) {
        console.log(results.length)
        that.setData({
          invalid: results
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  },
  unfinish:function(un){
    var id = un.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../../unfinished/unfinished?id='+id
    })
  },
  //已过时
  invalid: function() {
    var currentUser = Bmob.User.current();
    var invalidId = currentUser.id;

    var Oder = Bmob.Object.extend("Oder");
    var oder = new Bmob.Query(Oder);
    oder.equalTo("invalid", 0);
    oder.equalTo("own", invalidId);
    // 查询所有数据
    oder.find({
      success: function(results) {
        console.log(results.length)
        that.setData({
          eninvalid: results
        })
      },
      error: function(error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });


  },
  //反馈
  ufeedback: function(id) {
    console.log(id)
    wx.navigateTo({
      url: '../../../hfeedback/hfeedback?hireid=' + id.currentTarget.dataset.hireid +
        "&enuseroderid=" + id.currentTarget.dataset.enuseroderid + "&useroderid=" +
        id.currentTarget.dataset.useroderid
    })
  },
  //待雇佣
  onShow: function() {
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    setTimeout(function() {
      var currentUser = Bmob.User.current();
      var userId = currentUser.id;
      var User = Bmob.Object.extend("_User");
      var user = new Bmob.Query(User);
      user.get(userId, {
        success: function(result) {
          Engineer = result.get("Engineer")
          latitude = result.get("latitude");
          longitude = result.get("longitude")
          bcityId = result.get("cityid")
          if (Engineer != 0) {
            //工程师全部订单
            var Oder = Bmob.Object.extend("Oder");
            var oder = new Bmob.Query(Oder);
            oder.equalTo("cityid", bcityId);
            oder.equalTo("STATE_ODER", 0);
            
            oder.include("own")
            oder.notEqualTo("invalid", 0);
            oder.descending('createdAt');
            // 查询所有数据
            oder.find({
              success: function(results) {
                console.log(results)
                wx.hideLoading()
                that.setData({
                  AllOderList: results
                })
              },
              error: function(error) {
                console.log("查询失败: " + error.code + " " + error.message);
              }
            });
          } else {
            //用户个人订单
            var objectId;
            var currentUser = Bmob.User.current();
            objectId = currentUser.id;
            var Oder = Bmob.Object.extend("Oder");
            var query = new Bmob.Query(Oder);
            var isme = new Bmob.User();
            isme.id = objectId;
            query.equalTo("own", isme);
            query.equalTo("STATE_ODER", 0);
            query.descending('createdAt');
            query.include("own");
            query.notEqualTo("invalid", 0);
            // 查询所有数据
            //query.limit(that.data.limit);
            query.find({
              success: function(results) {
                console.log(results)
                wx.hideLoading()
                that.setData({
                  orderList: results
                })
              },
              error: function(error) {
                console.log("查询失败: " + error.code + " " + error.message);
              }
            });
          }


          that.setData({
            Engineer: Engineer
          })


        },
        error: function(result, error) {}
      });
    })
  },
  //进入详情
  goOderDetail: function(g) {
    var id = g.currentTarget.dataset.goobject
    wx.navigateTo({
      url: 'wait-detail/wait-detail?goObject=' + id
    })
  },
  //删除
  del: function(d) {
    wx.showLoading({
      title: '删除中',
      mask: true
    })
    setTimeout(function() {

      var oderid = d.currentTarget.dataset.delid;
      var Oder = Bmob.Object.extend("Oder");
      var deloder = new Bmob.Query(Oder);
      deloder.get(oderid, {
        success: function(object) {
          // The object was retrieved successfully.
          object.destroy({
            success: function(deleteObject) {
              that.onShow();
              wx.hideLoading()
            },
            error: function(object, error) {
              console.log('删除日记失败');
            }
          });
        },
        error: function(object, error) {
          console.log("query object fail");
        }
      });
    }, 2000)


  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log("=====onHide")
    Engineer = 0
  },
  //服务中详情页面
  clickserver: function(id) {
    console.log(id.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../../../server-detail/server-detail?serverid=' +id.currentTarget.dataset.id
    })
  },
  //已完成详情页面
  serverFin:function(id){
    wx.navigateTo({
      url: '../../../server-finish/server-finish?finishid=' + id.currentTarget.dataset.finish
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log("=====onUnload")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
    that.servicing();
    that.finish();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  lower: function() {
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    setTimeout(function() {
      wx.hideLoading()
    }, 1000)
  },
  callPhone: function(Up) {
    var phone = Up.currentTarget.dataset.callphone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  Enphone: function(Ep) {
    var phone = Ep.currentTarget.dataset.userphone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  HePhone: function(Ehp) {
    var phone = Ehp.currentTarget.dataset.hephone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  click:function(e){
    var currentUser = Bmob.User.current();
    var formId =e.detail.formId
    var openid = currentUser.get("authData").weapp.openid
    console.log(openid)
    Bmob.Cloud.run('mobu', {}, {
      success: function (result) {
        console.log(result);
      },
      error: function (error) {
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})    