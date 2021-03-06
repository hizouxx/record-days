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
    this.getWishList()
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
   * 显示｜隐藏弹框
   */
  toggleModal() {
    this.setData({
      showModal: !this.data.showModal
    })
  },
  /**
   * 心愿输入框
   * @param {*} e 
   */
  input(e) {
    this.setData({
      inputValue: e.detail.value,
       btnDisabled: e.detail.value == '' ? true : false
    })
  },
  /**
   * 调用云函数进行审核
   */
  checkMsg() {
    wx.showLoading()
    this.setData({
      btnDisabled: true
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
          wx.hideLoading()
          this.setData({
            btnDisabled: false
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
        wx.hideLoading()
        this.setData({
          btnDisabled: false
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
        console.log(res)
        wx.hideLoading()
        this.setData({
          inputValue: '',
          btnDisabled: false,
        })
        wx.showToast({
          title: '许愿成功',
        })
        this.toggleModal()
        this.getWishList()
      },
      fail: err => {
        console.log(err)
        wx.hideLoading()
        this.setData({
          btnDisabled: false
        })
      }
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
        let list = res.result.data.map(i=>{
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
   * @param {*} e 
   */
  wishDetail(e) {
    // console.log(e)
    let {_id} = e.currentTarget.dataset.item
    wx.showModal({
      title: '心愿卡',
      content: '是否达成了心愿？',
      confirmText: "心愿达成",
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
   * 删除某条心愿
   * @param {*} e 
   */
  deleteWish(e) {
    wx.vibrateShort()
    let { _id } = e.currentTarget.dataset.item
    wx.showActionSheet({
      itemList: ['删除'],
      success: res => {
        console.log(res.tapIndex)
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
      },
      fail: res => {
        console.log(res.errMsg)
      }
    })
  }
})