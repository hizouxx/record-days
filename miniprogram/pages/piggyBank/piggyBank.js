// miniprogram/pages/piggyBank/piggyBank.js
const app = getApp();
const utils = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    IncomeList: app.globalData.IncomeList,
    PayList: app.globalData.PayList,
    theme: 0,
    loading: true,
    curRange: 0, // 切换日期范围tab的当前索引
    eye: true, // 总金额的可见状态
    dateStart: '', //默认查询起始时间  
    dateEnd: '', //默认查询结束时间
    dataList: [], // 账单数据列表
    totalAmount: 0, // 总金额
    curTotalPay: 0, // 查询范围内支出
    curTotalIncome: 0, // 查询范围内收入
    numPayList: [], // 支出类型分类列表
    numIncomeList: [], // 收入类型分类列表
    showStatistics: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('app.globalData', app.globalData)
    const theme = wx.getStorageSync('theme') || 0
    this.setData({
      theme
    })

    // 获取当前月起始时间
    let curMonth = utils.getCurMonthStartAndEnd()
    // console.log('curMonth', curMonth)
    this.setData({
      dateStart: curMonth.start,
      dateEnd: curMonth.end,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 因为自页面用了navigateBack。为了确保返回后刷新数据，所以接口调用放onShow而不放在onLoad里
    this.getBillList()
    this.getTotalAmount()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},


  /**
   * 选择（起始）日期范围
   */
  bindDateStartChange(e) {
    this.setData({
      dateStart: e.detail.value,
      loading: true,
    })
    this.getBillList()
  },
  /**
   * 选择（截止）日期范围
   * @param {*} e 
   */
  bindDateEndChange(e) {
    this.setData({
      dateEnd: e.detail.value,
      loading: true,
    })
    this.getBillList()
  },

  /**
   * 切换日期范围tab
   */
  selectRange(e) {
    if (e.target.dataset.range === this.data.curRange) {
      return
    }
    // console.log(e)
    switch (e.target.dataset.range) {
      case 0:
        this.setData({
          curRange: 0,
          loading: true,
          dateStart: utils.getCurMonthStartAndEnd().start,
          dateEnd: utils.getCurMonthStartAndEnd().end,
        })
        this.getBillList()
        break;
      case 1:

        this.setData({
          curRange: 1,
          loading: true,
          dateStart: utils.getLastMonthStartAndEnd().start,
          dateEnd: utils.getLastMonthStartAndEnd().end,
        })
        this.getBillList()
        break;
      case 2:
        this.setData({
          curRange: 2,
          loading: true,
          dateStart: utils.getCurYearStartAndEnd().start,
          dateEnd: utils.getCurYearStartAndEnd().end,
        })
        this.getBillList()
        break;
      case 3:
        this.setData({
          curRange: 3,
        })
        break;
      default:
        break;
    }
  },

  /**
   * 隐藏/显示总财产
   */
  toggleMoneyStatus() {
    this.setData({
      eye: !this.data.eye
    })
  },

  /**
   * 新增账单
   */
  add() {
    wx.navigateTo({
      url: '/pages/piggyBankAdd/piggyBankAdd',
    })
  },

  /**
   *  获取某段时间内的账户数据
   */
  getBillList() {
    wx.cloud.callFunction({
      name: 'getBillList',
      data: {
        couple: [app.globalData.openid, app.globalData.bindOpenid],
        dateStart: new Date(this.data.dateStart).getTime(),
        dateEnd: new Date(this.data.dateEnd).getTime(),
      },
      success: res => {
        // console.log('res1', res)
        let curTotalPay = 0
        let curTotalIncome = 0
        let dataList = res.result && res.result.map(i => {
          if (i.type == 'pay') {
            curTotalPay = curTotalPay + parseFloat(i.amount)
          } else if (i.type == 'income') {
            curTotalIncome = curTotalIncome + parseFloat(i.amount)
          }
          i.date = utils.formatDate(new Date(i.createTime))
          return i
        })
        this.setData({
          dataList,
          curTotalPay: parseFloat(curTotalPay.toFixed(2)),
          curTotalIncome: parseFloat(curTotalIncome.toFixed(2)),
          numPayList: this.getNumList(dataList.filter(i => i.type === 'pay')),
          numIncomeList: this.getNumList(dataList.filter(i => i.type === 'income')),
          loading: false,
        })
        // console.log('numPayList', this.data.numPayList)
      },
      fail: err => {
        this.setData({
          loading: false,
          icon: 'none'
        })
        console.log(err)
      }
    })
  },

  /**
   * 获取各项支出（收入）的数量列表
   * @param {*} arr 收入或支出数据列表
   */
  getNumList(arr) {
    let newArr = [...new Set(arr.map(i => i.purpose))]; // 去重的时候需要注意和普通数组不同
    let list = [];
    newArr.forEach(i => {
      list.push(arr.filter(t => t.purpose === i));
    })
    let mlist = [];
    list.forEach((i, index) => {
      mlist.push({
        name: newArr[index],
        num: i.length,
        total: this.countTotal(i, 'amount')
      })
    })
    return mlist
  },
  /**
   * 对象数组中某个属性合计
   * @param {*} arr 对象数组
   * @param {*} keyName 属性
   */
  countTotal(arr, keyName) {
    let $total = 0;
    $total = arr.reduce(function (total, currentValue) {
      return currentValue[keyName] ? (total + parseFloat(currentValue[keyName])) : total;
    }, 0);
    // console.log('$total', $total, typeof $total)
    return {
      number: $total,
      string: $total.toFixed(2)
    }
  },

  /**
   * 是否显示统计数据
   */
  toggleShowStatistics() {
    this.setData({
      showStatistics: this.data.showStatistics ? false : true
    })
  },

  /**
   *  获取并计算总余额
   */
  getTotalAmount() {
    wx.cloud.callFunction({
      name: 'getBillList',
      data: {
        couple: [app.globalData.openid, app.globalData.bindOpenid],
        dateStart: new Date('2020/10/01').getTime(),
        dateEnd: new Date().getTime(),
      },
      success: res => {
        // console.log('res', res)
        let totalPay = 0,
          totalIncome = 0
        res.result && res.result.forEach(i => {
          if (i.type == 'pay') {
            totalPay = totalPay + parseFloat(i.amount)
          } else if (i.type == 'income') {
            totalIncome = totalIncome + parseFloat(i.amount)
          }
          this.setData({
            totalAmount: parseFloat(totalIncome - totalPay).toFixed(2)
          })
        })
        this.setData({
          totalAmount: parseFloat(totalIncome - totalPay).toFixed(2)
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  /**
   * 删除某条账单
   * @param {*} e 
   */
  deleteBill(e) {
    // console.log(e)
    wx.vibrateShort()
    let {
      id
    } = e.currentTarget.dataset
    wx.showActionSheet({
      itemList: ['删除'],
      success: res => {
        // console.log(res.tapIndex)
        wx.showLoading()
        wx.cloud.callFunction({
          name: 'deleteBill',
          data: {
            id
          },
          success: res => {
            // console.log('res', res)
            wx.hideLoading()
            wx.showToast({
              title: '删除成功',
            })
            this.getBillList()
            this.getTotalAmount()
          },
          fail: err => {
            wx.hideLoading()
            console.log(err)
          }
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },

})
