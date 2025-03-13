// miniprogram/pages/setting/setting.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar, // 顶部状态栏高度
    drawerModalL: false, // 是否显示更换主题的弹框
    layoutModalL: false, // 是否显示布局的弹框
    theme: 0,
    ColorList: [], // 主题色列表
    dragColumnsSize: 0, // 九宫格排列列数
    bgCur: 0,
    dasktopDIY: '',
    filePaths: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      theme: wx.getStorageSync('theme') || 0, //主题
      dragColumnsSize: wx.getStorageSync('layoutColumns') || 3, //布局列数
      bgCur: wx.getStorageSync('bgCur') || 0, // 背景图索引
      dasktopDIY: wx.getStorageSync('dasktop') || '', // 自定义背景图
      ColorList: app.globalData.ColorList, // 主题色列表
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // wx.setStorage({
    //   key: "dasktop",
    //   data: 'cloud://memo-test-yjsx0.6d65-memo-test-yjsx0-1303922788/dasktop-1660900623583.jpg'
    // })
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

  /**
   * 选择图片
   */
  chooseImage () {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        console.log(res)
        this.setData({
          filePaths: res.tempFiles
        })
        wx.showLoading({
          title: '上传中',
        })
        this.doUpload()
      },
      fail: () => {
        wx.showToast({
          title: '取消上传',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 上传图片到存储，并获取到ids
   */
  doUpload() {
    const timestamp = new Date().getTime();
    // 上传图片
    wx.cloud.uploadFile({
      cloudPath: 'desktop/' + timestamp + this.data.filePaths[0].tempFilePath.match(/\.[^.]+?$/)[0],
      filePath: this.data.filePaths[0].tempFilePath,
      success: res => {
        console.log('res', res)
        wx.hideLoading()
        this.setData({
          dasktopDIY: res.fileID
        })
        wx.setStorage({
          key: "dasktop",
          data: res.fileID
        })
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          title: '上传图片到云存储失败，请稍后再试',
          icon: 'none'
        })
      }
    })
  },
  
})