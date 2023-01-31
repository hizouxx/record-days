// pages/2048/2048.js
const app = getApp()
var Main = require("./main.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    ColorList: [],
    theme: 0, // 当前主题色索引值
    hidden: false,
    start: "开始游戏",
    num: [],
    score: 0,
    bestScore: 0, // 最高分
    endMsg: '',
    over: false // 游戏是否结束 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      theme: wx.getStorageSync('theme') || 0, //主题
      ColorList: app.globalData.ColorList, // 主题色列表
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (!wx.getStorageSync("highScore"))
      wx.setStorageSync('highScore', 0);
    this.gameStart();
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

  gameStart: function () { // 游戏开始
    var main = new Main(4);
    this.setData({
      main: main,
      bestScore: wx.getStorageSync('highScore')
    });
    this.data.main.__proto__ = main.__proto__;

    this.setData({
      hidden: true,
      over: false,
      score: 0,
      num: this.data.main.board.grid
    });
  },
  gameOver: function () { // 游戏结束
    this.setData({
      over: true
    });

    if (this.data.score >= 2048) {
      this.setData({
        endMsg: '恭喜达到2048！'
      });
      wx.setStorageSync('highScore', this.data.score);
    } else if (this.data.score > this.data.bestScore) {
      this.setData({
        endMsg: '创造新纪录！'
      });
      wx.setStorageSync('highScore', this.data.score);
    } else {
      this.setData({
        endMsg: '游戏结束！'
      });
    }
  },
  // 触摸
  touchStartX: 0,
  touchStartY: 0,
  touchEndX: 0,
  touchEndY: 0,
  touchStart: function (ev) { // 触摸开始坐标
    var touch = ev.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;

  },
  touchMove: function (ev) { // 触摸最后移动时的坐标
    var touch = ev.touches[0];
    this.touchEndX = touch.clientX;
    this.touchEndY = touch.clientY;
  },
  touchEnd: function () {
    var disX = this.touchStartX - this.touchEndX;
    var absdisX = Math.abs(disX);
    var disY = this.touchStartY - this.touchEndY;
    var absdisY = Math.abs(disY);

    if (this.data.main.isOver()) { // 游戏是否结束
      this.gameOver();
    } else {
      if (Math.max(absdisX, absdisY) > 10) { // 确定是否在滑动
        this.setData({
          start: "重新开始",
        });
        var direction = absdisX > absdisY ? (disX < 0 ? 1 : 3) : (disY < 0 ? 2 : 0); // 确定移动方向
        var data = this.data.main.move(direction);
        this.updateView(data);
      }
    }
  },
  updateView(data) {
    var max = 0;
    for (var i = 0; i < 4; i++)
      for (var j = 0; j < 4; j++)
        if (data[i][j] != "" && data[i][j] > max)
          max = data[i][j];
    this.setData({
      num: data,
      score: max
    });
  },

  confirm() {
    this.setData({
      over: false,
    });
  },
})