Page({
  /**
   * 页面的初始数据
   */
  data: {
    noSelect: 'http://bmob-cdn-17927.b0.upaiyun.com/2018/06/21/a96573d640dd4d2f800f6a1847d14a19.png',
    hasSelect: 'http://bmob-cdn-17927.b0.upaiyun.com/2018/06/21/dd01b67c40cd6e2e80af3b5ae000afc6.png',
    repContent: [{ message: '广告内容' }, { message: '不友善内容' }, { message: '垃圾内容' }, { message: '违法违规内容' }, { message: '其他' }],
    selectIndex: [
      { sureid: false },
      { sureid: false },
      { sureid: false },
      { sureid: false },
      { sureid: false },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  selectRep: function (e) {
    let index = e.currentTarget.dataset.selectindex;  //当前点击元素的自定义数据，这个很关键
    let selectIndex = this.data.selectIndex;    //取到data里的selectIndex
    selectIndex[index].sureid = !selectIndex[index].sureid;   //点击就赋相反的值
    console.log(selectIndex)
    this.setData({
      selectIndex: selectIndex   //将已改变属性的json数组更新
    })
  }
})