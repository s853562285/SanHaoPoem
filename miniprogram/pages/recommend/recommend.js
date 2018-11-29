// miniprogram/pages/recommend.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: false,
    getNextHidden:false,
    star:false,
    collect:false,
    poem: {
      name:"",
      dynasty:"",
      content:"",
      poet:{
        name:""
      },
      star:0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var poem=options.poem;
    var author = options.author;
    if(poem){
      wx.navigateTo({
        url: '/pages/poem/poem?poem=' + poem
      });
    } else if (author) {
      wx.navigateTo({
        url: '/pages/author/author?author=' + author +'&isYun=true'
      });

    }
    this.loadData();
  },
  loadData:function(){
    this.setData({
      loadingHidden: false,
      star: false,
      collect: false
    });
    var that = this;
    wx.cloud.callFunction({
      name: "recommend",
      complete: function (res) {
        console.info(res)
        if(res.result==null){
          that.setData({
            poem: {
              name: '推荐诗词加载失败，换一首吧~',
              dynasty: "",
              content: "",
              poet: {
                name: ""
              },
              star: 0
            } , loadingHidden: true,star:false})
        }else{
          that.setData({ poem: res.result.data[0], loadingHidden: true, star: false})
          that.updateCollect(that);
        }
      },
      fail: function(res){
        this.loadData()
        }
    })
  },
  doCollect:function(){
    var that=this;
    wx.cloud.callFunction({
      name:'do_collect',
      data:{
        type:'01',
        name: that.data.poem.name,
        id: that.data.poem._id,
        content: that.data.poem.content,
      },
      complete:function(res){
        console.info(res);
        that.setData({ collect: !that.data.collect});
        wx.showToast({
          title: that.data.collect?'收藏成功~':'取消收藏成功~',
          icon: 'success',
          duration: 1000,
          mask: true
        })
      },
      fail:function(res){
        wx.showToast({
          title: '操作失败',
          icon: 'warn',
          duration: 1000,
          mask: true
        })
      }
    });
  },
  doStar:function(){
    if(this.data.star){
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
        // console.info(that.data.poem.star + 1);
        // that.setData({ star: true,'poem.star':that.data.poem.star+1});
      },
      fail: function (res) {
        // console.info(res);

      }
    });
  },
  updateCollect:function(that){
    wx.cloud.callFunction({
      name: 'is_collect',
      data: {
        id: that.data.poem._id,
        type: '01'
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
    // this.updateCollect();
    if(this.data.poem.name){
      this.updateCollect(this)
    }
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