var zhineng = require("../data/data.js");
Page({
  data: {
    zhinengdata: ""
  },
  onLoad: function (options) {
    this.setData({
      zhinengdata: zhineng.zhineng
    })
  },
  selectClick: function (event) {
    // this.data.model[event.currentTarget.id].selectImage
    for (var i = 0; i < this.data.zhinengdata.length; i++) {
      if (event.currentTarget.id == i) {
        this.data.zhinengdata[i].selectImage = true
      }
      else {
        this.data.zhinengdata[i].selectImage = false
      }
    }
    this.setData(this.data)
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: 'zhinengtwo/zhinengtwo?id=' + id
    })
  }
})