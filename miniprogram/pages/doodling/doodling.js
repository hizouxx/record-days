const app = getApp()
Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    showSetting: false,
    colorList: [
      "#333333",
      "#e54d42",
      "#f37b1d",
      "#fbbd08",
      "#8dc63f",
      "#39b54a",
      "#1cbbb4",
      "#0081ff",
      "#6739b6",
      "#9c26b0",
      "#e03997",
      "#a5673f",
      "#8799a3",
    ],
    penWidth: 2,
    penColor: '#333333',
    isClear: false,
    colorIndex: 0,
    revoke: [],
  },
  onLoad: function (options) {
  },

  onReady: function () {
    this.context = wx.createCanvasContext('myCanvas');
    this.context.setFillStyle('white')
    this.context.fillRect(0, 0, 750, 600)
    this.context.draw()
  },

  startX: 0,
  startY: 0,
  begin: false,
  actions: [],

  touchStart(e) {
    this.setStyle();
    this.startX = e.changedTouches[0].x;
    this.startY = e.changedTouches[0].y;
    this.context.beginPath();
    var revoke = this.data.revoke;
    revoke.push(this.actions.length);
    this.setData({
      revoke: revoke
    });
    var actions = this.context.getActions();
    this.actions = this.actions.concat(actions);
    wx.drawCanvas({
      canvasId: "myCanvas",
      actions: actions,
      reserve: true
    })
  },

  touchMove(e) {
    this.context.moveTo(this.startX, this.startY);
    this.startX = e.changedTouches[0].x;
    this.startY = e.changedTouches[0].y;
    this.context.lineTo(this.startX, this.startY);
    this.context.stroke();
    var actions = this.context.getActions();
    this.actions.push(actions[0]);
    wx.drawCanvas({
      canvasId: 'myCanvas',
      reserve: true,
      actions: actions
    })
  },

  touchEnd(e) {},

  /**
   * 后退一步
   */
  revokeCanvas() {
    var revoke = this.data.revoke;
    if (revoke.length != 0) {
      wx.drawCanvas({
        canvasId: "myCanvas",
        actions: [],
        reserve: false
      });
      this.actions = this.actions.slice(0, revoke[revoke.length - 1]);
      wx.drawCanvas({
        canvasId: "myCanvas",
        actions: this.actions,
        reserve: true
      })
      revoke.pop();
      this.setData({
        revoke: revoke
      })
    }
  },

  setStyle() {
    this.context.setStrokeStyle(this.data.penColor)
    this.context.setLineWidth(this.data.penWidth)
    this.context.setLineCap('round') // 让线条圆润
    this.context.setLineJoin("round")
  },

  /**
   * 选择画笔粗细
   * @param {x} e 
   */
  selectPenWidthTap(e) {
    var penWidth = e.currentTarget.dataset.width;
    this.setData({
      penWidth: penWidth
    })
  },
  /**
   * 选择颜色
   * @param {*} e 
   */
  selectPenColorTap(e) {
    var index = e.currentTarget.dataset.index;
    var colorList = this.data.colorList;
    this.setData({
      isClear: false,
      colorIndex: index,
      penColor: colorList[index]
    })
  },

  /**
   * 橡皮擦
   */
  clearTap() {
    var isClear = this.data.isClear;
    var colorIndex = this.data.colorIndex;
    var colorList = this.data.colorList;
    var penColor = isClear ? colorList[colorIndex] : '#ffffff';
    this.setData({
      penColor: penColor,
      isClear: !isClear
    })
  },
  /**
   * 删除当前画布
   */
  deleteTap() {
    var colorIndex = this.data.colorIndex;
    var colorList = this.data.colorList;
    //重新画一张白色背景，避免后续在不同机型生成图片背景有的是黑的
    this.context = wx.createCanvasContext('myCanvas');
    this.context.setFillStyle('white')
    this.context.fillRect(0, 0, 750, 700)
    this.context.draw()
    this.setData({
      isClear: false,
      penColor: colorList[colorIndex],
    })
  },
  /**
   * 保存图片
   */
  confirmTap() {
    wx.showLoading({
      title: '正在保存图片',
    })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      fileType: 'jpg',
      canvasId: 'myCanvas',
      success: res => {
        var tempFilePath = res.tempFilePath;
        // console.log(tempFilePath);
        wx.previewImage({
          urls: [tempFilePath], // 需要预览的图片http链接列表
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: () => {
        wx.hideLoading()
      }
    })
  },

  /**
   * 切换设置按钮
   */
  toggleSetting(){
    this.setData({
      showSetting: !this.data.showSetting
    })
  },

})