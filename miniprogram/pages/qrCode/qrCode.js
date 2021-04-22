// miniprogram/pages/qcCode/qrCode.js
const app = getApp()
const QR = require("../../utils/qrcode.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let w = this.getRatio()
    console.log('w', w)
    QR.api.draw(app.globalData.openid, 'mycanvas', 250 * w, 250 * w);
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
   * 获取手机宽度
   */
  getRatio() {
    let w = 0;
    wx.getSystemInfo({
      success: function (res) {
        w = res.windowWidth / 375; //按照750的屏宽
      },
    })
    return w
  },
})