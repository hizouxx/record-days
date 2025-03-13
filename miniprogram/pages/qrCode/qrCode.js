// miniprogram/pages/qcCode/qrCode.js
const app = getApp()
import drawQrcode from '../../utils/weapp.qrcode.esm.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const query = wx.createSelectorQuery()
    query.select('#myQrcode')
      .fields({
        node: true,
        size: true
      })
      .exec(async (res) => {
        // 微信小程序
        var canvas = res[0].node

        // 调用方法drawQrcode生成二维码
        await drawQrcode({
          canvas: canvas,
          canvasId: 'myQrcode',
          width: 260,
          padding: 30,
          background: '#ffffff',
          foreground: '#000000',
          text: app.globalData.openid,
        })

        // let base64 = canvas.toDataURL()
        // console.info(base64)

        // 获取临时路径
        wx.canvasToTempFilePath({
          canvasId: 'myQrcode',
          canvas: canvas,
          x: 0,
          y: 0,
          width: 260,
          height: 260,
          destWidth: 260,
          destHeight: 260,
          success: res=> {
            // console.log('二维码临时路径：', res.tempFilePath)
          },
          fail(res) {
            console.error(res)
          }
        })
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
})