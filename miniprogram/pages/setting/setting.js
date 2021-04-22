// miniprogram/pages/setting/setting.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: 0, // 顶部状态栏高度
    drawerModalL: false, // 是否显示更换主题的弹框
    layoutModalL: false, // 是否显示布局的弹框
    theme: 0,
    ColorList: [], // 主题色列表
    dragColumnsSize: 0, // 九宫格排列列数
    bgCur: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      CustomBar: app.globalData.CustomBar, // 顶部状态栏高度
      theme: wx.getStorageSync('theme') || 0, //主题
      dragColumnsSize: wx.getStorageSync('layoutColumns') || 3, //布局列数
      bgCur: wx.getStorageSync('bgCur') || 0, // 背景图索引
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
   * 隐藏\显示选择主题背景色的左弹框
   */
  toggleModal() {
    this.setData({
      drawerModalL: this.data.drawerModalL ? false : true
    })
  },

  /**
   * 隐藏\显示选择桌面布局弹框
   */
  toggleLayoutModal() {
    this.setData({
      layoutModalL: this.data.layoutModalL ? false : true
    })
  },

  /**
   * 选择桌面布局
   */
  selectLayout(e) {
    let {
      layout
    } = e.currentTarget.dataset

    this.setData({
      dragColumnsSize: layout
    })

    wx.setStorage({
      key: "layoutColumns",
      data: layout
    })
  },

  /**
   * 选择背景
   */
  selectBg(e) {
    // console.log(e)
    let {
      bg
    } = e.currentTarget.dataset
    this.setData({
      bgCur: bg
    })
    wx.setStorageSync('bgCur', bg)
  },
  
  /**
   * 选择主题背景色
   */
  selectTheme(e) {
    // console.log(e)
    let {
      select
    } = e.currentTarget.dataset
    this.setData({
      theme: select,
      drawerModalL: false
    })
    wx.setStorageSync('theme', select)
  },
  
})