// pages/plan/plan.js
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
    showModal: false, // 是否显示新增计划的弹框
    inputValue: '', // 计划内容
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const theme = wx.getStorageSync('theme') || 0
    this.setData({
      theme
    })
    this.getList()
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
   * 输入框
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
        console.error('err', err)
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
      name: 'addPlan',
      data: {
        openid: app.globalData.openid,
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        createTime: new Date().getTime(),
        value: inputValue,
      },
      success: res => {
        // console.log(res)
        wx.hideLoading()
        this.setData({
          inputValue: '',
          btnDisabled: false,
        })
        wx.showToast({
          title: '添加成功',
        })
        this.toggleModal()
        this.getList()
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
   * 获取数据列表
   */
  getList() {
    // console.log(app.globalData)
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getPlanList',
      data: {
        couple: [app.globalData.openid, app.globalData.bindOpenid],
      },
      success: res => {
        // console.log('res', res)
        this.setData({
          list: res.result.data,
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
   * 删除某条
   * @param {*} e 
   */
  delete(e) {
    wx.vibrateShort()
    // console.log(e)
    let { _id } = e.currentTarget.dataset.item
    wx.showActionSheet({
      itemList: ['删除'],
      success: res => {
        // console.log(res.tapIndex)
        wx.showLoading()
        wx.cloud.callFunction({
          name: 'deleteAgreement',
          data: {
            id: _id
          },
          success: res => {
            // console.log('res', res)
            wx.hideLoading()
            wx.showToast({
              title: '删除成功',
            })
            this.getList()
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