// miniprogram/pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: false,
    loadingFail: false,
    searchs:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var values=options.value;
    wx.cloud.callFunction({
      name:'do_search',
      data:{
        value: values
      },
      complete:function(res){
        if (res.result && res.result.length > 0) {
          console.info(res.result);
          that.setData({ searchs: res.result, loadingHidden: true })
        } else {
          that.setData({ loadingFail: true, loadingHidden: true });
        }
      },
      fail:function(res){
        that.setData({ loadingFail: true, loadingHidden: true });
      }
    });
  },
  itemClick:function(event){
    console.info(event.currentTarget.id);
    var data = this.data.searchs[parseInt(event.currentTarget.id)];
    console.info(data);
    var ntUrl="";
    if (data.type == "01") {
      ntUrl = '/pages/poem/poem?poem=' + data.id;
    }else{
      ntUrl = '/pages/author/author?author=' + data.id;
    }
    console.info(ntUrl);
    wx.navigateTo({
      url: ntUrl,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
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