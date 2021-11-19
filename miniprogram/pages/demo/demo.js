// miniprogram/pages/demo/demo.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    cardCur: 0,
    swiperList: [
      '../../images/screenshot/1-1.png',
      '../../images/screenshot/1-2.png',
      '../../images/screenshot/2-1.png',
      '../../images/screenshot/2-2.png',
      '../../images/screenshot/3-1.png',
      '../../images/screenshot/3-2.png',
      '../../images/screenshot/3-3.png',
      '../../images/screenshot/3-4.png',
      '../../images/screenshot/4-1.png',
      '../../images/screenshot/4-2.png',
      '../../images/screenshot/4-3.png',
      '../../images/screenshot/4-4.png',
      '../../images/screenshot/5-1.png',
      '../../images/screenshot/5-2.png',
      '../../images/screenshot/5-3.png',
      '../../images/screenshot/6-1.png',
      '../../images/screenshot/6-2.png',
      '../../images/screenshot/6-3.png',
      '../../images/screenshot/6-4.png',
      '../../images/screenshot/7-1.png',
      '../../images/screenshot/7-2.png',
      '../../images/screenshot/8-1.png',
      '../../images/screenshot/8-2.png',
      '../../images/screenshot/9-1.png',
      '../../images/screenshot/9-2.png',
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  /**
   * 切换swiper
   * @param {*} e 
   */
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  }
})