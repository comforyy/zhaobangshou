var banyun = require("../data/data.js");
Page({
  data: {
   banyundata: ""
  },
  onLoad: function (options) {
    this.setData({
      banyundata: banyun.banyun
    })
  },
  selectClick: function (event) {
    // this.data.model[event.currentTarget.id].selectImage
    for (var i = 0; i < this.data.banyundata.length; i++) {
      if (event.currentTarget.id == i) {
        this.data.banyundata[i].selectImage = true
      }
      else {
        this.data.banyundata[i].selectImage = false
      }
    }
    this.setData(this.data)
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: 'banyuntwo/banyuntwo?id=' + id
    })
  }
})