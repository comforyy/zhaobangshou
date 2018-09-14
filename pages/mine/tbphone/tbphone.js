var Bmob = require('../../../utils/bmob.js');
var userphone;
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tbphone: "",
    userphone: ""
  },
  onLoad: function (options) {
    that = this
  },
  onShow:function(){
    var currentUser = Bmob.User.current().id;
    var User = Bmob.Object.extend("User");
    var query = new Bmob.Query(User);
    query.get(currentUser, {
      success: function (result) {
        userphone = result.get("phone");
        if (userphone == null) {
          return;
        } else {
          that.setData({
            userphone: userphone
          })
        }
      },
      error: function (result, error) {
        console.log("查询失败");
      }
    });
  },
  listenerPhoneInput: function (e) {
    that.data.tbphone = e.detail.value;
  },

  sure_mod: function (v) {
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    setTimeout(function(){
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (that .data.tbphone == 0) {
      wx.showToast({
        title: '输入的手机号为空',
        icon: 'fail',
        image: '../../image/error.png',
        duration: 1500
      })
      wx.hideLoading()
      return false;
    } else if (that.data.tbphone.length < 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'success',
        image: '../../image/error.png',
        duration: 1500
      })
      wx.hideLoading()
      return false;
    } else if (!myreg.test(that.data.tbphone)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'success',
        image: '../../image/error.png',
        duration: 1500
      })
      wx.hideLoading()
      return false;
    } else {
      /**绑定手机号码 */
      var currentUser = Bmob.User.current().id;
      var tbphone = that.data.tbphone;
      var User = Bmob.Object.extend("User");
      var query = new Bmob.Query(User);

      // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
      query.get(currentUser, {
        success: function (result) {

          // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
          result.set('phone', tbphone);
          result.save();
          //wx: wx.navigateBack({
            //delta: 1,
          //})
          that.onShow()
          wx.hideLoading()
        },
        error: function (object, error) {
          wx.hideLoading()
        }
      });

    }
    })
    
  }
})