var anzhuang = require("../data/data.js");
Page({
  data: {
    anzhuangdata: ""
  },
  onLoad: function (options) {
    this.setData({
      anzhuangdata: anzhuang.anzhuang
    })
  },
  selectClick: function (event) {
    // this.data.model[event.currentTarget.id].selectImage
    for (var i = 0; i < this.data.anzhuangdata.length; i++) {
      if (event.currentTarget.id == i) {
        this.data.anzhuangdata[i].selectImage = true
      }
      else {
        this.data.anzhuangdata[i].selectImage = false
      }
    }
    this.setData(this.data)
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: 'anzhuangtwo/anzhuangtwo?id=' + id
    })
  }
})