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
    loading: false,
    paymentLoading: false,
    curChildrenIndex: 0,
    childrenList: [],
    curPaymentId: null,
    paymentOptions: [
      { name: '穿搭', color: '#e54d42', id: 1 },
      { name: '喂养', color: '#fbbd08', id: 2 },
      { name: '玩具', color: '#39b54a', id: 3 },
      { name: '医疗', color: '#0081ff', id: 4 },
      { name: '教育', color: '#9c26b0', id: 5 },
      { name: '其他', color: '#a5673f', id: 6 },
    ],
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
    isDialogVisible: false, // 控制弹框显示隐藏
    inputValue: '', // 输入框的内容
    totalValue: 0,
    theme: 0,
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
      curChildrenIndex: wx.getStorageSync('childrenCur') || 0, // tab索引
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
        let childrenList = res.result && res.result.map(i => {
          i.birthdayDateString = utils.formatDate(new Date(i.birthday))
          i.piggyBank = Number(i.piggyBank)
          return i
        })
        this.setData({
          childrenList,
          loading: false,
        })
        if (childrenList?.length) {
          setTimeout(()=>{
            this.drawCircleChart()
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
      curChildrenIndex: index
    })
    if (this.data.childrenList?.length) {
      this.drawCircleChart()
    }
    wx.setStorageSync('childrenCur', index)
  },
  
  drawCircleChart() {
    const ctx = wx.createCanvasContext('circleCanvas', this);

    const radius = 60; // 外半径
    const innerRadius = 50; // 内半径，模拟环形效果
    const centerX = 120; // 圆心X坐标
    const centerY = 120; // 圆心Y坐标
    const gap = 0.04; // 每个扇形之间的间隙角度
    let startAngle = -90; // 起始角度
    const shadowOffset = 3; // 阴影偏移量
    const shadowBlur = 6; // 阴影模糊半径



    // 获取画布的宽高，确保每次绘制前清空画布
    const canvasWidth = 240; 
    const canvasHeight = 240;

    // 清空整个画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const { paymentList } = this.data.childrenList[this.data.curChildrenIndex]
    const totalValue = paymentList?.length ? paymentList.reduce((sum, item) => sum + item.value, 0) : 0; // 总和
    this.setData({
      totalValue
    })

    const paymentOptions = this.data.paymentOptions

    // 设置外环阴影效果
    ctx.setShadow(shadowOffset, shadowOffset, shadowBlur, 'rgba(0, 0, 0, 0.3)');

    // 绘制每个扇形
    paymentList?.length && paymentList.forEach((item, index) => {
      const angle = (item.value / totalValue) * ((2 - gap * paymentList.length) * Math.PI); // 当前扇形的角度
      const endAngle = startAngle + angle;

      // 绘制外环扇形
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.lineTo(centerX, centerY);
      ctx.closePath();
      let curColor
      const colorIdx = paymentOptions.findIndex(i=>i.id === item.id)
      if (colorIdx > -1) {
        curColor = paymentOptions[colorIdx].color
      }
      ctx.setFillStyle(curColor);
      ctx.fill();

      // 计算扇形区域中心位置，用来显示标签
      const midAngle = (startAngle + endAngle) / 2;
      const textX = centerX + (radius + 24) * Math.cos(midAngle); // 将标签移出一些
      const textY = centerY + (radius + 24) * Math.sin(midAngle); // 将标签移出一些

      // 清除阴影（为了确保其他元素不受影响）
      ctx.setShadow(0, 0, 0, 'rgba(0, 0, 0, 0)');

      // 在每个扇形区域标注名称
      ctx.setFontSize(12);
      ctx.setFillStyle('#8799a3');
      let curName
      const nameIdx = paymentOptions.findIndex(i=>i.id === item.id)
      if (nameIdx > -1) {
        curName = paymentOptions[nameIdx].name
      }
      ctx.fillText(curName, textX - 20, textY); // 小幅度调整x坐标以使文本居中

      // 设置外环阴影效果
      ctx.setShadow(shadowOffset, shadowOffset, shadowBlur, 'rgba(0, 0, 0, 0.3)');

      startAngle = endAngle + gap * Math.PI; // 更新起始角度，添加间隙
    });

    // 绘制内环（确保内环是最后绘制，遮住gap部分）
    ctx.setFillStyle('#fff'); // 白色内环
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    // 清除阴影（为了确保其他元素不受影响）
    ctx.setShadow(0, 0, 0, 'rgba(0, 0, 0, 0)');

    // 执行绘制
    ctx.draw();
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

  // 显示弹框
  showDialog(e) {
    const {id} = e.currentTarget.dataset
    this.setData({
      isDialogVisible: true,
      curPaymentId: id
    });
  },

  // 隐藏弹框
  hideDialog() {
    this.setData({
      isDialogVisible: false,
      inputValue: '' // 清空输入框内容
    });
  },

  // 监听输入框内容变化
  onInputChange(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  updateArray(arr, id, value) {
    // 找到满足条件的元素
    const found = arr?.length && arr.find(item => item.id === id);
  
    if (found) {
      // 如果找到，更新 bb 值
      found.value += value;
    } else {
      // 如果没有找到，添加新的元素
      arr.push({ id, value });
    }
    return arr; // 返回修改后的数组
  },

  // 确认按钮点击事件
  confirmDialog() {
    const { inputValue, curPaymentId } = this.data;
    if(!utils.regExpMoney2(inputValue)) {
      wx.showToast({
        title: '请输入正整数金额',
        icon: 'none'
      })
      return
    }
    this.setData({
      paymentLoading: true
    })
    this.hideDialog();
    wx.showLoading({
      title: '加载中···',
    })
    let CL = this.data.childrenList
    let PL = this.updateArray(this.data.childrenList[this.data.curChildrenIndex].paymentList, curPaymentId,  Number(inputValue))
    wx.cloud.callFunction({
      name: 'editChildren',
      data: {
        id: CL[this.data.curChildrenIndex]._id,
        paymentList: PL,
      },
      success: res => {
        // console.log(res)
        CL[this.data.curChildrenIndex].paymentList = PL
        wx.hideLoading()
        this.setData({
          childrenList: CL
        })
        this.drawCircleChart()
      },
      fail: err => {
        console.error('err', err)
        wx.hideLoading()
        wx.showToast({
          title: '添加支出失败',
          icon: 'none'
        })
      }
    })
  },
  
})