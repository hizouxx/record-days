// miniprogram/pages/piggyBankAdd/piggyBankAdd.js
const app = getApp();
const utils = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    IncomeList: app.globalData.IncomeList, // 收入类型列表
    PayList: app.globalData.PayList, // 支出类型列表
    theme: 0,
    type: 'pay', // 支出类型：imcome|pay
    purpose: 0, // 支出｜收入的目的（去向）
    remark: '', // 备注
    amount: null, // 账户金额
    btnDisabled: false, // 提交按钮可点状态
    btnLoading: false, // 提交按钮上loading状态
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
   * 选择支出｜收入类型
   * @param {*} e 
   */
  selectType(e) {
    console.log(e)
    let {type} = e.currentTarget.dataset
    this.setData({
      type,
      purpose: 0
    })
  },
  /**
   * 选择支出｜收入去向
   * @param {*} e 
   */
  selectPurpose(e) {
    console.log(e)
    let {purpose} = e.currentTarget.dataset
    this.setData({
      purpose
    })
  },
  /**
   * 金额输入框
   * @param {*} e 
   */
  amountInput(e) {
    console.log(e)
    this.setData({
      amount: e.detail.value
    })
  },
  /**
   * 备注输入框
   * @param {*} e 
   */
  remarkInput(e) {
    console.log(e)
    this.setData({
      remark: e.detail.value
    })
  },
  /**
   * 调用云函数进行审核文字合法性
   */
  checkMsg() {
    if(this.data.btnDisabled) {
      return
    }
    let { type, amount, remark } = this.data
    if(remark.trim() === '') {
      let title = type == 'pay' ? '支出去向' : '收入来源'
      wx.showToast({
        title: title + '字段不能为空',
        icon: 'none'
      })
      return
    }
    if(!utils.regExpMoney(amount)) {
      wx.showToast({
        title: '请输入正确金额',
        icon: 'none'
      })
      return
    }
    this.setData({
      btnDisabled: true,
      btnLoading: true,
    })
    wx.cloud.callFunction({
      name: 'checkMsg' ,
      data:{
        'content': this.data.remark
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
        console.error('err', err)
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
    let { type, amount, purpose, remark } = this.data
    wx.cloud.callFunction({
      name: 'addBill',
      data: {
        createTime: new Date().getTime(),
        openid: app.globalData.openid,
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        type,
        amount,
        purpose,
        remark,
      },
      success: res => {
        console.log(res)
        this.setData({
          btnDisabled: false,
          btnLoading: false,
        })
        wx.showToast({
          title: '添加账单成功'
        })
        wx.navigateBack()
      },
      fail: err => {
        console.error('err', err)
        this.setData({
          btnDisabled: false,
          btnLoading: false,
        })
      }
    })
  }
})