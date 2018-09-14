var huansuo = require("../data/data.js");
Page({
  data: {
    huansuodata: ""
  },
  onLoad: function (options) {
    this.setData({
      huansuodata: huansuo.huansuo
    })
  },
  selectClick: function (event) {
    // this.data.model[event.currentTarget.id].selectImage
    for (var i = 0; i < this.data.huansuodata.length; i++) {
      if (event.currentTarget.id == i) {
        this.data.huansuodata[i].selectImage = true
      }
      else {
        this.data.huansuodata[i].selectImage = false
      }
    }
    this.setData(this.data)
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: 'huansuotwo/huansuotwo?id=' + id
    })
  }
})