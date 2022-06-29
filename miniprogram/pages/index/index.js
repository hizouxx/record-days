// miniprogram/pages/welcome/welcome.js
const app = getApp()
const {
  calendar
} = require('../../utils/calendar.js')
let defaultList = [{
    icon: 'moneybagfill',
    color: 'red',
    path: 'piggyBank',
    name: '储蓄金'
  },
  {
    icon: 'timefill',
    color: 'orange',
    path: 'specialDay',
    name: '纪念日'
  },
  {
    icon: 'formfill',
    color: 'yellow',
    path: 'plan',
    name: '年度计划'
  },
  {
    icon: 'camerafill',
    color: 'olive',
    path: 'photoWall',
    name: '电子相册'
  },
  {
    icon: 'likefill',
    color: 'green',
    path: 'wish',
    name: '小心愿'
  },
  {
    icon: 'newshotfill',
    color: 'cyan',
    path: 'agreement',
    name: '家庭协议'
  },
  {
    icon: 'writefill',
    color: 'blue',
    path: 'log',
    name: '心情驿站'
  },
  {
    icon: 'infofill',
    color: 'purple',
    path: 'about',
    name: '程序介绍'
  },
  {
    icon: 'myfill',
    color: 'mauve',
    path: 'info',
    name: '账户信息'
  },
  {
    icon: 'settingsfill',
    color: 'black',
    path: 'setting',
    name: '设置'
  }
]

Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    current: 1, // swiper索引值
    theme: 0, // 当前主题色索引值
    ColorList: [], // 主题色列表
    dragColumnsSize: 0, // 九宫格排列列数
    list: [], // 九宫格数据列表
    bgCur: 0,
    loading: false,
    lunarDate: calendar.solar2lunar(), // 农历日期
    isSpringFestival: false, // 春节～元宵节
    isNewYearEve: false, // 小年～除夕
    milkoff: true, // 喂食动画开关
    milkCss: false, // 牛奶动画开关
    lastFeedTime: new Date().getTime(), // 上次喂食时间点
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取拖拽元素
    this.drag = this.selectComponent('#drag');
    this.drag.init();

    // 变量初始化
    let listSort = wx.getStorageSync('listSort')
    let lunarDate = calendar.solar2lunar()
    let dayArr = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', ]
    let dayArr2 = ['廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十', ]
    // console.log(calendar.solar2lunar())
    this.setData({
      list: listSort ? JSON.parse(listSort) : defaultList, //九宫格数据列表
      theme: wx.getStorageSync('theme') || 0, //主题
      ColorList: app.globalData.ColorList, // 主题色列表
      isSpringFestival: (lunarDate.IMonthCn === '正月' && dayArr.includes(lunarDate.IDayCn, 0)) ? true : false, // 春节～元宵节
      isNewYearEve: (lunarDate.IMonthCn === '腊月' && dayArr2.includes(lunarDate.IDayCn, 0)) ? true : false, // 小年～除夕
      lastFeedTime: wx.getStorageSync('lastFeedTime') || new Date().getTime(), //上次喂食时间点
    })

    // 获取openid
    this.onGetOpenid()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.childComponet = this.selectComponent('#cat')
    this.childComponet2 = this.selectComponent('#cat2')
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      bgCur: wx.getStorageSync('bgCur') || 0,
      dragColumnsSize: wx.getStorageSync('layoutColumns') || 3, // 九宫格排列列数
    })
    // console.log('show', this.data.dragColumnsSize)
    this.drag.init();
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
   * 获取openid
   */
  onGetOpenid: function () {
    this.setData({
      loading: true
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        // console.log('获取openid: success', res)
        app.globalData.openid = res.result.openid
        this.getUserInfo()
      },
      fail: (err) => {
        console.error('获取openid: err', err)
        this.setData({
          loading: false
        })
      }
    })
  },

  /**
   * 获取个人信息
   */
  getUserInfo() {
    wx.cloud.callFunction({
      name: 'getUserInfo',
      data: {
        openid: app.globalData.openid
      },
      success: res => {
        this.setData({
          loading: false
        })
        // console.log('获取个人信息: success', res)
        if (res.result.data && res.result.data.length > 0) {
          app.globalData.userInfo = res.result.data[0].userInfo
          app.globalData.bindOpenid = res.result.data[0].bindOpenid
        }
      },
      fail: (err) => {
        console.log('获取个人信息: err', err)
        this.setData({
          loading: false
        })
      }
    })
  },

  /**
   * 拖动成功
   * @param {*} e 
   */
  change(e) {
    // console.log("change", e.detail.listData)
    this.setData({
      list: e.detail.listData
    });
    // 保存拖动后的顺序
    wx.setStorage({
      key: "listSort",
      data: JSON.stringify(e.detail.listData)
    })
  },

  /**
   *  点击子九宫格某一项
   */
  itemClick(e) {
    if (this.data.loading) {
      return
    }
    // console.log(e);
    let {
      path
    } = e.detail.data
    wx.navigateTo({
      url: '/pages/' + path + '/' + path,
    })
  },

  // 喂食动画
  feedClick() {
    if (wx.getStorageSync('lastFeedTime')) {
      if (new Date().getTime() - wx.getStorageSync('lastFeedTime') < (1000 * 60)) {
        wx.showToast({
          title: '刚喂过，请稍后再喂',
          icon: 'none'
        })
        return
      }
    }
    wx.setStorageSync('lastFeedTime', new Date().getTime())
    if (this.data.milkoff) {
      this.setData({
        milkCss: true,
        milkoff: false
      });
      setTimeout(() => {
        this.setData({
          treemove: true,
        });
      }, 2000);
      setTimeout(() => {
        this.setData({
          milkoff: true,
          milkCss: false,
        })
      }, 3500);
      this.childComponet.toggle();
      this.childComponet2.toggle();
    };
  },
})