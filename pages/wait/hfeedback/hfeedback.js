// pages/mine/pickupwait/feedback/feedback.js
var Bmob = require('../../../utils/bmob.js');
var utils = require('../../../utils/util.js');
var oderId;
var that;
var feedbackPro;
var star;
var START_ODER;
var flag = 5;
var hireid; //订单ID
var enuseroderid //工程师ID
var useroderid //用户ID
var select; //问题选项
var picurl; //图片url
var price; //价格
var special; //特别描述
var currentId; //当前ID
var identification //写入订单信息
var appraise //评价
var industry //交易
var iden_star //获取的星星
var finish //已完成
var undone //未完成
var address; //地址
var detailed; //详细地址
var data;//发布时间
var phone//电话
var hephone//他／她的电话
var files = [];//图片地址
var mon //总金额
var a //历史金额
var order_no
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{
      name: 0,
      value: '已完成'
    },
    {
      name: 1,
      value: '未完成'
    }
    ],
    feedback: "",
    flag2: 5,
    files: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    that = this;
    hireid = options.hireid
    useroderid = options.useroderid
    enuseroderid = options.enuseroderid
    var currentUser = Bmob.User.current();
    currentId = currentUser.id
    if (currentId == useroderid) {
      var id = 0;
      that.setData({
        id: id
      })
    } else if (currentId == enuseroderid) {
      var id = 1;
      that.setData({
        id: id
      })
    }
    var Hire = Bmob.Object.extend("hire");
    var hire = new Bmob.Query(Hire);
    hire.get(hireid, {
      success: function (result) {
        select = result.get("MSselect")
        special = result.get("Special")
        picurl = result.get("picurls")
        price = result.get("price")
        
        address = result.get("address")
        detailed = result.get("detailed")
        data = result.get("data")
        phone = result.get("userphone")
        hephone= result.get("hePhonel")
        order_no = result.get("payId")
        console.log("============="+order_no)
      },
      error: function (object, error) {
        // 查询失败
      }
    });
  },


  changeColor11: function () {
    var that = this;
    that.setData({
      flag2: 1
    });
    flag = 1
  },
  changeColor12: function () {
    var that = this;
    that.setData({
      flag2: 2
    });
    flag = 2
  },
  changeColor13: function () {
    var that = this;
    that.setData({
      flag2: 3
    });
    flag = 3
  },
  changeColor14: function () {
    var that = this;
    that.setData({
      flag2: 4
    });
    flag = 4
  },
  changeColor15: function () {
    var that = this;
    that.setData({
      flag2: 5
    });
    flag = 5
  },

  feedbackPro: function (e) {
    feedbackPro = e.detail.value
  },
  radioChange(e) {
    START_ODER = e.detail.value
        that.setData({
          no:START_ODER
        })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   * 
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   * 
   */
  onShow: function () {
    that.resFee()
    var User = Bmob.Object.extend("_User");
    var user = new Bmob.Query(User);
    user.include("identification");
    user.get(enuseroderid, {
      success: function (result) {
        identification = result.get("identification").objectId
      },
      error: function (object, error) {
        
      }
    });
  },
  /**
   * 是否重复评价
   */
resFee:function(){
  var Diary = Bmob.Object.extend("hire");
  var query = new Bmob.Query(Diary);
  query.get(hireid, {
    success: function (result) {
    },
    error: function (object, error) {
      wx.redirectTo({
        url: 'msg_success'
      })
    }
  });
},
  /**
   * 退款
   */
  
  /**
   * 提交评价
   */
  submitFeedback: function () {
    if (feedbackPro == null) {
      wx.showToast({
        title: '问题不能为空',
        image: '../../image/error.png',
        duration: 1500
      })
    }else if(files.length==0){
      wx.showToast({
        title: '至少一张图片哟',
        image: '../../image/error.png',
        duration: 1500
      })
    } else if (START_ODER == null) {
      wx.showToast({
        title: '请选择订单状态',
        image: '../../image/error.png',
        duration: 1500
      })
    } else {
      wx.showLoading({
        title: 'Loading...',
        mask: true
      })
      setTimeout(function () {
        that.createComplete()
        wx.reLaunch({
          url: '../../../pages/wait/wait'
        })
      })
    }
  },
  /**
   * 创建已完成表complete
   */
  createComplete: function () {
    var User = Bmob.Object.extend("_User");
    var userid = new User; //用户ID
    var enuserid = new User; //工程师ID
    if(START_ODER==1){
      var Complete = Bmob.Object.extend("aftersales");
    }else{
      var Complete = Bmob.Object.extend("complete");
    }
    var complete = new Complete();
    userid.id = useroderid;
    enuserid.id = enuseroderid;
    complete.set("userid", userid);
    complete.set("enuserid", enuserid);
    complete.set("Special", special)
    complete.set("MSselect", select)
    complete.set("picurls", picurl)
    complete.set("price", price)
    complete.set("star", flag)
    complete.set("feedbackPro", feedbackPro)
    complete.set("START_ODER", parseInt(START_ODER))
    complete.set("address",address)
    complete.set("detailed",detailed)
    complete.set("data",data)
    complete.set("userphone",phone)
    complete.set("hePhone",hephone)
    complete.set("feedbackImg",files)
    complete.set("payId", order_no)
    complete.save(null, {
      success: function (result) {
        that.gain()
        that.delHire()
      },
      error: function (result, error) {
        console.log(error)
        wx.showToast({
          title: '系统繁忙',
          image: '../../image/error.png',
          duration: 1500
        })
      }
    });
  },
  /**
   * 获取评价信息identification
   */
  gain: function () {
    var Identification = Bmob.Object.extend("identification");
    var iden = new Bmob.Query(Identification);
    console.log(identification)
    iden.get(identification, {
      success: function (result) {
        console.log(START_ODER)
        if (START_ODER == 0) {
          finish = result.get("finish") + 1
          undone = result.get("undone")
          a = result.get("money")
          mon = a + parseFloat(price)
        } else if (START_ODER == 1) {
          undone = result.get("undone") + 1
          finish = result.get("finish")
        }
        appraise = result.get("appraise") + flag
        industry = result.get("industry") + 1
        console.log(industry)
        result.set('finish', finish);
        result.set('undone', undone);
        result.set('appraise', appraise);
        result.set('industry', industry);
        result.set("hisOneMoney",a)
        result.set("money",mon)
        result.save();
        console.log(industry)
        wx.hideLoading()
        that.delHire()
      },
      error: function (object, error) {
        console.log(error)
      }
    });
  },
  /***
   * 删除hire，服务中单号
   */
  delHire: function () {
    var Hire = Bmob.Object.extend("hire");
    var hire = new Bmob.Query(Hire);
    hire.get(hireid, {
      success: function (object) {
        // The object was retrieved successfully.
        object.destroy({
          success: function (deleteObject) {
            wx.hideLoading()
            wx.redirectTo({
              url: 'msg_success'
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
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        if (tempFilePaths.length > 0){
          for (var i = 0; i < tempFilePaths.length; i++) {
            var name = utils.getFileName() + i + ".jpg";//上传的图片的别名
            var file = new Bmob.File(name, [tempFilePaths[i]]);
            //console.log(name, tempFilePaths[i])
            file.save().then(function (res) {
              console.log('upload ok', res.url());
              if (res.url()) {
                files.push(res.url());
              }
            }, function (error) {
              console.log('upload fail', error);
            })
          }
        }
          that.setData({
            files: that.data.files.concat(res.tempFilePaths)
          });
        
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
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
    feedbackPro = null
    star = null
    START_ODER = null
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