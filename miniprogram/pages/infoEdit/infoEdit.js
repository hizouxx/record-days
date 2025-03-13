// pages/infoEdit/infoEdit.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    theme: 0,
    btnDisabled: false,
    btnLoading: false,
    avatarUrl: '',
    nickName: '',
    genderSwitch: 0,
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    const timestamp = new Date().getTime();
    // 上传图片
    wx.showLoading({
      title: '上传中',
    })
    wx.cloud.uploadFile({
      cloudPath: 'avatar/' + timestamp + avatarUrl.match(/\.[^.]+?$/)[0],
      filePath: avatarUrl,
      success: res => {
        // console.log('res', res)
        wx.hideLoading()
        this.setData({
          avatarUrl: res.fileID
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

  nickNameInput(e) {
    this.setData({
      nickName: e.detail.value
    })
  },

  genderSwitchChange(e) {
    let { gender } = e.currentTarget.dataset
    this.setData({
      genderSwitch: gender
    })
  },

  formSubmit() {
    // console.log(this.data)
    this.setData({
      btnDisabled: true,
      btnLoading: true,
    })
    const obj = {
      ...app.globalData.userInfo,
      avatarUrl: this.data.avatarUrl,
      nickName: this.data.nickName,
      gender: this.data.genderSwitch
    }
    app.globalData.userInfo = obj
    wx.cloud.callFunction({
      name: 'updateUserInfo',
      data: {
        openid: app.globalData.openid,
        bindOpenid: app.globalData.bindOpenid,
        userInfo: obj,
      },
      success: () => {
        // console.log('obj', obj)
        this.setData({
          btnDisabled: false,
          btnLoading: false,
        })
        wx.showToast({
          title: '操作成功'
        })
        wx.navigateBack()
      },
      fail: res => {
        // console.log('绑定fail:', res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const theme = wx.getStorageSync('theme') || 0
    const {avatarUrl, nickName, gender} = app.globalData.userInfo
    this.setData({
      theme,
      avatarUrl: avatarUrl || '',
      nickName: nickName || '',
      genderSwitch: gender,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})