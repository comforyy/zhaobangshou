var qingjie = require("../data/data.js");
Page({
  data: {
    qingjiedata: ""
  },
  onLoad: function (options) {
    this.setData({
      qingjiedata: qingjie.qingjie
    })
  },
  selectClick: function (event) {
    // this.data.model[event.currentTarget.id].selectImage
    for (var i = 0; i < this.data.qingjiedata.length; i++) {
      if (event.currentTarget.id == i) {
        this.data.qingjiedata[i].selectImage = true
      }
      else {
        this.data.qingjiedata[i].selectImage = false
      }
    }
    this.setData(this.data)
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: 'qingjietwo/qingjietwo?id=' + id
    })
  }
})