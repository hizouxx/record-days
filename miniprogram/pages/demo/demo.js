// miniprogram/pages/demo/demo.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    theme: 0,
    ColorList: [], // 主题色列表
    CustomBar: app.globalData.CustomBar,
    cardCur: 0,
    swiperList: [
      '../../images/screenshot/01.png',
      '../../images/screenshot/02.png',
      '../../images/screenshot/03.png',
      '../../images/screenshot/04.png',
      '../../images/screenshot/05.png',
      '../../images/screenshot/06.png',
      '../../images/screenshot/07.png',
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      theme: wx.getStorageSync('theme') || 0, //主题
      ColorList: app.globalData.ColorList, // 主题色列表
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