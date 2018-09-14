var Bmob = require('../../../utils/bmob.js');
var userOder;
var that;
var count;
var own;//普通用户ID
var pickoder;//工程师ID
var price;//价格
var MSselect;//问题选项
var Special;//特殊要求
var picurls;//图片地址
var userphone
var hePhone
var address
var data
var sex
var detailed
Page({
  /**
   * 页面的初始数据
   */
  data: {
    progress_txt: '正在查询报价...',
    count: 0, // 设置 计数器 初始为0
    countTimer: null ,// 设置 定时器 初始为null
    userOder:""
  },
  drawProgressbg: function () {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg')
    ctx.setLineWidth(4);// 设置圆环的宽度
    ctx.setStrokeStyle('#5BB9E9'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath();//开始一个新的路径
    ctx.arc(110, 110, 100, 0, 2 * Math.PI, true);
    //设置一个原点(100,100)，半径为90的圆的路径到当前路径
    ctx.stroke();//对当前路径进行描边
    ctx.draw();
  },
  drawCircle: function (step) {
    var context = wx.createCanvasContext('canvasProgress');
    // 设置渐变
    var gradient = context.createLinearGradient(200, 100, 100, 200);
    gradient.addColorStop("0", "#0250c5");
    gradient.addColorStop("0.5", "#8523A9");
    gradient.addColorStop("1.0", "#d43f8d");
    context.setLineWidth(10);
    context.setStrokeStyle(gradient);
    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(110, 110, 100, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    context.stroke();
    context.draw()
  },
  countInterval: function () {
    // 设置倒计时 定时器 每100毫秒执行一次，计数器count+1 ,耗时6秒绘一圈
    that.countTimer = setInterval(() => {
      if (that.data.count <= 1000) {
        /* 绘制彩色圆环进度条 
        注意此处 传参 step 取值范围是0到2，
        所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2
        */
        that.drawCircle(that.data.count / (1000 / 2))
        if (that.data.count==250){
            that.onPrice()
        } else if (that.data.count == 500){
          that.onPrice()
        } else if (that.data.count == 850) {
          that.onPrice()
        }
        that.data.count++;
      }
      else {
        that.setData({
          progress_txt: "在线报价结束"
        });
        clearInterval(that.countTimer);
      }
    }, 100)
  },
  onPrice:function(){
    var Bidding = Bmob.Object.extend("bidding");
    var bidding = new Bmob.Query(Bidding);
    bidding.equalTo("NowoderId", userOder);
    bidding.include("bpickupId");
    bidding.include("pickupId");
    bidding.include("identification");
    // 查询所有数据
    bidding.find({
      success: function (results) {
        console.log(results)
        that.setData({
          enLineList: results,
          progress_txt: "已有" + results.length + "人报价"
        })
      },
      error: function (error) {
        wx.showToast({
          title: '服务器错误',
          icon: 'fail',
          image: '../../../image/error.png',
          duration: 1500
        })
      }
    });
  },
  onLoad: function (options) {
    that = this
  userOder = options.userOder
  return;
  },

  Pay: function () {
    
  },
  pu_oder: function (b) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    setTimeout(function () {
      var AUserOder = Bmob.Object.extend("_User");
      var auserOder = new AUserOder;//用户ID
      pickoder = b.currentTarget.dataset.pickoder//工程师id
      own = b.currentTarget.dataset.own//用户ID
      price = b.currentTarget.dataset.price//价格
      var Oder = Bmob.Object.extend("Oder");
      var oder = new Bmob.Query(Oder);
      var currentUser = Bmob.User.current();
      var PayOpenId = currentUser.get("authData").weapp.openid
      //parseFloat(price)
      Bmob.Pay.wechatPay(0.01, MSselect, Special, PayOpenId).then(function (resp) {
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

            var EnuserOder = new AUserOder;
            var Hire = Bmob.Object.extend("hire");
            var hire = new Hire();
            hire.set("price", price);
            auserOder.id = own;
            hire.set("userOder", auserOder);//用户ID
            EnuserOder.id = pickoder;
            hire.set("EnuserOder", EnuserOder);//工程师ID
            hire.set("MSselect", MSselect);//选项信息
            hire.set("Special", Special);//选项信息
            hire.set("picurls", picurls);//描述图片
            hire.set("userphone", userphone); //用户手机号码
            hire.set("hePhonel", hePhone); //他／ 她的手机号码
            hire.set("address", address); //地址
            hire.set("detailed", detailed) //详细地址
            hire.set("data", data) //创建日期
            hire.set("payId", orderId) //创建日期
            hire.save(null, {
              success: function (result) {
                var Oder = Bmob.Object.extend("Oder");
                var oder = new Bmob.Query(Oder);
                oder.get(userOder, {
                  success: function (object) {
                    // The object was retrieved successfully.
                    object.destroy({
                      success: function (deleteObject) {
                        wx.hideLoading()
                        wx.reLaunch({
                          url: '../../wait/stay-wait/stay-wait?baojieId=' + pickoder,
                        })
                      },
                      error: function (object, error) {
                        console.log('删除日记失败');
                      }
                    });
                  },
                  error: function (object, error) {
                    console.log("query object fail");
                  }
                });

              },
              error: function (result, error) {
              }
            });

          },
          'fail': function (res) {
            wx.reLaunch({
              url: '../../../pages/wait/wait'
            })
          }
        })

      }, function (err) {
        console.log('服务端返回失败');
        console.log(err);
      });
    })

  },

  onShow:function(){
    var Oder = Bmob.Object.extend("Oder");
    var oder = new Bmob.Query(Oder);
    oder.get(userOder, {
      success: function (result) {
        MSselect = result.get("options")
        Special = result.get("special")
        picurls = result.get("pic_url")
        userphone = result.get("userphone");
        hePhone = result.get("hePhonel")
        address = result.get("address");
        data = result.updatedAt;
        sex = result.get("sex");
        detailed = result.get("detailed");
        that.setData({
          oderRe:result
        })
      },
      error: function (result, error) {
        
      }
    });
  },
  /**
   * 用户取消订单则删除
   */
  canceloder:function(){
  console.log("cancel===="+userOder)
  var Oder = Bmob.Object.extend("Oder");
  var oder = new Bmob.Query(Oder);
  oder.get(userOder, {
    success: function (object) {
      // The object was retrieved successfully.
      object.destroy({
        success: function (deleteObject) {
          console.log("删除成功")
          wx.reLaunch({
            url: '../../../pages/index/index'
          })
        },
        error: function (object, error) {
          console.log('删除日记失败');
        }
      });
    },
    error: function (object, error) {
      wx.reLaunch({
        url: '../../../pages/index/index'
      })
    }
  });

  },
  comeback:function(){
    wx.reLaunch({
      url: '../../../pages/index/index'
    })
  },
  onReady: function () {
    that.drawProgressbg();
    //this.drawCircle(2)
    that.countInterval()
  }
})