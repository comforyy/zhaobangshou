var weixiu = require("../data/data.js");
Page({
  data: {
    weixiudata: ""
  },
  onLoad: function (options) {
    this.setData({
      weixiudata: weixiu.weixiu
    })
  },
  selectClick: function (event) {
    // this.data.model[event.currentTarget.id].selectImage
    for (var i = 0; i < this.data.weixiudata.length; i++) {
      if (event.currentTarget.id == i) {
        this.data.weixiudata[i].selectImage = true
      }
      else {
        this.data.weixiudata[i].selectImage = false
      }
    }
    this.setData(this.data)
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: 'weixiutwo/weixiutwo?id=' + id
    })
  }
})