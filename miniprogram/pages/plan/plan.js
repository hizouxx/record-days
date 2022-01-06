// pages/plan/plan.js
const utils = require('../../utils/util.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    theme: 0,
    loading: true,
    year: new Date().getFullYear(), // 今年年份
    pickerYear: utils.formatDate(new Date()),
    achieveList: [], // 已实现计划列表
    unAchieveList: [], // 未实现计划列表
    achieveRate: 0, // 实现率
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
    this.getPlanList()
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
   * 跳转添加计划页
   */
  add() {
    wx.navigateTo({
      url: '/pages/planAdd/planAdd',
    })
  },
  /**
   * 获取计划列表
   */
  getPlanList() {
    const { year } = this.data
    wx.cloud.callFunction({
      name: 'getPlanList',
      data: {
        couple: [app.globalData.openid, app.globalData.bindOpenid],
        year,
      },
      success: res => {
        // console.log('res', res)
        let achieveList = res.result && res.result.filter( i => i.achieve) || []
        let unAchieveList = res.result && res.result.filter( i => !i.achieve) || []
        this.setData({
          achieveList,
          unAchieveList,
          achieveRate: Math.round(achieveList.length / (achieveList.length + unAchieveList.length) * 100) || 0,
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
   * 计划编辑（达成？）
   * @param {*} id
   */
  planDetail(id) {
    wx.showModal({
      title: '计划',
      content: '确认达成了计划？',
      confirmText: "是的",
      canaclText: "尚未",
      success: res=> {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.showLoading()
          // 调用云函数
          wx.cloud.callFunction({
            name: 'editPlan',
            data: {
              id,
              achieve: true,
              achieveDate: new Date().getTime(),
            },
            success: res => {
              console.log('res', res)
              wx.hideLoading()
              wx.showToast({
                title: '计划达成',
              })
              this.getPlanList()
            },
            fail: err => {
              wx.hideLoading()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })    
  },

  /**
   * 长按计划
   * @param {} e 
   */
  longpressPlay(e) {
    wx.vibrateShort()
    let { _id, achieve } = e.currentTarget.dataset.item
    let itemList = achieve ? ['删除'] : ['删除', '计划达成']
    wx.showActionSheet({
      itemList,
      success: res => {
        // console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          wx.showLoading()
          wx.cloud.callFunction({
            name: 'deletePlan',
            data: {
              id: _id
            },
            success: res => {
              // console.log('res', res)
              wx.hideLoading()
              wx.showToast({
                title: '删除成功',
              })
              this.getPlanList()
            },
            fail: err => {
              wx.hideLoading()
            }
          })
        } else if(res.tapIndex == 1) {
          this.planDetail(_id)
        }
      },
      fail: res => {
        console.log(res.errMsg)
      }
    })
  },
  /**
   * 选择计划年份
   * @param {*} e 
   */
  yearChange(e) {
    this.setData({
      year: Number(e.detail.value)
    })
    this.getPlanList()
  },
})