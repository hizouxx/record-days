// miniprogram/pages/specialDay/specialDay.js
const app = getApp()
const utils = require('../../utils/util.js')
const {calendar} = require('../../utils/calendar.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    SpecialDayList: app.globalData.SpecialDayList,
    theme: 0,
    loading: true,
    dataList: [] // 纪念日列表
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
    // 因为自页面用了navigateBack。为了确保返回后刷新数据，所以接口调用放onShow而不放在onLoad里
    this.getDataList()
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
   * 跳转添加纪念日页
   */
  add() {
    wx.navigateTo({
      url: '/pages/specialDayAdd/specialDayAdd',
    })
  },
  /**
   * 获取纪念日列表
   */
  getDataList() {
    wx.cloud.callFunction({
      name: 'getSpecialDayList',
      data: {
        couple: [app.globalData.openid, app.globalData.bindOpenid],
      },
      success: res => {
        // console.log('res', res)
        let dataList = res.result && res.result.map( i =>{
          const date = new Date(i.date)
          date.setHours(0, 0, 0, 0)
          let year = date.getFullYear(), month = date.getMonth()+1, day = date.getDate();
          i.lunarDate = calendar.solar2lunar(year, month, day)
          i.timePoint = utils.timePoint(date)
          return i
        })
        this.setData({
          dataList,
          loading: false
        })
      },
      fail: err => {
        console.log('err', err)
        this.setData({
          loading: false
        })
      }
    })
  },
  /**
   * 删除某一条纪念日
   * @param {} e 
   */
  deleteSpecialDay(e) {
    wx.vibrateShort()
    let { id } = e.currentTarget.dataset
    wx.showActionSheet({
      itemList: ['删除'],
      success: res => {
        // console.log(res.tapIndex)
        wx.showLoading({
          title: '操作中···',
        })
        wx.cloud.callFunction({
          name: 'deleteSpecialDay',
          data: {
            id
          },
          success: res => {
            // console.log('res', res)
            wx.hideLoading()
            wx.showToast({
              title: '删除成功',
            })
            this.getDataList()
          },
          fail: err => {
            wx.hideLoading()
          }
        })
      },
      fail: res => {
        console.log(res.errMsg)
      }
    })
  }
})