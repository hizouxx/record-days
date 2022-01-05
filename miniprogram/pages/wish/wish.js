// miniprogram/pages/wish/wish.js
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
    btnDisabled: true, // 新增按钮可点状态
    showModal: false, // 是否显示新增心愿的弹框
    inputValue: '', // 心愿
    list: [], // 心愿列表
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
    this.getWishList()
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
   * add
   */
  add() {
    wx.navigateTo({
      url: '/pages/wishAdd/wishAdd'
    })
  },

  /**
   * 获取心愿数据列表
   */
  getWishList() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getWishList',
      data: {
        couple: [app.globalData.openid, app.globalData.bindOpenid],
      },
      success: res => {
        console.log('res', res)
        let list = res.result.map(i=>{
          i.createDate = utils.formatDate(new Date(i.createTime))
          i.achieveDate = i.achieveDate ? utils.formatDate(new Date(i.achieveDate)) : null
          return i
        })
        this.setData({
          list,
          loading: false
        })
      },
      fail: err => {
        console.log(err)
        this.setData({
          loading: false
        })
      }
    })
  },
  /**
   * 心愿编辑（达成？）
   * @param {*} id
   */
  wishDetail(_id) {
    wx.showModal({
      title: '心愿',
      content: '确定达成了心愿？',
      confirmText: "确定",
      canaclText: "尚未",
      success: res=> {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.showLoading()
          // 调用云函数
          wx.cloud.callFunction({
            name: 'editWish',
            data: {
              id: _id,
              achieve: true,
              achieveDate: new Date().getTime(),
            },
            success: res => {
              console.log('res', res)
              wx.hideLoading()
              wx.showToast({
                title: '许愿达成',
              })
              this.setData({
                current: 1
              })
              this.getWishList()
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
   * 长按心愿
   * @param {*} e 
   */
  longpressWish(e) {
    wx.vibrateShort()
    let { _id, achieve } = e.currentTarget.dataset.item
    let itemList =  achieve ? ['删除'] : ['删除', '心愿达成']
    wx.showActionSheet({
      itemList,
      success: res => {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          wx.showLoading()
          wx.cloud.callFunction({
            name: 'deleteWish',
            data: {
              id: _id
            },
            success: res => {
              console.log('res', res)
              wx.hideLoading()
              wx.showToast({
                title: '删除成功',
              })
              this.getWishList()
            },
            fail: err => {
              wx.hideLoading()
              console.log(err)
            }
          })
        } else if (res.tapIndex == 1) {
          this.wishDetail(_id)
        }
      },
      fail: res => {
        console.log(res.errMsg)
      }
    })
  }
})