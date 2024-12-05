// pages/childrenPayment/childrenPayment.js
const utils = require('../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    curId: null,
    paymentId: null,
    paymentName: '',
    paymentList: [],
    inputValue: '',
    theme: 0,
    btnDisabled: false, // 提交按钮可点状态
    btnLoading: false, // 提交按钮上loading状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options && options.childrenId && options.paymentId && options.paramsStr) {
      const childrenId = options.childrenId
      const paymentId = options.paymentId
      const paymentName = options.paymentName
      const paymentValue = options.paymentValue
      const paramsArr = JSON.parse(options.paramsStr)
      this.setData({
        paymentId: Number(paymentId),
        paymentName,
        inputValue: paymentValue,
        paymentList: paramsArr,
        curId: childrenId
      })
    }
    const theme = wx.getStorageSync('theme') || 0
    this.setData({
      theme
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 监听输入框内容变化
  amountInput(e) {
    let value = e.detail.value;
    // 只保留数字部分
    value = value.replace(/[^0-9]/g, '');
    // 去掉开头多余的 "0"，但保留单个 "0"
    if (value.length > 1 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }
    this.setData({
      inputValue: value
    });
  },
  updateArray(list, curID, curValue) {
    // 查找是否有 id 为 curID 的元素
    const index = list.findIndex(item => item.id === curID);
    
    if (index !== -1) {
      // 如果找到，更新对应元素的 value
      list[index].value = Number(curValue);
    } else {
      // 如果没有找到，新增一个元素
      list.push({ id: curID, value: Number(curValue) });
    }
  
    return list; // 返回更新后的数组
  },
  /**
   * 提交
   */
  submit() {
    if(this.data.btnDisabled) {
      return
    }
    if(!utils.regExpMoney2(this.data.inputValue)) {
      wx.showToast({
        title: '请输入正整数金额',
        icon: 'none'
      })
      return
    }
    this.setData({
      btnDisabled: true,
      btnLoading: true,
    })
    const { curId, paymentId, inputValue, paymentList } = this.data
    const PL = this.updateArray(paymentList, paymentId, inputValue)
    wx.cloud.callFunction({
      name: 'editChildren',
      data: {
        id: curId,
        paymentList: PL
      },
      success: res => {
        console.log(res, curId, PL)
        this.setData({
          btnDisabled: false,
          btnLoading: false,
        })
        wx.showToast({
          title: '编辑成功'
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
  },
})