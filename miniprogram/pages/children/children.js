// pages/children/children.js
const utils = require('../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    paymentOptions: app.globalData.ChildrenPayment,
    theme: 0,
    loading: false,
    curChildrenIndex: 0,
    childrenList: [],
    curPaymentId: null,
    amountList: [
      {
        amount: 1000,
        loading: false,
      },
      {
        amount: 500,
        loading: false,
      },
      {
        amount: 200,
        loading: false,
      },
      {
        amount: 100,
        loading: false,
      },
      {
        amount: 50,
        loading: false,
      },
      {
        amount: 20,
        loading: false,
      },
      {
        amount: 10,
        loading: false,
      },
      {
        amount: 5,
        loading: false,
      },
    ],
    isCoinAnimation: false,
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log('app.globalData', app.globalData)
    const theme = wx.getStorageSync('theme') || 0
    this.setData({
      theme,
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
    // 因为子页面用了navigateBack。为了确保返回后刷新数据，所以接口调用放onShow而不放在onLoad里
    this.getChildrenList()
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

  pageToEdit (paramsObj) {
    const paramsStr = JSON.stringify(paramsObj)
    wx.navigateTo({
      url: '/pages/childrenEdit/childrenEdit?paramsStr=' + paramsStr,
    })
  },
  pageToAdd () {
    wx.navigateTo({
      url: '/pages/childrenEdit/childrenEdit',
    })
  },
  pageToPayment (e) {
    const { id, name, value } = e.currentTarget.dataset.item
    const paymentValue = value ? value : ''
    const { childrenList, curChildrenIndex } = this.data
    const { paymentList, _id } = childrenList[curChildrenIndex]
    const paramsStr = JSON.stringify(paymentList)
    wx.navigateTo({
      url: '/pages/childrenPayment/childrenPayment?childrenId=' + _id + '&paymentId=' + id + '&paymentName=' + name + '&paymentValue=' + paymentValue + '&paramsStr=' + paramsStr,
    })
  },

  getChildrenList() {
    this.setData({
      loading: true,
    })
    wx.cloud.callFunction({
      name: 'getChildrenList',
      data: {
        couple: [app.globalData.openid, app.globalData.bindOpenid],
      },
      success: res => {
        // console.log('res1', res)
        const getPercentage = (child, parent) => {
          if (child) {
            return (child / parent * 100).toFixed(2) + '%'
          } else {
            return '0%'
          }
        }
        const mergeArrays = (list1, list2) => {
          if (list2.length === 0) {
            return list1.map(item => ({
              ...item,
              value: 0,
              percentage: '0%'
            }));
          }
          // 将 list2 数组转成 id -> value 的映射对象，方便查找
          const bcaMap = list2.reduce((map, item) => {
            map[item.id] = item.value;
            return map;
          }, {});
          const totalValue = list2.reduce((sum, item) => sum + item.value, 0);
          // 合并 list1 数组与 list2 数组的元素
          return list1.map(item => ({
            ...item, // 保留 list1 中的其他字段
            value: bcaMap[item.id] !== undefined ? bcaMap[item.id] : 0, // 如果 list2 中有对应 id，使用 value，否则默认 0
            percentage: getPercentage(bcaMap[item.id], totalValue)
          }));
        }
        let childrenList = res.result && res.result.map(i => {
          i.birthdayDateString = utils.formatDate(new Date(i.birthday))
          i.piggyBank = Number(i.piggyBank)
          i.paymentListForWxml = mergeArrays(this.data.paymentOptions, i.paymentList)
          return i
        })
        this.setData({
          childrenList,
          loading: false,
        })
        if (childrenList?.length) {
          setTimeout(()=>{
            this.drawRingChart()
          }, 200)
        }
      },
      fail: err => {
        console.log(err)
        this.setData({
          loading: false,
          icon: 'none'
        })
      }
    })
  },

  /**
   * 删除或编辑
   * @param {*} e 
   */
  deleteOrEditChildren(e) {
    // console.log(e)
    wx.vibrateShort()
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success: res => {
        // console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          const { _id, name, birthday, avatar, piggyBank } = e.currentTarget.dataset.obj
          this.pageToEdit({
            _id,
            name,
            birthday,
            avatar,
            piggyBank
          })
        } else if (res.tapIndex == 1) {
          wx.showLoading({
            title: '操作中···',
          })
          wx.cloud.callFunction({
            name: 'deleteChildren',
            data: {
              id: e.currentTarget.dataset.obj._id
            },
            success: res => {
              // console.log('res', res)
              wx.hideLoading()
              wx.showToast({
                title: '删除成功',
              })
              this.setData({
                curChildrenIndex: 0,
              })
              this.getChildrenList()
            },
            fail: err => {
              console.log(err)
              wx.hideLoading()
            }
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },


  /**
   * 切换children
   * @param {*} e 
   */
  childTabClick (e) {
    // console.log('e', e)
    const {index} = e.currentTarget.dataset
    if (index === this.data.curChildrenIndex) return
    this.setData({
      curChildrenIndex: index,
    })
    if (this.data.childrenList?.length) {
      this.drawRingChart()
    }
  },

  drawRingChart() {
    const query = wx.createSelectorQuery();
    query
      .select('#ringCanvas')
      .fields({ node: true, size: true })
      .exec(this.initCanvas.bind(this));
  },

  initCanvas(res) {
    const { paymentList } = this.data.childrenList[this.data.curChildrenIndex]
    const canvas = res[0].node;
    const ctx = canvas.getContext('2d');


    // 设置高分屏适配
    const dpr = wx.getSystemInfoSync().pixelRatio;
    canvas.width = res[0].width * dpr;
    canvas.height = res[0].height * dpr;
    ctx.scale(dpr, dpr);

    // 圆心和半径
    const centerX = res[0].width / 2;
    const centerY = res[0].height / 2;
    const radius = Math.min(centerX, centerY) - 20; // 外圆半径
    const innerRadius = radius * 0.6; // 内圆半径

    /**
     * * * * * * * * * * * * * * * * *
     * 无数据处理
     */
    if (paymentList?.length === 0) {
      ctx.textAlign = 'center'; // 水平居中
      ctx.textBaseline = 'middle'; // 垂直居中
      ctx.font = '15px Arial'; // 设置字体样式
      ctx.fillStyle = '#333'; // 设置文本颜色
      ctx.fillText(`暂无支出数据`, centerX, centerY);
      return
    }
    /**
     * 无数据处理
     * * * * * * * * * * * * * * * * * *
     */

    // 计算总值
    // console.log('paymentList', paymentList)
    const totalValue = paymentList.reduce((sum, item) => sum + item.value, 0);
    // console.log('totalValue', totalValue)
    // 起始角度
    let startAngle = -Math.PI / 2; // 以 -90 度为起点

    // 设置隔断的角度
    const gapAngle = 10 * Math.PI / 360; // 每个隔断的角度，1度是 2π/360

    // 计算分区总角度
    const totalAngles = paymentList.map(item => (item.value / totalValue) * 2 * Math.PI);

    // 计算总的隔断角度
    const totalGapAngle = gapAngle * paymentList.length; // 每两个分区之间有一个隔断

    // 总角度不能超过 360°，计算总的分区角度
    const totalAnglesSum = totalAngles.reduce((sum, angle) => sum + angle, 0);
    const availableAngle = 2 * Math.PI - totalGapAngle;  // 可用的角度

    // 计算每个分区的实际角度，并添加隔断
    const anglesWithGap = totalAngles.map(angle => (angle / totalAnglesSum) * availableAngle);

    // 设置阴影效果
    ctx.shadowOffsetX = 6; // 阴影在水平方向上的偏移
    ctx.shadowOffsetY = 6; // 阴影在垂直方向上的偏移
    ctx.shadowBlur = 15;   // 阴影的模糊程度
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'; // 阴影的颜色，黑色并带有透明度
    paymentList.forEach((item, index) => {
      const angle = anglesWithGap[index];
      let curColor
      const idx = this.data.paymentOptions.findIndex(i=>i.id === item.id)
      if (idx > -1) {
        curColor = this.data.paymentOptions[idx].color
      }
      // 绘制环形分区
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + angle);
      ctx.arc(centerX, centerY, innerRadius, startAngle + angle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = curColor;
      ctx.fill();
      // 更新起始角度，增加隔断角度
      startAngle += angle + gapAngle; // 加上隔断角度
    });
    // console.log('this.data.paymentOptions', this.data.paymentOptions)
    // 绘制总金额文本
    ctx.textAlign = 'center'; // 水平居中
    ctx.textBaseline = 'middle'; // 垂直居中
    ctx.font = '15px Arial'; // 设置字体样式
    ctx.fillStyle = '#333'; // 设置文本颜色
    ctx.fillText(`¥${totalValue}`, centerX, centerY);

    // 移除阴影效果（防止影响其他绘制）
    ctx.shadowColor = 'rgba(0,0,0,0)';
  },

  // 按钮点击事件
  addRedEnvelope(e) {
    const { amount, loading } = e.currentTarget.dataset.item
    const { index } = e.currentTarget.dataset
    if (loading) return

    let AL = this.data.amountList
    AL[index].loading = true
    this.setData({
      amountList: AL
    })
    let CL = this.data.childrenList
    wx.cloud.callFunction({
      name: 'editChildren',
      data: {
        id: CL[this.data.curChildrenIndex]._id,
        piggyBank: CL[this.data.curChildrenIndex].piggyBank + amount,
      },
      success: res => {
        // console.log(res)
        CL[this.data.curChildrenIndex].piggyBank += amount
        this.setData({
          isCoinAnimation: true,
          childrenList: CL
        })
        setTimeout(() => {
          AL[index].loading = false
          this.setData({
            isCoinAnimation: false,
            amountList: AL
          })
        }, 1000);
      },
      fail: err => {
        console.error('err', err)
        wx.showToast({
          title: '添加压岁钱失败',
          icon: 'none'
        })
        AL[index].loading = false
        this.setData({
          amountList: AL
        })
      }
    })
  },
})