// pages/planAdd/planAdd.js
const app = getApp();
const utils = require('../../utils/util.js')
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
    plan: '', // 计划内容
    remark: '', // 计划完成奖励
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
   * 计划内容输入框
   * @param {} e 
   */
  planInput(e) {
    console.log(e)
    this.setData({
      plan: e.detail.value
    })
  },
  /**
   * 计划完成奖励输入框
   * @param {} e 
   */
  remarkInput(e) {
    console.log(e)
    this.setData({
      remark: e.detail.value
    })
  },
  /**
   * 调用云函数进行审核
   */
  checkMsg(){
    let { remark, plan } = this.data
    if(!utils.regExpName(plan)) {
      wx.showToast({
        title: '计划内容由1-12位字符组成',
        icon: 'none'
      })
      return
    }
    if(!utils.regExpName(remark)) {
      wx.showToast({
        title: '完成奖励由1-12位字符组成',
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
        'content': this.data.plan + this.data.remark 
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
    let { plan, remark} = this.data
    //调用云函数
    wx.cloud.callFunction({
      name: 'addPlan',
      data: {
        openid: app.globalData.openid,
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        year: new Date().getFullYear(), // 年份
        plan,
        remark,
        achieve: false,
        achieveDate: null
      },
      success: res => {
        console.log(res)
        this.setData({
          btnDisabled: false,
          btnLoading: false,
        })
        wx.showToast({
          title: '计划添加成功'
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