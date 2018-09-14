// pages/add/add.js
var app = getApp();
var Bmob = require('../../utils/bmob.js');
var utils = require('../../utils/util.js');
var headurlIndex = 0;
var geopoint = null;
var avatarurl;//头像
var urls = [];//图片地址
var address;//地址
var detailed;//详细地址
var userphone;//手机号码
var name;//称呼名字
var Special = "";//特殊要求

var select;//选择项信息
var sex;//性别
var latitude;//纬度
var longitude;//经度
var headurl = "";
var that;
var oderid;
var MAX_PIC_LENGTH = 3;

var Engineer;//工程师id

var u_name;
var u_address;
var u_phone;
var hePhone;

var bcity;//城市
var bjurisdiction;//辖区
var bprovince;//省份
var bcityId;//城市id

var timestamp;//时间戳
var temp
var data
var fId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: null,
    total_pics_number: MAX_PIC_LENGTH,
    avatarurl: "",
    name: "",
    address: "",
    detailed: "",
    userphone: "",
    select: "",
    
    oderid: "",
    urls: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    select = options.select
    that.setData({
      select: options.select
    })
  },
  onShow:function(){

    timestamp = Date.parse(new Date());
    
    timestamp = timestamp / 1000;

    var currentUser = Bmob.User.current();
    console.log(currentUser)
    var userId = currentUser.id;
    var User = Bmob.Object.extend("_User");
    var user = new Bmob.Query(User);
    user.get(userId, {
      success: function (result) {
        Engineer = result.get("Engineer")
        u_name = result.get("nickName");
        u_address = result.get("address");
        u_phone = result.get("phone");
        hePhone = result.get("hePhonel");
        sex = result.get("sex")
        avatarurl = result.get("avatarUrl")
        detailed = result.get("detailed")
        latitude = result.get("latitude");
        longitude = result.get("longitude");
        bprovince = result.get("province")
        bcity = result.get("city")
        bjurisdiction = result.get("jurisdiction")
        bcityId = result.get("cityid")
        if (Engineer != 0 && Engineer != null) {
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
  onUnload: function () {
    urls = [];
  },
  Special: function (e) {
    Special = e.detail.value
  },

  add: function () {
    var that = this;
    if (urls.length == MAX_PIC_LENGTH) {
      utils.showModal('最多添加' + MAX_PIC_LENGTH + '张图片哟！！！')
      return;
    }

    wx.chooseImage({
      count: MAX_PIC_LENGTH - urls.length, // 最多MAX_PIC_LENGTH张图片
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // 获取成功,将获取到的地址赋值给临时变量
        var tempFilePaths = res.tempFilePaths;
        if (tempFilePaths.length > 0) {
          for (var i = 0; i < tempFilePaths.length; i++) {
           
            console.log("uploading...")
            var name = utils.getFileName() + i + ".jpg";//上传的图片的别名
            var file = new Bmob.File(name, [tempFilePaths[i]]);
            //console.log(name, tempFilePaths[i])
            file.save().then(function (res) {
              console.log('upload ok', res.url());
              if (res.url()) {
                urls.push(res.url());
              }
              //
              headurl = urls.length > 0 ? urls[0] : "";
              that.setData({
                urls: urls
                , headurl: headurl
                , show_headurl: headurl == "" ? false : true
              })   
              //
            }, function (error) {
              console.log('upload fail', error);
            })
          }
        }
      },
    })
  }
  //preview imgs
  , preview: function () {
    if (urls.length == 0) return;
    wx.previewImage({
      current: urls[0], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  }
  , edit:function(ed){
    wx.navigateTo({
      url: '/pages/mine/modinfo/modinfo'
    })
  }
  , release: function (v) {
      if (u_address==null) {
      wx.showToast({
        title: '请设置地址',
        icon: 'success',
        image: '../image/error.png',
        duration: 1500
      })
    } else if (Engineer != 0 && Engineer != null){
      wx.showToast({
        title: '工程师不能发布',
        icon: 'fail',
        image: '../image/error.png',
        duration: 1500
      })
    }
    else{
      wx.showLoading({
        title: 'Loading...',
        mask:true
      })
      setTimeout(function () {
        fId = v.detail.formId;
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
      oder.set("latitude", latitude);
      oder.set("longitude", longitude);
      oder.set("pic_url", urls);
      oder.set("special", Special);
      oder.set("options", select);
      oder.set("STATE_ODER", 0);
      oder.set("timestamp",timestamp);//时间戳
      oder.set("fromId", fId);//保存表单id，有效期7天
    //  城市
      //oder.set("province", bprovince)
      oder.set("city", bcity)
     // oder.set("jurisdiction", bjurisdiction)
      oder.set("cityid", bcityId)

      
      if (currentUser) {
        UserModel.id = currentUser.id;
        oder.set("own", UserModel);
        oder.save(null, {
          success: function (result) {
            oderid = result.id;
            data = result.createdAt
            //that.mbSuccess(v)
            that.setData({
              oderid: oderid
            })
            wx.hideLoading()
            //url: '../add/oder-release/oder-release?userOder=' + oderid
            wx.reLaunch({
              url: '../add/oder-release/oder-release?userOder=' + oderid,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          },
          error: function (result, error) {
            wx.showToast({
              title: '服务器错误',
              icon: 'fail',
              image: '../image/error.png',
              duration: 1500
            })
          }
        });
      }
      }) 
    }
  }
  ,mbSuccess:function(v){
    var currentUser = Bmob.User.current();
    temp = {
      "touser": currentUser.get("authData").weapp.openid,
      "template_id": "-xKKRoe7ARywOz_rAJG5BlhrmaXrxVJtbJHEdVRftr4",
      "page": "pages/wait/wait",
      "form_id": v.detail.formId,
      "data": {
        "keyword1": {
          "value": u_name
        }, "keyword2": {
          "value": "订单已发布"
        }, "keyword3": {
          "value": oderid
        }, "keyword4": {
          "value": select+Special
        }, "keyword5": {
          "value": data
        }, "keyword6": {
          "value": "您的信息已提交我们会尽快审核您的信息，请耐心等候，谢谢！"
        },
      },
      "emphasis_keyword": "keyword1.DATA"
    }
    Bmob.sendMessage(temp).then(function (obj) {
      console.log('发送成功')
    },
      function (err) {
        console.log(err)
      });
  }
})