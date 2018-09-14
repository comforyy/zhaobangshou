var Bmob = require('../../../utils/bmob.js');
var address = require('../../../utils/city.js')
var gourmet_address = "";//地址
var detailed = "";//详细地址
var name = "";//昵称
var email = "";//邮箱
var hePhonel="";//她/他的电话
var radio = "";//sex
var latitude;//纬度
var longitude;//经度
var bcity;//城市
var bjurisdiction;//辖区
var bprovince;//省份
var bcityId;//城市id
var animation
Page({
  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '先生', value: '男' },
      { name: '女士', value: '女', checked: 'true' }
    ],
    menuType: 0,
    begin: null,
    status: 1,
    end: null,
    isVisible: false,
    animationData: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    province: '',
    city: '',
    area: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // 默认联动显示北京
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
    })
    console.log(this.data)
  },
  onShow: function () {
    bprovince = null;
    bcity = null;
    bjurisdiction = null;
    bcityId = null;
  },
  // 显示
  showMenuTap: function (e) {
    console.log('selectState')
    //获取点击菜单的类型 1点击状态 2点击时间 
    var menuType = e.currentTarget.dataset.type
    // 如果当前已经显示，再次点击时隐藏
    if (this.data.isVisible == true) {
      this.startAnimation(false, -200)
      return
    }
    this.setData({
      menuType: menuType
    })
    this.startAnimation(true, 0)
  },
  hideMenuTap: function (e) {
    this.startAnimation(false, -200)
  },
  // 执行动画
  startAnimation: function (isShow, offset) {
    var that = this
    var offsetTem
    if (offset == 0) {
      offsetTem = offset
    } else {
      offsetTem = offset + 'rpx'
    }
    this.animation.translateY(offset).step()
    this.setData({
      animationData: this.animation.export(),
      isVisible: isShow
    })
    console.log(that.data)
  },
  // 选择状态按钮
  selectState: function (e) {
    console.log('selectState1')
    this.startAnimation(false, -200)
    var status = e.currentTarget.dataset.status
    this.setData({
      status: status
    })
    console.log(this.data)

  },
  // 日志选择
  bindDateChange: function (e) {
    console.log(e)
    if (e.currentTarget.dataset.type == 1) {
      this.setData({
        begin: e.detail.value
      })
    } else if (e.currentTarget.dataset.type == 2) {
      this.setData({
        end: e.detail.value
      })
    }
  },
  sureDateTap: function () {
    this.data.pageNo = 1
    this.startAnimation(false, -200)
  },
  // 点击所在地区弹出选择框
  selectDistrict: function (e) {
    var that = this
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true)
  },
  // 执行动画
  startAddressAnimation: function (isShow) {
    console.log(isShow)
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + that.data.citys[value[1]].name + that.data.areas[value[2]].name
    bcity = that.data.citys[value[1]].name //城市
    bprovince = that.data.provinces[value[0]].name //省份
    bjurisdiction = that.data.areas[value[2]].name //辖区
    bcityId = that.data.citys[value[1]].id //城市ID
    that.setData({
      areaInfo: areaInfo,
    })
  },
  hideCitySelected: function (e) {
    console.log(e)
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    console.log(e)
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
    console.log(this.data)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.local()
  },
  local: function (e) {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        gourmet_address = res.address
        latitude = res.latitude;
        longitude = res.longitude;
        console.log(res)
        that.setData({
          address: gourmet_address
        })
      },
      fail: function (res) {
      },
      complete: function (res) {
      },
    })
  },
  //注入地址
  inputAddress: function (e) {
    gourmet_address = e.detail.value
  },
  inputdetailed: function (e) {
    detailed = e.detail.value
  },
  mob_name: function (e) {
    name = e.detail.value
  },
  mob_email: function (e) {
    email = e.detail.value
  },
  hePhonel: function (e) {
    hePhonel = e.detail.value
  },
  radioChange(e) {
    radio = e.detail.value
  },
  sure_mod(v) {
    if (gourmet_address == null) {
      wx.showToast({
        title: '地址不能为空',
        icon: 'success',
        image: '../../image/error.png',
        duration: 1500
      })
      return false;
    } else if (bprovince == null) {
      wx.showToast({
        title: '请选择城市',
        icon: 'success',
        image: '../../image/error.png',
        duration: 1500
      })
      return false;
    } else {
      var currentUser = Bmob.User.current().id;
      var bmob_address = gourmet_address;
      var bmob_detailed = detailed;
      var bmob_name = name;
      var bmob_email = email;
      var bmob_hePhonel = hePhonel;
      var bmob_radio = radio;
      var User = Bmob.Object.extend("User");
      var query = new Bmob.Query(User);
      query.get(currentUser, {
        success: function (result) {
          // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
          result.set('address', bmob_address);
          result.set('detailed', bmob_detailed);
          //result.set('nickName', bmob_name);
          result.set('user-em', bmob_email);
          result.set('hePhonel', bmob_hePhonel);
          result.set('sex', bmob_radio);
          result.set('longitude', longitude);
          result.set('latitude', latitude);
          result.set('jurisdiction', bjurisdiction);
          result.set('city', bcity);
          result.set('cityid', bcityId);
          result.set('province', bprovince);
          result.save();
          wx.showLoading({
            title: 'Loading...',
            mask: true
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
            wx.hideLoading()
          }, 2000)
        },
        error: function (object, error) {
          console.log(error)
        }
      });
    }
  }
})