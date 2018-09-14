var Bmob = require('../../../../utils/bmob.js');
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var that
var incomeId

Page({
  data: {
    tabs: ["收入", "提现","退款"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },
  onLoad: function (options) {
    that = this;
    incomeId = options.moneyId
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  onShow:function(){
    that.complete()
    that.aftersales()
    that.withdrawal()
  },
/**
 * 收入明细
 */
  complete:function(){
    var Diary = Bmob.Object.extend("complete");
    var query = new Bmob.Query(Diary);
    query.equalTo("enuserid", incomeId);
    query.include("enuserid")
    query.find({
      success: function (results) {
        that.setData({
          income:results
        })
      },
      error: function (error) {
        
      }
    });
  },
  /**
   * 提现
   */
  withdrawal: function(){
    var Diary = Bmob.Object.extend("withdrawal");
    var query = new Bmob.Query(Diary);
    query.equalTo("enuser", incomeId);
    query.include("enuser")
    query.find({
      success: function (results) {
        that.setData({
          withdrawal: results
        })
      },
      error: function (error) {
      }
    });
  },
/**
 * 退款
 */
  aftersales:function(){
    var Diary = Bmob.Object.extend("aftersales");
    var query = new Bmob.Query(Diary);
    query.equalTo("enuserid", incomeId);
    query.include("enuserid")
    query.find({
      success: function (results) {
        that.setData({
          aftersales: results
        })
      },
      error: function (error) {
      }
    });
  }
});