var app = getApp()
Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    score: 0,
    time: 60,
    shouldStop: false,
    blockData: []
  },
  onUnload () {
    this.setData({
      shouldStop: true,
    }) 
  },
  handleClick: function (events) {
    var id = events.currentTarget.id;
    var line = id.split("-")[1];
    var column = id.split("-")[2];
    var isBlack = id.split("-")[3];
    var blockData = this.data.blockData.reverse();
    var score = this.data.score;
    var orderArray = [0, 0, 0, 0];
    // 判断是否是第一行
    if (line != blockData[0].id) {
      this.handleWrong(0, score);
      return;
    }
    // 判断是否正确
    if (isBlack != 1) {
      this.handleWrong(1, score);
      return;
    }

    // 正确下一个
    // 分数++
    // 最后一个小块的id为分数+10
    score++;
    orderArray[Math.floor(Math.random() * 4)] = 1;
    blockData.push({
      id: score + 10,
      block: orderArray
    });
    blockData.shift();
    this.setData({
      silding: true,
      score: score,
      blockData: blockData.reverse()
    });
  },
  handleWrong: function (type, score) {
    const titleArr = ["请点击最下一行区域！", "请点击黑色块儿！", "时间到"];
    var _this = this;
    app.globalData.currentScore = score;
    // 停止计数器
    _this.setData({
      shouldStop: true
    });
    // 若此分数比最高分数还高 将其存入本地
    if (score > app.globalData.timeScore) {
      app.globalData.timeScore = score;
      wx.setStorageSync('timeScore', score);
    }
    var timer = setTimeout(function () {
      clearTimeout(timer);
    }, 2000);
    wx.showModal({
      title: '游戏结束',
      content: titleArr[type],
      confirmText: "重新开始",
      cancelText: '退出',
      success: (res) => {
        if (res.confirm) {
          this.reload()
        } else {
          wx.navigateBack()
        }
      }
    })
  },
  timeInterval: function () {
    var that = this;
    var timer = setInterval(function () {
      // 判断是否小于0
      var nowTime = that.data.time;

      if (that.data.shouldStop) {
        clearInterval(timer);
      }

      if (nowTime > 1) {
        that.setData({
          time: nowTime - 1
        });
        return;
      }

      that.setData({
        time: nowTime - 1
      });
      that.handleWrong(2, that.data.score);
      clearInterval(timer);
    }, 1000);
  },
  onLoad: function () {
    this.timeInterval();
    this.init()
  },
  init () {
    var array = [];
    // 先生成一个10个长度的数组
    for (var i = 0; i < 10; i++) {
      // 生成一个随机位数为1的数组
      var orderArray = [0, 0, 0, 0];
      var randomNum = Math.floor(Math.random() * 4);
      orderArray[randomNum] = 1;
      array.push({
        id: i,
        block: orderArray
      });
    }
    this.setData({
      blockData: array.reverse()
    });
  },
  reload () {
    this.setData({
      score: 0,
      time: 60,
      shouldStop: false,
    })
    this.init()
    this.timeInterval();
  }
})