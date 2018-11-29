// miniprogram/pages/author_poem/author_poem.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: false,
    author: '',
    poems: [],
    hasMore: true,
    pageIndex: 1,
    pageSize: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      author: options.author,
      loadingHidden: false,
    })
    this.loadNextData(1);
  },
  onNextBtnClick: function () {
    this.loadNextData(this.data.pageIndex + 1);
  },
  onPreviousBtnClick: function () {
    this.loadNextData(this.data.pageIndex - 1);
  },
  loadNextData: function (index) {
    var that = this;
    var fields = {
      id: true,
      name: true,
      poet: true
    };
    wx.cloud.callFunction({
      name: 'get_author_poems',
      data: {
        pageIndex: index,
        pageSize: that.data.pageSize,
        author: [that.data.author],
      }
    }).then(res => {
      console.info(res);
      that.setData({
        loadingHidden: true,
        poems: res.result.data,
        hasMore: res.result.hasMore,
        pageIndex: index
      });
    }).catch(console.error);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})