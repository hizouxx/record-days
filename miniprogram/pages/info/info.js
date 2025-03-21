// miniprogram/pages/info/info.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCouple: false, // 是否绑定
    openid: '', // 本人openid
    bindOpenid: '', //绑定对象数据openid
    userInfo: {}, // 本人数据
    bindUserInfo: {}, // 绑定对象数据
    theme: 0,
    ColorList: [], // 主题色列表
    tabIndex: 0, // tab索引
    loading: false,
    closeBindModule: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const switchStorage = wx.getStorageSync('switch')
    this.setData({
      theme: wx.getStorageSync('theme') || 0, //主题
      ColorList: app.globalData.ColorList, // 主题色列表
      userInfo: app.globalData.userInfo,
      isCouple: app.globalData.bindOpenid ? true : false,
      openid: app.globalData.openid,
      bindOpenid: app.globalData.bindOpenid,
      closeBindModule: switchStorage ? JSON.parse(switchStorage)?.closeBind : false,
    })
    if (!Object.keys(this.data.userInfo).length) {
      // 若无userInfo，则在数据库里添加一条用户数据
      this.addUser()
    }
    if (this.data.bindOpenid) {
      // 若有bindOpenid，则获取绑定对象数据
      this.getBindUserInfo()
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
    this.setData({
      userInfo: app.globalData.userInfo
    })
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
   * 获取个人信息
   */
  addUser() {
    // 无数据则把openid传入数据库
    wx.cloud.callFunction({
      name: 'addUser',
      data: {
        openid: app.globalData.openid,
        bindOpenid: '',
        userInfo: {}
      }
    })
  },
  /**
   * 获取绑定对象的个人信息
   */
  getBindUserInfo() {
    wx.cloud.callFunction({
      name: 'getUserInfo',
      data: {
        openid: app.globalData.bindOpenid
      },
      success: res => {
        // console.log('获取绑定对象的个人信息: success', res)
        if (res && res.result && res.result.data && res.result.data.length > 0) {
          this.setData({
            bindUserInfo: res.result.data[0].userInfo,
          })
        }
      },
      fail: err => {
        console.log('获取绑定对象的个人信息: err', err)
      }
    })
  },

  /**
   * 刷新or获取绑定信息
   * 手动获取用户微信头像昵称等信息
   */
  getUserProfile() {
    wx.navigateTo({
      url: '/pages/infoEdit/infoEdit'
    })
  },


  /**
   * 扫描二维码
   */
  scanQRcode() {
    wx.scanCode({
      success: res => {
        wx.showToast({
          title: '扫描成功',
        })
        this.bindCouple(res.result)
      }
    })
  },
  /**
   * 绑定
   */
  bindCouple(bindOpenid) {
    wx.showLoading({
      title: '绑定中',
    })
    wx.cloud.callFunction({
      name: 'updateUserInfo',
      data: {
        openid: app.globalData.openid,
        bindOpenid,
        userInfo: app.globalData.userInfo
      },
      success: res => {
        // console.log('绑定success:', res)
        wx.hideLoading()
        wx.showToast({
          title: '绑定成功',
        })
        app.globalData.bindOpenid = bindOpenid
        this.setData({
          isCouple: true,
        })
        this.getBindUserInfo()
      },
      fail: res => {
        wx.hideLoading()
        console.log('绑定fail:', res)
      }
    })
  },

  /**
   * 解绑
   */
  unbandCouple() {
    wx.showModal({
      title: '提示',
      content: '解绑后将看不到对方所发的信息了，确认？',
      success: res => {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.cloud.callFunction({
            name: 'updateUserInfo',
            data: {
              openid: app.globalData.openid,
              bindOpenid: '',
              userInfo: app.globalData.userInfo,
            },
            success: res => {
              // console.log('success:', res)
              wx.hideLoading()
              wx.showToast({
                title: '解绑成功',
              })
              this.setData({
                isCouple: false,
                tabIndex: 0,
              })
              app.globalData.bindOpenid = ''
              // console.log('app.globalData33', app.globalData)
            },
            fail: res => {
              wx.hideLoading()
              console.log('fail:', res)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 显示二维码
   */
  pageToQRCode() {
    if (this.data.closeBindModule) {
      return
    }
    wx.navigateTo({
      url: '/pages/qrCode/qrCode'
    })
  },

  /**
   * 授权设置
   */
  authorizeSetting() {
    wx.openSetting()
  },
  /**
   * 演示指引
   */
  showDemo() {
    wx.navigateTo({
      url: '/pages/demo/demo'
    })
  },

  /**
   * 切换用户
   */
  toggleUser(e) {
    let {
      index
    } = e.currentTarget.dataset
    this.setData({
      tabIndex: index
    })
  },

})