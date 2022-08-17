var app = getApp()
Page({
  data: {
    ColorList: app.globalData.ColorList,
    theme: 0,
    mineMap: {},
    timesGo: 0,
    minesLeft: 0,
  },
  mineMap: {}, //初始地图
  mineMapMapping: {}, //随机后的地图
  rowCount: 12,
  colCount: 12, //行列数
  mineCount: 12, //实际总雷数
  minMineCount: 28, //最小雷数
  maxMineCount: 28,
  minesLeft: 0,
  timesGo: 0, //用时
  timeInterval: null,
  flagOn: false,
  flags: 0,
  endOfTheGame: false,
  safeMinesGo: 0, //安全步数
  onLoad: function () //onload会在页面加载完成后立即发生
  {
    const theme = wx.getStorageSync('theme') || 0
    this.setData({
      theme,
      minesLeft: 0,
      timesGo: 0
    });
    this.drawMineField();
    this.setData({
      buttionText: '开始游戏'
    })
  },
  setGame: function () {
    this.drawMineField();
    this.createMinesMap();
    this.setMinesLeft();
    this.timeGoReset();
    this.timeGoClock();
    this.endOfTheGame = false;
    this.safeMinesGo = 0;
    this.setData({
      buttionText: '重新开始'
    })

  },
  setMinesLeft: function () {
    this.minesLeft = this.mineCount;
    this.setData({
      minesLeft: this.minesLeft
    });
  },
  timeGoClock: function () {
    var self = this;
    this.timeInterval = setInterval(function () { //计时
      self.timesGo = self.timesGo + 1;
      self.setData({
        timesGo: self.timesGo
      });
    }, 1000); //1000毫秒=1秒
  },
  timeGoStop: function () {
    clearInterval(this.timeInterval); //结束计时
  },
  timeGoReset: function () { //时间重置
    clearInterval(this.timeInterval);
    this.timesGo = 0;
    this.setData({
      timesGo: this.timesGo
    });
  },
  createMinesMap: function () { //地图
    var tmpMineMap = {};
    for (var row = 0; row < this.rowCount; row++) {
      tmpMineMap[row] = [];
      for (var col = 0; col < this.colCount; col++) {
        tmpMineMap[row][col] = 0;
      }
    }
    this.mineCount = this.rangeRandom(this.minMineCount, this.maxMineCount); //总雷数
    var tmpCount = this.mineCount; //总雷数
    while (tmpCount > 0) {
      var row = this.rangeRandom(0, this.rowCount - 1);
      var col = this.rangeRandom(0, this.colCount - 1);
      if (tmpMineMap[row][col] != 9) {
        tmpMineMap[row][col] = 9; //该地区为雷
        tmpCount--;
      }
    }
    for (var row = 0; row < this.rowCount; row++) {
      for (var col = 0; col < this.colCount; col++) {
        for (var r = row - 1; r < row + 2; r++) {
          for (var c = col - 1; c < col + 2; c++) {
            if (c >= 0 && c < this.colCount && r >= 0 && r < this.rowCount &&
              !(r === row && c === col) && tmpMineMap[r][c] == 9 &&
              tmpMineMap[row][col] != 9) {
              tmpMineMap[row][col]++; //如果该值的四周存在雷，则+1；
            }
          }
        }
      }
    }
    this.mineMapMapping = tmpMineMap;
  },
  drawMineField: function () {
    var tmpMineMap = {};
    for (var row = 0; row < this.rowCount; row++) {
      tmpMineMap[row] = [];
      for (var col = 0; col < this.colCount; col++) {
        tmpMineMap[row][col] = -1;
      }
    }
    this.mineMap = tmpMineMap;
    this.setData({
      mineMap: this.mineMap
    })
  },
  demining: function (event) {
    if (JSON.stringify(this.mineMapMapping) == "{}") return; //将一个  JavaScript 值转换为一个 JSON 字符串
    var x = parseInt(event.target.dataset.x);
    var y = parseInt(event.target.dataset.y);
    var value = parseInt(event.target.dataset.value); //选定值的周围扫雷数和行列数
    if (this.flagOn) {
      this.flag(x, y, value);
      return;
    }
    if (value > 0) return;
    var valueMapping = this.mineMapMapping[x][y];
    if (valueMapping < 9) {
      this.mineMap[x][y] = valueMapping;
      this.setData({
        mineMap: this.mineMap
      });
      this.safeMinesGo++;
      console.log("Safe mine go: " + this.safeMinesGo);
      if ((this.safeMinesGo + this.mineCount) == (this.rowCount * this.colCount)) {
        this.success();
      }
    }
    if (valueMapping == 9) {
      this.failed();
    }
    if (valueMapping == 0) {
      this.openZeroArround(x, y);
      this.setData({
        mineMap: this.mineMap
      });
    }
  },

  success: function () {
    wx.showToast({
      title: 'Good Job !',
      image: '../../images/game/emoticon_happy.png',
      duration: 3000
    })
    this.timeGoStop();
    this.endOfTheGame = true;
  },

  failed: function () {
    wx.showToast({
      title: 'Bomb !!!',
      image: '../../images/game/emoticon_sad.png',
      mask: true,
      duration: 3000
    })
    this.showAll();
    this.timeGoStop();
    this.endOfTheGame = true;
  },
  openZeroArround: function (row, col) {
    for (var r = (row - 1); r < (row + 2); r++) {
      for (var c = (col - 1); c < (col + 2); c++) {
        if (r >= 0 && r < this.rowCount &&
          c >= 0 && c < this.colCount &&
          !(r === row && c === col) &&
          this.mineMap[r][c] < 0) {
          this.mineMap[r][c] = this.mineMapMapping[r][c];
          this.safeMinesGo++;
          if (this.mineMapMapping[r][c] == 0) {
            this.openZeroArround(r, c);
          }

        }
      }
    }
    console.log("Safe mine go: " + this.safeMinesGo);
    if ((this.safeMinesGo + this.mineCount) == (this.rowCount * this.colCount)) {
      this.success();
    }

  },
  flagSwitch: function (e) {
    if (e.detail.value) {
      this.flagOn = true;
    } else {
      this.flagOn = false;
    }
  },

  flag: function (x, y, value) {
    if (value > 0 && value < 10) return;
    if (value == 10) {
      this.pullUpFlag(x, y);
      return;
    }
    if (this.minesLeft <= 0) return;
    this.minesLeft = this.minesLeft - 1;
    this.mineMap[x][y] = 10;
    this.setData({
      mineMap: this.mineMap,
      minesLeft: this.minesLeft
    });
  },

  pullUpFlag: function (x, y) {
    if (this.minesLeft < this.mineCount) {
      this.minesLeft = this.minesLeft + 1;
    }
    this.mineMap[x][y] = -1;
    this.setData({
      mineMap: this.mineMap,
      minesLeft: this.minesLeft
    });
  },
  rangeRandom: function (x, y) {
    var z = y - x + 1;
    return Math.floor(Math.random() * z + x);
  },

  showAll: function () { //显示整张地图
    this.mineMap = this.mineMapMapping;
    this.setData({
      mineMap: this.mineMap
    });
  }

});