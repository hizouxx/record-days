// miniprogram/pages/welcome/welcome.js
const app = getApp()
const utils = require('../../utils/util.js')
let defaultList = [{
    icon: 'moneybagfill',
    color: 'red',
    path: 'piggyBank',
    name: '家庭储蓄'
  },
  {
    icon: 'timefill',
    color: 'orange',
    path: 'specialDay',
    name: '家庭纪念日'
  },
  {
    icon: 'camerafill',
    color: 'yellow',
    path: 'photoWall',
    name: '家庭相册'
  },
  {
    icon: 'likefill',
    color: 'green',
    path: 'wish',
    name: '家庭心愿'
  },
  {
    icon: 'newshotfill',
    color: 'cyan',
    path: 'agreement',
    name: '家庭协议'
  },
  {
    icon: 'formfill',
    color: 'blue',
    path: 'log',
    name: '家庭日记'
  },
  {
    icon: 'skinfill',
    color: 'mauve',
    path: 'doodling',
    name: '画板工具'
  },
  {
    icon: 'myfill',
    color: 'brown',
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
const swiperList = [{
  id: 0,
  type: 'image',
  url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
}, {
  id: 1,
  type: 'image',
  url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
}, {
  id: 2,
  type: 'image',
  url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
}, {
  id: 3,
  type: 'image',
  url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
}, {
  id: 4,
  type: 'image',
  url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
}, {
  id: 5,
  type: 'image',
  url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
}, {
  id: 6,
  type: 'image',
  url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
}]
let lunarInfo = [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554,
  0x056a0, 0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0,
  0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566,
  0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550,
  0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0,
  0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263,
  0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0,
  0x195a6, 0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, 0x04af5,
  0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, 0x0c960, 0x0d954, 0x0d4a0,
  0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, 0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9,
  0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, 0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0,
  0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520,
  0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0
]
const chineseNumber = [
  "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "十二"
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
    swiperList: swiperList,
    lunarInfo: lunarInfo,
    chineseNumber: chineseNumber,
    week: utils.getWeekByDate(new Date()),
    lunarDate: '', // 农历日期
    clockTimer: null,
    clock: '', // 时钟
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
    this.setData({
      list: listSort ? JSON.parse(listSort) : defaultList, //九宫格数据列表
      theme: wx.getStorageSync('theme') || 0, //主题
      ColorList: app.globalData.ColorList, // 主题色列表
    })

    // 获取openid
    this.onGetOpenid()
    // 获取农历日期
    this.getLunarDate()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
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

    // 时间
    let clockTimer = setInterval(() => {
      let hour = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
      let minute = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      this.setData({
        clock: hour + ':' + minute
      });
      // console.log('clock',this.data.clock)
    }, 1000)
    this.setData({
      clockTimer
    })

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.clockTimer)
  },
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

  /**
   *  获取农历日期
   */
  getLunarDate() {
    var yearCyl, monCyl, dayCyl;
    var leapMonth = 0;
    var date = new Date('1900/1/31');
    var curDate = new Date();
    // 求出和1900年1月31日相差的天数
    var offset = parseInt((curDate.getTime() - date.getTime()) / 86400000);
    dayCyl = offset + 40;
    monCyl = 14;
    // 用offset减去每农历年的天数
    // 计算当天是农历第几天
    // i最终结果是农历的年份
    // offset是当年的第几天
    var iYear, daysOfYear = 0;
    for (iYear = 1900; iYear < 2050 && offset > 0; iYear++) {
      daysOfYear = this.yearDays(iYear);
      offset -= daysOfYear;
      monCyl += 12;
    }
    if (offset < 0) {
      offset += daysOfYear;
      iYear--;
      monCyl -= 12;
    }
    yearCyl = iYear - 1864;
    leapMonth = this.leapMonth(iYear); // 闰哪个月,1-12
    var leap = false; // 默认值
    // 用当年的天数offset,逐个减去每月（农历）的天数，求出当天是本月的第几天
    var iMonth, daysOfMonth = 0;
    for (iMonth = 1; iMonth < 13 && offset > 0; iMonth++) {
      // 闰月
      if (leapMonth > 0 && iMonth == (leapMonth + 1) && !leap) {
        --iMonth;
        leap = true;
        daysOfMonth = this.leapDays(iYear);
      } else
        daysOfMonth = this.monthDays(iYear, iMonth);

      offset -= daysOfMonth;
      // 解除闰月
      if (leap && iMonth == (leapMonth + 1))
        leap = false;
      if (!leap)
        monCyl++;
    }
    // offset为0时，并且刚才计算的月份是闰月，要校正
    if (offset == 0 && leapMonth > 0 && iMonth == leapMonth + 1) {
      if (leap) {
        leap = false;
      } else {
        leap = true;
        --iMonth;
        --monCyl;
      }
    }
    // offset小于0时，也要校正
    if (offset < 0) {
      offset += daysOfMonth;
      --iMonth;
      --monCyl;
    }
    var newday = this.getChinaDayString(offset + 1);
    var newmonth = this.data.chineseNumber[iMonth - 1];
    this.setData({
      lunarDate: newmonth + '月' + newday
    })
    app.globalData.lunarDate = newmonth + '月' + newday
    // console.log(newmonth + '月' + newday);
  },
  yearDays(y) {
    var i, sum = 348;
    for (i = 0x8000; i > 0x8; i >>= 1) {
      if ((this.data.lunarInfo[y - 1900] & i) != 0)
        sum += 1;
    }
    return (sum + this.leapDays(y));
  },
  leapDays(y) {
    if (this.leapMonth(y) != 0) {
      if ((this.data.lunarInfo[y - 1900] & 0x10000) != 0)
        return 30;
      else
        return 29;
    } else
      return 0;
  },
  leapMonth(y) {
    return this.data.lunarInfo[y - 1900] & 0xf;
  },
  monthDays(y, m) {
    if ((this.data.lunarInfo[y - 1900] & (0x10000 >> m)) == 0)
      return 29;
    else
      return 30;
  },
  getChinaDayString(day) {
    var chineseTen = ["初", "十", "廿", "卅"];
    var n = day % 10 == 0 ? 9 : day % 10 - 1;
    if (day > 30)
      return "";
    if (day == 10)
      return "初十";
    else
      return chineseTen[parseInt(day / 10)] + this.data.chineseNumber[n];
  }
})