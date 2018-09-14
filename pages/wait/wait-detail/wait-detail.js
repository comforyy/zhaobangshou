var Bmob = require('../../../utils/bmob.js');
var getDistance = require('../../../utils/distance.js').getDistance;
var Tencent = require('../../../utils/qqmap-wx-jssdk.js');
var imageUtil = require('../../../utils/util.js');
var OdrtId; //订单ID
var that;
var detail;
var detailTit;
var avatarurl; //头像 
var urls = []; //图片地址
var address; //地址
var detailed; //详细地址
var userphone; //手机号码
var hePhone; //他/她的手机号码
var name; //称呼名字
var Special = ""; //特殊要求
var userId; //工程师ObjectId
var select; //选择项信息
var data; //创建日期
var sex;
var own;
var oderUserid; //发布需求用户的ID
var Engineer; //工程师编号
var latitude; //纬度
var longitude; //经度
var bcity; //城市
var bcityId; //城市id
var re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/ 
var baojieId; //报价工程师的ID
var baojiePrice = 0; //价格
var timestamp; //时间戳
var time
var identification //实名ID
var a
var b
var openid
var temp
var id_name
var price_data//报价时间
var fId;//表单ID
var orderId//支付完成订单ID
var money //支付报价钱
var hireId //hireId
var j
var bdfromid
var openidEn
Page({
  data: {
    detail: "",
    url: {},
    obId: "",
    imagewidth: 0, //缩放后的宽
    imageheight: 0, //缩放后的高
  },

  onLoad: function (options) {
    OdrtId = options.goObject,
      console.log(OdrtId)
    that = this
  },
  /**
   * 报价
   */
  submit: function (sub) {
    console.log(sub.detail.formId)
    if (that.data.price == null) {
      wx.showToast({
        title: '价格不能唯空',
        image: '../../image/error.png',
        duration: 1500
      })
    } else if (!re.test(that.data.price)) {
      wx.showToast({
        title: '请输入数字',
        image: '../../image/error.png',
        duration: 1500
      })
    } else {
      var userMon = Bmob.Object.extend("_User");
      var uoderId = Bmob.Object.extend("Oder");
      var Iden = Bmob.Object.extend("identification");

      var currentUser = Bmob.User.current();
      var pickupId = new userMon();
      var bpickupId = new userMon();
      var NowoderId = new uoderId();
      var Identi = new Iden()
      //创建类和实例
      var Bidding = Bmob.Object.extend("bidding"); //===================竞价表
      var bid = new Bidding();
      pickupId.id = currentUser.id; //工程师ID
      bid.set("pickupId", pickupId);
      bpickupId.id = oderUserid; //用户ID
      bid.set("bpickupId", bpickupId);
      NowoderId.id = OdrtId; //订单ID
      bid.set("NowoderId", NowoderId);
      Identi.id = identification
      bid.set("identification", Identi); //实名ID
      bid.set("price", that.data.price)
      bid.set("bidformid", sub.detail.formId)
      bid.set("enopenid", openid)
      //添加数据，第一个入口参数是null
      bid.save(null, {
        success: function (result) {
          price_data = result.createdAt
          that.mbMessage(fId,openid)
          that.onShow()
        },
        error: function (result, error) {
          console.log(error)
        }
      });
    }
  },
  /**
   * mbmsg:function(){
    console.log(fId)
    console.log(openid)
    Bmob.Cloud.run('mobu', { "formId": fId, "openid": openid }, {
      success: function (result) {
        console.log(result);
      },
      error: function (error) {
      }
    })
  },
   */

  price: function (e) {
    that.data.price = e.detail.value;
  },
  /**
   * 雇佣
   */
  pu_oder: function (b) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    setTimeout(function () {

      if (oderUserid != userId) {
        wx.showToast({
          title: '你不是雇主哟',
          image: '../../image/error.png',
          duration: 1500
        })
      } else if (name == null) {
        wx.showToast({
          title: '请登陆',
          image: '../../image/error.png',
          duration: 1500
        })
      } else {
        var Oder = Bmob.Object.extend("Oder");
        var oder = new Bmob.Query(Oder);
        var currentUser = Bmob.User.current();
        var PayOpenId = currentUser.get("authData").weapp.openid
        //parseFloat(baojiePrice)
        Bmob.Pay.wechatPay(0.01, select, Special, PayOpenId).then(function (resp) {
          console.log(resp);
          that.setData({
            loading: true,
            dataInfo: resp
          })
          //服务端返回成功
          var timeStamp = resp.timestamp,
            nonceStr = resp.noncestr,
            packages = resp.package,
            orderId = resp.out_trade_no,//订单号，如需保存请建表保存。
            sign = resp.sign;
          //发起支付
          wx.requestPayment({
            'timeStamp': timeStamp,
            'nonceStr': nonceStr,
            'package': packages,
            'signType': 'MD5',
            'paySign': sign,
            'success': function (res) {
              
              var UserOder = Bmob.Object.extend("_User");
              var userOder = new UserOder; //用户ID
              baojieId = b.currentTarget.dataset.pickoder //工程师id
              baojiePrice = b.currentTarget.dataset.price //价格
              bdfromid = b.currentTarget.dataset.bfid //通知报价人
              openidEn = b.currentTarget.dataset.enopenid //通知报价人
              console.log("支付openID====" + openidEn)
              var EnuserOder = new UserOder;
              var Hire = Bmob.Object.extend("hire"); //====================雇佣表
              var hire = new Hire();
              hire.set("price", baojiePrice);
              userOder.id = oderUserid;
              hire.set("userOder", userOder); //用户ID
              EnuserOder.id = baojieId;
              hire.set("EnuserOder", EnuserOder); //工程师ID
              hire.set("MSselect", select); //选项信息
              hire.set("Special", Special); //选项信息
              hire.set("picurls", urls); //描述图片
              hire.set("userphone", userphone); //用户手机号码
              hire.set("hePhonel", hePhone); //他／ 她的手机号码
              hire.set("address", address); //地址
              hire.set("detailed", detailed) //详细地址
              hire.set("data", data) //创建日期
              hire.set("payId", orderId) //支付单号
              hire.save(null, {
                success: function (result) {
                  that.mbMessage(bdfromid, openidEn)
                  hireId = result.id
                  var Oder = Bmob.Object.extend("Oder");
                  var oder = new Bmob.Query(Oder);
                  oder.get(OdrtId, {
                    success: function (result) {
                      result.set('STATE_ODER', 1);
                      result.save();
                      wx.redirectTo({
                        url: 'msg_success'
                      })
                      wx.hideLoading()
                    },
                    error: function (object, error) {
                    }
                  });
                },
                error: function (result, error) {
                  console.log(error)
                }
              });
            },
            'fail': function (res) {
              oder.get(OdrtId, {
                success: function (result) {
                  result.set('STATE_ODER', 0);
                  result.save();
                },
                error: function (object, error) {
                }
              });
            }
          })

        }, function (err) {
          console.log('服务端返回失败');
          console.log(err);
        });
      }
    })
  },
  /**
   *   assss: function () {
    var Oder = Bmob.Object.extend("Oder");
    var oder = new Bmob.Query(Oder);
    var currentUser = Bmob.User.current();
    var PayOpenId = currentUser.get("authData").weapp.openid
    //parseFloat(baojiePrice)
    Bmob.Pay.wechatPay(0.01, select, Special, PayOpenId).then(function (resp) {
      console.log(resp);
      that.setData({
        loading: true,
        dataInfo: resp
      })
      //服务端返回成功
      var timeStamp = resp.timestamp,
        nonceStr = resp.noncestr,
        packages = resp.package,
        orderId = resp.out_trade_no,//订单号，如需保存请建表保存。
        sign = resp.sign;
      //发起支付
      wx.requestPayment({
        'timeStamp': timeStamp,
        'nonceStr': nonceStr,
        'package': packages,
        'signType': 'MD5',
        'paySign': sign,
        'success': function (res) {
          console.log(res)
          that.payNum(orderId)
          wx.redirectTo({
            url: 'msg_success'
          })
        },
        'fail': function (res) {
          oder.get(OdrtId, {
            success: function (result) {
              result.set('STATE_ODER', 0);
              result.save();
            },
            error: function (object, error) {
            }
          });
        }
      })

    }, function (err) {
      console.log('服务端返回失败');
      console.log(err);
    });
  },
   */

  payNum: function (num) {
    var Payhire = Bmob.Object.extend("hire");
    var query = new Bmob.Query(Payhire);
    query.get(hireId, {
      success: function (result) {
        result.set('orderId', num);
        result.save();
      },
      error: function (object, error) {

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
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    setTimeout(function () {
      that.qmyselfId()
      that.qoder()
      that.qbidmoney()
    })


  },
  //查询当前ID
  qmyselfId: function () {
    //自己的ID
    var currentUser = Bmob.User.current();
    userId = currentUser.id;
    var User = Bmob.Object.extend("_User");
    var user = new Bmob.Query(User);
    user.include("identification")
    user.get(userId, {
      success: function (result) {
        Engineer = result.get("Engineer"); //工程师
        latitude = result.get("latitude"); //经纬度
        longitude = result.get("longitude");
        bcity = result.get("city"); //城市
        bcityId = result.get("cityid");
        var iden = result.get("identification")
        if (iden != null) {
          identification = iden.objectId
          id_name = iden.familyName
        } else {

        }

        that.setData({
          Engineer: Engineer
        })
        wx.hideLoading()
      },
      error: function (result, error) {

      }
    });
  },
  //查询当前订单
  qoder: function () {
    //查询订单
    var Oder = Bmob.Object.extend("Oder");
    //创建查询对象，入口参数是对象类的实例
    var query = new Bmob.Query(Oder);
    query.include("own");
    //查询单条数据，第一个参数是这条数据的objectId值
    query.get(OdrtId, {
      success: function (result) {
        //设置缓存
        //wx.setStorageSync("oderdetail", result)
        var timestamp = new Date().getTime()
        //console.log(timestamp)
        // 设置1小时后过期
        var remove_time = 3600000 * 1 + timestamp
        wx.setStorageSync("oderdetailTime", remove_time)
        own = result.get("own");
        openid = own.authData.weapp.openid //获取openid
        console.log(openid)
        oderUserid = own.objectId;
        avatarurl = result.get("avatarUrl");
        detailed = result.get("detailed");
        name = result.get("name");
        select = result.get("options");
        urls = result.get("pic_url");
        Special = result.get("special");
        userphone = result.get("userphone");
        hePhone = result.get("hePhonel")
        address = result.get("address");
        data = result.updatedAt;
        sex = result.get("sex");
        timestamp = result.get("timestamp"); //发布时间
        a = result.get("latitude")
        b = result.get("longitude")
        fId = result.get("fromId")//获取表单ID
        //计算距离位置
        var distance = getDistance(latitude, longitude, result.get("latitude"), result.get("longitude"))

        var modi = getDistance(result.get("end_latitude"), result.get("end_longitude"), result.get("latitude"), result.get("longitude"))
        //计算时间
        time = imageUtil.dateStr(timestamp)
        console.log(time)
        that.setData({
          detail: result,
          url: result.attributes.pic_url,
          OdrtId: OdrtId,
          distance: distance,
          modi: modi
        })
      },
      error: function (object, error) {

      }
    });
  },
  //查询报价
  qbidmoney: function () {
    //查询报价信息
    var bidd = Bmob.Object.extend("bidding");
    var qdidd = new Bmob.Query(bidd);
    qdidd.equalTo("NowoderId", OdrtId);
    qdidd.include("pickupId");
    qdidd.include("NowoderId");
    qdidd.include("bpickupId");
    qdidd.include("identification");
    // 查询所有数据
    qdidd.find({
      success: function (results) {
        for(var i=0;i<results.length;i++){
          console.log(results[i].get("pickupId").authData.weapp.openid)
        }
        var Oder = Bmob.Object.extend("Oder");
        var query = new Bmob.Query(Oder);
        query.get(OdrtId, {
          success: function (result) {
            result.set('offer', results.length);
            result.set('invalid', time)
            result.save();
            wx.hideLoading()
          },
          error: function (object, error) { }
        });
        for (var i = 0; i < results.length; i++) {
          if (results[i].get("pickupId").objectId == userId) { //已经报价的隐藏报价框
          
            that.setData({
              aa: results[i].get("pickupId").objectId
            })
          }
        }
        that.setData({
          bidding: results
        })

      },
      error: function (error) {

      }
    });
  },
  callPhone: function (call) {
    var phone = call.currentTarget.dataset.callphone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  EnMessage: function (enmsg) {
    wx.navigateTo({
      url: '../enmsg/enmsg?enmsg=' + enmsg.currentTarget.dataset.enmsgobid + "&a=" + a + "&b=" + b
    })
  },
  goaddress: function (ad) {
    wx.navigateTo({
      url: '../../address/address?la=' + a + "&lo=" + b + "&adname=" + address
    })
  },

  /**
   * 发送模版消息
   */
  mbMessage: function (sub,uopenid) {
    console.log("支付完成enopenid====="+uopenid)
    temp = {
      "touser": uopenid,
      "template_id": "nGah6D86RwYUGRu6BSKVXl-UQtxrqPib4V6vMMwK_rk",
      "page": "pages/wait/wait",
      "form_id": sub,
      "data": {
        "keyword1": {
          "value": select
        }, "keyword2": {
          "value": OdrtId
        }
      },
      "emphasis_keyword": "keyword1.DATA"
    }
    Bmob.sendMessage(temp).then(function (obj) {
      console.log('发送成功')
    },
      function (err) {
        console.log(err)
      });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("=====onHide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("=====onUnload")
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