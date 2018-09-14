var more = require("../data/data.js");
Page({
  data: {
    moredata: ""
  },
  onLoad: function (options) {
    this.setData({
      moredata: more.more
    })
  },
  selectClick: function (event) {
    // this.data.model[event.currentTarget.id].selectImage
    for (var i = 0; i < this.data.moredata.length; i++) {
      if (event.currentTarget.id == i) {
        this.data.moredata[i].selectImage = true
      }
      else {
        this.data.moredata[i].selectImage = false
      }
    }
    this.setData(this.data)
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: 'moretwo/moretwo?id=' + id
    })
  }
})