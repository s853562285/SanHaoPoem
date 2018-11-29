// miniprogram/pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight:"",
    loadingHidden: false,
    searchLoading:false,
    currentTab:0,
    poems:[],
    poets: [],
    poetType:'00',
    poemType:'01',
    poemHasMore: true,
    poetHasMore: true,
    poemPageIndex: 1,
    poetPageIndex: 1,
    pageSize: 20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 80;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  loadData: function (loadType, index) {
    // console.info("loadData" + loadType);
    var that=this;
    wx.cloud.callFunction({
      name:'get_collect',
      data: { 
        type: loadType,
        pageIndex:index,
        pageSize:that.data.pageSize
      },
      success: function (res) {
        console.info(res);
        if(res.errMsg.indexOf('ok')!=-1){
          if (loadType == that.data.poemType) {
            var data = index > 1 ? that.data.poems.concat(res.result.data) : res.result.data;
            that.setData({
              loadingHidden: true,
              searchLoading:false,
              poems: data,
              poemHasMore: res.result.hasMore,
              poemPageIndex: index
            });
          } else {
            var data = index > 1 ? that.data.poets.concat(res.result.data) : res.result.data;
            // console.info(loadType+"poets"+data);
            that.setData({
              loadingHidden: true,
              searchLoading: false,
              poets: data,
              poetHasMore: res.result.hasMore,
              poetPageIndex: index
            });
          }
        }
      },
      fail:function(res){
        that.setData({
          loadingHidden: true,
          searchLoading: false
        });
        console.info(res);
      }
    });
  },
  loadMorePoet:function(){
    if (!this.data.poetHasMore || this.data.searchLoading){
      return;
    }
    // console.info('loadMorePoet');
    this.setData({
      searchLoading:true
    });
    this.loadData(this.data.poetType,this.data.poetPageIndex+1);
  },

  loadMorePoem: function () {
    if (!this.data.poemHasMore || this.data.searchLoading) {
      return;
    }
    // console.info('loadMorePoem');
    this.setData({
      searchLoading: true
    });
    this.loadData(this.data.poemType, this.data.poemPageIndex + 1);
  },
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
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
    console.info('onShow')
    this.setData({
      loadingHidden: true,
      poemHasMore: true,
      poetHasMore: true,
      poemPageIndex: 1,
      poetPageIndex: 1,
    });
    this.loadData(this.data.poemType, this.data.poemPageIndex);
    this.loadData(this.data.poetType, this.data.poetPageIndex);
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