var Tencent = require('../../../utils/qqmap-wx-jssdk.js');
var Bmob = require('../../../utils/bmob.js');
var utils = require('../../../utils/util.js');
var key = "uf5QsNKGT6Cl76_fHDGFL_2tp6p2C2UO"
var Secret = "YOPAe0jZpSts36RtrrfJztJx3L_j8DdS"
var that
var id_address
var id_birthday
var id_gender
var id_card_number
var id_name
var id_race
var issued_by
var valid_date
var id_side
var front
var contrary
var a
var b
var state = 0
var familyName

var appraise = 0 //评价
var industry = 0 //交易
var finish = 0//已完成
var undone = 0//未完成
var value //技能描述
var temp
var data
var idcarId
var money = 0 //金额
Page({

  /**
   * 页面的初始数据
   */
  data: {
    texts: "至少5个字",
    min: 5, //最少字数  
    max: 50, //最多字数 (根据自己需求改变)
  },
  //字数限制    
  inputs: function (e) {
    // 获取输入框的内容  
    value = e.detail.value;
    // 获取输入框内容的长度  
    var len = parseInt(value.length);

    //最少字数限制  
    if (len <= this.data.min)
      this.setData({
        texts: "最少5个字"
      })
    else if (len > this.data.min)
      this.setData({
        texts: " "
      })

    //最多字数限制  
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行  
    this.setData({
      currentWordNumber: len //当前字数    
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
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
   * 正面
   */
  front: function (f) {
    a = f.currentTarget.dataset.front
    wx.chooseImage({
      count: 0,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        var name = utils.getFileName() + ".jpg"; //上传的图片的别名
        var file = new Bmob.File(name, tempFilePaths);
        wx.showLoading({
          title: 'Loading...',
          mask: true
        })
        setTimeout(function () {
          file.save().then(function (res) {


            front = res.url()
            var c = 1
            that.shibie(front, c)
            that.setData({
              front: res.url()
            })
            wx.hideLoading()
          }, function (error) {


          })
        })

      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 反面
   */
  contrary: function (c) {
    b = c.currentTarget.dataset.contrary


    wx.chooseImage({
      count: 0,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        var name = utils.getFileName() + ".jpg"; //上传的图片的别名
        var file = new Bmob.File(name, tempFilePaths);
        wx.showLoading({
          title: 'Loading...',
          mask: true
        })
        setTimeout(function () {
          file.save().then(function (res) {

            contrary = res.url()
            var c = 0
            that.shibie(contrary, c)
            that.setData({
              contrary: res.url()
            })
            wx.hideLoading()
          }, function (error) {

          })
        })

      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  familyName: function (e) {
    familyName = e.detail.value

  },
  /**
   * 
   * wx.navigateTo({
      url: '../../../../skilledness/skilledness'
    })
   */
  idcar: function (idcar) {

    if (familyName == null) {
      wx.showToast({
        title: '姓氏不能为空',
        icon: 'success',
        image: '../../image/error.png',
        duration: 1500
      })
    } else if (id_card_number == null) {
      wx.showToast({
        title: '服务器繁忙',
        icon: 'success',
        image: '../../image/error.png',
        duration: 1500
      })
    } else if (value == null) {
      wx.showToast({
        title: '请描述技能',
        icon: 'success',
        image: '../../image/error.png',
        duration: 1500
      })
    }
    else {
      var currentUser = Bmob.User.current();
      var userId = currentUser.id;
      var User = Bmob.Object.extend("_User");
      var UserModel = new User();
      var Identification = Bmob.Object.extend("identification");
      var identification = new Identification();
      UserModel.id = userId;
      identification.set("identification", UserModel);
      identification.set("state", state)
      identification.set("id_name", id_name)
      identification.set("id_gender", id_gender)
      identification.set("id_card_number", id_card_number)
      identification.set("id_birthday", id_birthday)
      identification.set("issued_by", issued_by)
      identification.set("valid_date", valid_date)
      identification.set("front", front)
      identification.set("contrary", contrary)
      identification.set("money", 0)
      identification.set("familyName", familyName + "师傅")
      
      identification.set("money", money)
      //技能描述
      identification.set("skilledness", value)
      //评价星级
      identification.set("appraise", appraise)
      //交易数量
      identification.set("industry", industry)
      //已完成
      identification.set("finish", finish)
      //未完成
      identification.set("undone", undone)
      //添加数据，第一个入口参数是null
      identification.save(null, {
        success: function (result) {

          identification.id = result.id
          UserModel.set("identification", identification)
          idcarId = result.id
          data = result.createdAt
          UserModel.save(null, {
            success: function (result) {
              wx.redirectTo({
                url: 'msg_success'
              })

              var currentUser = Bmob.User.current();


              temp = {
                "touser": currentUser.get("authData").weapp.openid,
                "template_id": "y7r3WsCcMeMCXhs8C6j3XhKS411Bl6QoSozT7qDgg0s",
                "page": "pages/mine/mine",
                "form_id": idcar.detail.formId,
                "data": {
                  "keyword1": {
                    "value": id_name
                  }, "keyword2": {
                    "value": id_gender
                  }, "keyword3": {
                    "value": "找帮手师傅认证"
                  }, "keyword4": {
                    "value": "待审核"
                  }, "keyword5": {
                    "value": idcarId
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
            },
            error: function (result, error) {
              wx.navigateTo({
                url: 'msg_fail'
              })
            }
          });
        },
        error: function (result, error) { }
      });
    }


  },
  shibie: function (url, c) {
    wx.request({
      url: 'https://api-cn.faceplusplus.com/cardpp/v1/ocridcard',
      data: {
        api_key: key,
        api_secret: Secret,
        image_url: url
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {


        if (c == a) {

          id_address = res.data.cards[0].address
          id_birthday = res.data.cards[0].birthday
          id_gender = res.data.cards[0].gender
          id_card_number = res.data.cards[0].id_card_number
          id_name = res.data.cards[0].name
          id_race = res.data.cards[0].race
          id_side = res.data.cards[0].side
          wx.hideLoading()
        } else if (c == b) {


          issued_by = res.data.cards[0].issued_by
          valid_date = res.data.cards[0].valid_date
          wx.hideLoading()
        }

      }
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