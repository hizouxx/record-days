// pages/wishAdd/wishAdd.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    theme: 0,
    inputValue: '', // 心愿内容
    btnDisabled: true, // 提交可点状态
    btnLoading: false, // loading

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const theme = wx.getStorageSync('theme') || 0
    this.setData({
      theme
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
   * 心愿输入框
   * @param {*} e 
   */
  input(e) {
    this.setData({
      inputValue: e.detail.value,
      btnDisabled: e.detail?.value.trim() == '' ? true : false
    })
  },
  /**
   * 调用云函数进行审核
   */
  checkMsg() {
    this.setData({
      btnDisabled: true,
      btnLoading: true,
    })
    wx.cloud.callFunction({
      name: 'checkMsg' ,
      data:{
        'content': this.data.inputValue
      },
      success: res => {
        // console.log(res)
        //获取状态码  0-正常   87014-违规
        if(res.result.errCode != 0) {
          this.setData({
            btnDisabled: false,
            btnLoading: false,
          })
          wx.showToast({
            title: '输入的内容违规',
            icon: 'none'
          })
        } else {
          this.submit()
        }
      },
      fail: err => {
        // console.error('err', err)
        this.setData({
          btnDisabled: false,
          btnLoading: false,
        })
      }
    }) 
  },
  /**
   * 提交
   */
  submit() {
    let {inputValue} = this.data
    //调用云函数
    wx.cloud.callFunction({
      name: 'addWish',
      data: {
        openid: app.globalData.openid,
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        createTime: new Date().getTime(),
        value: inputValue,
        achieve: false,
        achieveDate: null
      },
      success: res => {
        // console.log(res)
        this.setData({
          inputValue: '',
          btnDisabled: false,
          btnLoading: false,
        })
        wx.showToast({
          title: '许愿成功',
        })
        wx.navigateBack()
      },
      fail: err => {
        console.log(err)
        this.setData({
          btnDisabled: false,
          btnLoading: false,
        })
      }
    })
  },
})