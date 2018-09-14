var zhuangxiu = require("../data/data.js");
Page({
  data: {
    zhuangxiudata: ""
  },
  onLoad: function (options) {
    this.setData({
      zhuangxiudata: zhuangxiu.zhuangxiu
    })
  },
  selectClick: function (event) {
    // this.data.model[event.currentTarget.id].selectImage
    for (var i = 0; i < this.data.zhuangxiudata.length; i++) {
      if (event.currentTarget.id == i) {
        this.data.zhuangxiudata[i].selectImage = true
      }
      else {
        this.data.zhuangxiudata[i].selectImage = false
      }
    }
    this.setData(this.data)
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: 'zhuangxiutwo/zhuangxiutwo?id=' + id
    })
  }
})