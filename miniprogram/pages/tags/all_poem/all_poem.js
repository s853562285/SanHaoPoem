
const regeneratorRuntime = require('../../../lib/regenerator-runtime/runtime.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    winHeight: "",
    loadingHidden: false,
    searchLoading: false,
    poems: [],
    poemHasMore: true,
    poemPageIndex: 1,
    pageSize: 20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData(1);
  },
  async loadData(pageIndex) {
    const db = wx.cloud.database();
    const countResult = await db.collection('poetry').count();
    const total = countResult.total;
    const totalPage = Math.ceil(total / this.data.pageSize);
    if (pageIndex > totalPage || pageIndex == totalPage) {
      this.setData({
        poemHasMore: false
      });
    } else {
      this.setData({
        poemHasMore: true
      });
    }
    console.info(totalPage);
    var that = this;
    db.collection('poetry').field({ name: true, _id: true, content: true }).orderBy('star', 'desc')
      .skip((pageIndex - 1) * this.data.pageSize).limit(this.data.pageSize).get({
        success: function (res) {
          console.info(res);
          if (res.data && res.data.length > 0) {
            var data = pageIndex > 1 ? that.data.poems.concat(res.data) : res.data;
            console.info(data);
            that.setData({
              poems: data,
              loadingHidden: true,
              searchLoading: false,
              poemPageIndex: pageIndex
            });
          }
        },
        fail: function (res) {
          console.info(res);
          that.setData({
            loadingHidden: true,
            searchLoading: false
          });
        }
      });
  },
  loadMorePoem: function () {
    if (!this.data.poemHasMore || this.data.searchLoading) {
      return;
    }
    // console.info('loadMorepoem');
    this.setData({
      searchLoading: true
    });
    this.loadData(this.data.poemPageIndex + 1);
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