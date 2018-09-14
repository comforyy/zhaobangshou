var Bmob = require('../../../utils/bmob.js');
var self
var platenumber
var phone
var datatime
var timehour
var plshid
Page({
  /**
   * 页面的初始数据
   * keyboard1:首页键盘,显示省的简称
   * keyboard2:第二页键盘，显示数字和大写字母
   */
  data: {
    isKeyboard: false, //是否显示键盘
    specialBtn: false,
    tapNum: false, //数字键盘是否可以点击
    parkingData: false, //是否展示剩余车位按钮
    isFocus: false, //输入框聚焦
    flag: false, //防止多次点击的阀门
    phoneNumber: '137-14798167',
    keyboardNumber: '1234567890',
    keyboardAlph: 'QWERTYUIOPASDFGHJKL巛ZXCVBNM',
    keyboard1: '京津沪冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤川青藏琼宁渝',
    keyboard2: '',
    keyboard2For: ['完成'],
    keyboardValue: '',
    textArr: [],
    textValue: '',
    telMessage: '请正确输入您的车牌号码，避免停车出现问题'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;
    self.setData({
      adata: options.data
    })
    plshid = options.shid
  },
  /**
   * 输入框显示键盘状态
   */
  showKeyboard: function() {
    var self = this;
    self.setData({
      isFocus: true,
      isKeyboard: true
    });
  },
  /**
   * 点击页面隐藏键盘事件
   */
  hideKeyboard: function() {
    var self = this;
    if (self.data.isKeyboard) {
      //说明键盘是显示的，再次点击要隐藏键盘
      if (self.data.textValue) {
        self.setData({
          isKeyboard: false
        });
      } else {
        self.setData({
          isKeyboard: false,
          isFocus: false
        });
      }
    }
  },
  /**
   * 输入框聚焦触发，显示键盘
   */
  bindFocus: function() {
    self = this;
    if (self.data.isKeyboard) {
      //说明键盘是显示的，再次点击要隐藏键盘
      self.setData({
        isKeyboard: false,
        isFocus: true
      });
    } else {
      //说明键盘是隐藏的，再次点击显示键盘
      self.setData({
        isFocus: true,
        isKeyboard: true
      });
    }
  },
  /**
   * 键盘事件
   */
  tapKeyboard: function(e) {
    var self = this;
    //获取键盘点击的内容，并将内容赋值到textarea框中
    var tapIndex = e.target.dataset.index;
    var tapVal = e.target.dataset.val;
    var keyboardValue;
    var specialBtn;
    var tapNum;
    if (tapVal == '巛') {
      //说明是删除
      self.data.textArr.pop();
      if (self.data.textArr.length == 0) {
        //说明没有数据了，返回到省份选择键盘
        this.specialBtn = false;
        this.tapNum = false;
        this.keyboardValue = self.data.keyboard1;
      } else if (self.data.textArr.length == 1) {
        //只能输入字母
        this.tapNum = false;
        this.specialBtn = true;
        this.keyboardValue = self.data.keyboard2;
      } else {
        this.specialBtn = true;
        this.tapNum = true;
        this.keyboardValue = self.data.keyboard2;
      }
      self.data.textValue = self.data.textArr.join('');
      self.setData({
        textValue: self.data.textValue,
        keyboardValue: this.keyboardValue,
        specialBtn: this.specialBtn,
        tapNum: this.tapNum
      });
      return false;
    }
    if (self.data.textArr.length >= 7) {
      return false;
    }
    self.data.textArr.push(tapVal);
    self.data.textValue = self.data.textArr.join('');
    platenumber = self.data.textValue
    self.setData({
      textValue: self.data.textValue,
      keyboardValue: self.data.keyboard2,
      specialBtn: true
    });
    if (self.data.textArr.length > 1) {
      //展示数字键盘
      self.setData({
        tapNum: true
      });
    }
  },
  /**
   * 特殊键盘事件（删除和完成）
   */
  tapSpecBtn: function(e) {
    var self = this;
    var btnIndex = e.target.dataset.index;
    if (btnIndex == 0) {
      //说明是完成事件
      if (self.data.textArr.length < 7) {
        wx.showToast({
          title: '请输入正确的车牌号',
          icon: 'success',
          mask: true,
          image: '../../images/icon_error.png',
          duration: 2000
        });
      } else {
          this.hideKeyboard()
          
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var self = this;
    //将keyboard1和keyboard2中的所有字符串拆分成一个一个字组成的数组
    self.data.keyboard1 = self.data.keyboard1.split('');
    self.data.keyboard2 = self.data.keyboard2.split('');
    self.setData({
      keyboardValue: self.data.keyboard1
    });
  },
  phone:function(p){
    phone = p.detail.value
  },
  bindDateChange:function(d){
    datatime = d.detail.value
    this.setData({
      date: d.detail.value
    })
  },
  bindTimeChange: function (e) {
    timehour = e.detail.value
    this.setData({
      time: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var self = this;
    self.setData({
      flag: false
    });
  },

suboder:function(so){
  wx.showLoading({
    title: 'Loading...',
    mask: true
  })
  setTimeout(function(){
    var currentUser = Bmob.User.current();
    var User = Bmob.Object.extend("_User");
    var UserModel = new User();
    var Diary = Bmob.Object.extend("shared");
    var query = new Bmob.Query(Diary);
    UserModel.id = currentUser.id
    query.get(plshid, {
      success: function (result) {
        result.set('STATE_CARSTOP', 1);
        result.set('sharedFromId', so.detail.formId);
        result.set("suboderUser", UserModel);
        result.set("platenumber", platenumber)
        result.set("phone", phone)
        result.set("datatime", datatime)
        result.set("timehour", timehour)
        result.save();
        wx.hideLoading()
        wx.reLaunch({
          url: '../../shared/shared'
        })
      },
      error: function (object, error) {
        wx.hideLoading()
      }
    });
  })
},
//接单
pickoder:function(so){
  
}

});