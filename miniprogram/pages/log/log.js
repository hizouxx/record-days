// miniprogram/pages/specialDay/specialDay.js
const app = getApp()
const utils = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    lunarDate: "", // 农历日期
    week: utils.getWeekByDate(new Date()), // 星期几
    theme: 0,
    today: utils.formatDate(new Date()),
    current: 0, // 当前swiper索引值
    loading: true,
    btnDisabled: false,
    btnLoading: false,
    emojiList: [
      '😀','😁','😂','😃','😄','😅','😆','😉','😊','😋',
      '😎','😍','😘','😗','😙','😚','😇','😐','😑','😶',
      '😏','😣','😥','😮','😯','😪','😫','😴','😌','😛',
      '😜','😝','😒','😓','😔','😕','😲','😷','😖','😞',
      '😟','😤','😢','😭','😦','😧','😨','😬','😰','😱',
      '😳','😵','😡','😠'
    ],
    remark: '', // 内容
    dataList: [] // 列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData)
    const theme = wx.getStorageSync('theme') || 0
    this.setData({
      theme,
      lunarDate: app.globalData.lunarDate,
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
    // 因为自页面用了navigateBack。为了确保返回后刷新数据，所以接口调用放onShow而不放在onLoad里
    this.getDataList()
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
   * 手滑切换swiper触发事件
   */
  swiperChange(e) {
    // console.log('swiperChange', e)
    let {current} = e.detail
    this.setData({
      current
    })
  },

  /**
   * 获取数据列表
   */
  getDataList() {
    wx.cloud.callFunction({
      name: 'getLogList',
      data: {
        couple: [app.globalData.openid, app.globalData.bindOpenid],
      },
      success: res => {
        console.log('res', res)
        let dataList = res.result.data && res.result.data.map( i =>{
          i.date = utils.formatDateTime(new Date(i.createTime)).split(' ')[0]
          i.time = utils.formatDateTime(new Date(i.createTime)).split(' ')[1]
          return i
        })
        this.setData({
          dataList,
          loading: false
        })
      },
      fail: (err) => {
        console.log('err', err)
        this.setData({
          loading: false
        })
      }
    })
  },
  /**
   * 删除某一条
   * @param {} e 
   */
  deleteLog(e) {
    wx.vibrateLong()
    let { id } = e.currentTarget.dataset
    wx.showActionSheet({
      itemList: ['删除'],
      success: res => {
        // console.log(res.tapIndex)
        wx.showLoading()
        wx.cloud.callFunction({
          name: 'deleteLog',
          data: {
            id
          },
          success: res => {
            console.log('res', res)
            wx.hideLoading()
            wx.showToast({
              title: '删除成功',
            })
            this.getDataList()
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
  },


  /**
   * 输入表情
   */
  clickEmoji(e) {
    console.log(e)
    let {emoji} = e.currentTarget.dataset
    this.setData({
      remark: this.data.remark + emoji
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
   * 调用云函数进行审核
   */
  checkMsg(){
    let {remark} = this.data
    if(remark == '') {
      wx.showToast({
        title: '请输入内容',
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
        'content': remark
      },
      success: res => {
        console.log(res)
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
      fail: (err) => {
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
    let { remark } = this.data
    //调用云函数
    wx.cloud.callFunction({
      name: 'addLog',
      data: {
        openid: app.globalData.openid,
        createTime: new Date().getTime(),
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        remark,
      },
      success: res => {
        console.log(res)
        this.getDataList()
        wx.showToast({
          title: '添加成功'
        })
        this.setData({
          btnDisabled: false,
          btnLoading: false,
          current: 1,
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