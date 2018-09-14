// pages/mine/money/moneydetail/moneydetail.js
var Bmob = require('../../../../utils/bmob.js');
var that
var moneyId
var mon
var money
var iden
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
    moneyId = options.withdrawalId
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
  that.withdrawal()
  },
  withdrawal:function(){
    var User = Bmob.Object.extend("_User");
    var user = new Bmob.Query(User);
    user.include("identification")
    user.get(moneyId, {
      success: function (result) {
        that.setData({
          msg:result
        })
        iden = result.get("identification")
        if (iden != null) {
          mon = iden.money
          that.setData({
            money: mon
          })
        } else {
          that.setData({
            money: 0
          })
        }
      },
      error: function (object, error) {
      }
    });
  },
  changeMoney: function (e) {
    money = e.detail.value;
  },
  formSubmit:function(){
    if(money>mon){
      wx.showToast({
        title: '最多'+mon+"元噢!",
        image: '../../../image/error.png',
        duration: 1500
      })
    }else if(money<100){
      wx.showToast({
        title:"不能少于100元噢！",
        image: '../../../image/error.png',
        duration: 1500
      })
    }else{
      wx:wx.showLoading({
        title: '正在处理中',
        mask: true,
      })
      setTimeout(function(){
        that.aa()
      })   
    }
  },
  //修改余额
  aa:function(){
    if (iden != null) {
      var Diary = Bmob.Object.extend("identification");
      var query = new Bmob.Query(Diary);
      query.get(iden.objectId, {
        success: function (result) {
        
          result.set('money', mon-money);
          result.save();
          that.bb()
        },
        error: function (object, error) {
          console.log(error)
        }
      });
    } else {
      wx.showToast({
        title: "服务器错误",
        image: '../../../image/error.png',
        duration: 1500
      })
    }
  },
  //生成提现单号
  bb:function(){
    //创建类和实例
    var Diary = Bmob.Object.extend("withdrawal");
    var diary = new Diary();
    var currentUser = Bmob.User.current();
    var User = Bmob.Object.extend("_User");
    var UserModel = new User();
    UserModel.id = currentUser.id;
    diary.set("first",mon);
    diary.set("money", money);
    diary.set("enuser", UserModel);
    diary.set("State_oder", 0);
    diary.set("last", mon-money);
    diary.save(null, {
      success: function (result) {
        wx.hideLoading()
        wx.showToast({
          title: "申请成功",
          image: '../../../image/success.png',
          duration: 1500
        })
        that.onShow()
      },
      error: function (result, error) {
      }
    });
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