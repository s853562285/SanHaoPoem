// miniprogram/pages/poem/poem.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: false,
    getNextHidden: true,
    star: false,
    collect: false,
    poem: {
      name: "",
      dynasty: "",
      content: "",
      poet: {
        name: ""
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var poemID = options.poem;
    console.info(poemID);
    this.loadPoem(poemID);
  },

  loadPoem: function (id) {
    var that=this;
    var db = wx.cloud.database();
    db.collection('poetry').doc(id).get({
      success: function (res) {
        console.info(res);
        wx.setNavigationBarTitle({
          title: res.data.name//页面标题为路由参数
        })
        that.setData({ poem: res.data, loadingHidden: true })
        that.updateCollect(that)
      },
      fail:console.error
    });
  },
  doCollect: function () {
    var that = this;
    wx.cloud.callFunction({
      name: 'do_collect',
      data: {
        type: '01',
        name: that.data.poem.name,
        id: that.data.poem._id,
        content: that.data.poem.content,
      },
      complete: function (res) {
        console.info(res);
        that.setData({ collect: !that.data.collect });
        wx.showToast({
          title: that.data.collect ? '收藏成功~' : '取消收藏成功~',
          icon: 'success',
          duration: 1000,
          mask: true
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '操作失败',
          icon: 'warn',
          duration: 1000,
          mask: true
        })
      }
    });
  },
  doStar: function () {
    // var recommend=require("/miniprogram/pages/recommend/recommend.js");
    // recommend.doStar();
    if (this.data.star) {
      return;
    }
    this.setData({ star: true, 'poem.star': this.data.poem.star + 1 });
    var that = this;
    wx.cloud.callFunction({
      name: 'do_star',
      data: {
        name: that.data.poem.name,
        id: that.data.poem._id,
      },
      complete: function (res) {
        // console.info(res);
        // that.setData({ star: true, 'poem.star': that.data.poem.star + 1 });
      },
      fail: function (res) {
        // console.info(res);

      }
    });
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

  updateCollect: function (that) {
    wx.cloud.callFunction({
      name: 'is_collect',
      data: {
        id: that.data.poem._id,
        type:'01'
      },
      complete: function (res) {
        console.info(res);
        if (res.errMsg.indexOf("ok") != -1) {
          that.setData({ collect: res.result.message });
        }
      },
      fail: function (res) {
        // console.info(res);

      }
    });
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
    return {
      path: '/pages/recommend/recommend?poem=' + this.data.poem._id
    }
  }
})