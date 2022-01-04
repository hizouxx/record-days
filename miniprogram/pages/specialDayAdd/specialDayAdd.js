// miniprogram/pages/specialDayAdd/specialDayAdd.js
const app = getApp();
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
    btnDisabled: false,
    btnLoading: false,
    name: 0, // 纪念日名称
    remark: '', // 备注
    date: utils.formatDate(new Date()), // 今天日期
    lunarDate: calendar.solar2lunar(), // 农历日期
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(calendar.solar2lunar())
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
   * 选择纪念日类型
   * @param {*} e 
   */
  selectDayName(e) {
    console.log(e)
    let {name} = e.currentTarget.dataset
    this.setData({
      name
    })
  },
  /**
   * 备注输入框
   * @param {} e 
   */
  remarkInput(e) {
    console.log(e)
    this.setData({
      remark: e.detail.value
    })
  },
  /**
   * 选择纪念日日期
   * @param {*} e 
   */
  dateChange(e) {
    console.log(e.detail.value)
    let dateArr = e.detail.value.split("-")
    this.setData({
      date: e.detail.value,
      lunarDate: calendar.solar2lunar(dateArr[0], dateArr[1], dateArr[2])
    })
  },
  /**
   * 调用云函数进行审核
   */
  checkMsg(){
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
    let { name, remark, date} = this.data
    //调用云函数
    wx.cloud.callFunction({
      name: 'addSpecialDay',
      data: {
        openid: app.globalData.openid,
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        name,
        date,
        remark,
      },
      success: res => {
        console.log(res)
        this.setData({
          btnDisabled: false,
          btnLoading: false,
        })
        wx.showToast({
          title: '纪念日添加成功'
        })
        wx.navigateBack({
          delta: 0,
        })
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