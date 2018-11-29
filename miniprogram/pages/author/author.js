// miniprogram/pages/author/author.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: false,
    loadingFail:false,
    collect:false,
    author:{}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var authorID = options.author;
    var isYun = options.isYun ? true : false;
    this.loadAuthor(authorID, isYun);
  },

  loadAuthor: function (authorID,isYun) {
    var that = this;
    const db = wx.cloud.database();
    const _ = db.command
    console.info(authorID);
    var filter = isYun ? { _id: authorID } : { poetId: parseInt(authorID) }
    console.info(filter);
    db.collection('poet').where(filter).get({
      success: function (res) {
        // console.info(res);
        if (res.data&&res.data.length>0){
          that.setData({ author: res.data[0], loadingHidden: true });
          wx.setNavigationBarTitle({
            title: res.data[0].name//页面标题为路由参数
          })
          that.updateCollect(that);
        }else{
          that.setData({ loadingFail: true, loadingHidden: true });
        }
      },
      fail:function(info){
        that.setData({ loadingFail: true, loadingHidden:true});
      }
    });
  },
  doCollect: function () {
    var that = this;
    wx.cloud.callFunction({
      name: 'do_collect',
      data: {
        type: '00',
        name: that.data.author.name,
        id: that.data.author._id,
        content: that.data.author.desc,
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

  updateCollect: function (that) {
    wx.cloud.callFunction({
      name: 'is_collect',
      data: {
        id: that.data.author._id,
        type: '00'
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

    return {
      path: '/pages/recommend/recommend?author=' + this.data.author._id
    }
  }
})