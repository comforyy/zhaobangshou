var Bmob = require('../../../utils/bmob.js');
var shId
var that
var userid
var classname
var datas
Page({
  data: {

  },
  onLoad: function (options) {
    shId = options.sharedid
    that = this
  },
  onShow: function () {
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    setTimeout(function () {
      that.chickData()
    })
  },
  chickData: function () {
    var Diary = Bmob.Object.extend("shared");
    var query = new Bmob.Query(Diary);
    query.get(shId, {
      success: function (result) {
        classname = result.get("classname")
        datas = result.get("times")
        that.setData({
          sharedDetail: result
        })
        userid = result.get("sharedUser").id
        wx.hideLoading()
      },
      error: function (object, error) {
        wx.hideLoading()
      }
    });
  },
  callphone: function (ca) {
    //console.log(ca)
    wx.makePhoneCall({
      phoneNumber: ca.currentTarget.dataset.phoneid
    })
  },
  suboder:function(so){
    var currentUser = Bmob.User.current();
    var User = Bmob.Object.extend("_User");
    var UserModel = new User();
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    setTimeout(function(){
      if(userid ==currentUser.id){
        wx.hideLoading()
        wx.showToast({
          title: '您是雇主',
          icon: 'success',
          image: '../../image/error.png',
          duration: 1500
        })
    }else if(classname == 0){
        wx.hideLoading()
        wx.navigateTo({
          url: 'carplate?data='+datas+'&shid='+shId
        })
    }
      else if (userid != currentUser.id){
        var Diary = Bmob.Object.extend("shared");
        var query = new Bmob.Query(Diary);
        UserModel.id = currentUser.id
        query.get(shId, {
          success: function (result) {
            result.set('STATE_CARSTOP', 1);
            result.set('sharedFromId', so.detail.formId);
            result.set("suboderUser", UserModel);
            result.save();
            wx.hideLoading()
            wx.reLaunch({
              url: '../../shared/shared'
            })
          },
          error: function (object, error) {
          }
        });
    }
    })
  }
})