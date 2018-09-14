var banyundataone = require("../../data/data.js");
Page({
  data: {
    one: ""
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      one: banyundataone.banyun[options.id],
    })
  },
  selectClick: function (event) {
    var that = this
    for (var i = 0; i < that.data.one.title2.length; i++) {
      if (event.currentTarget.id == i) {
        that.data.one.title2[i].selectImage = true
        console.log()
      }
      else {
        that.data.one.title2[i].selectImage = false
      }
    }
    var select = event.currentTarget.dataset.select

    wx.navigateTo({
      url: '../../add/add?select=' + select
    })
    this.setData(this.data)
  }
})