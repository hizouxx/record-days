// miniprogram/pages/photoWallDetail/photoWallDetail.js
const app = getApp()
let query,
leftHeight = 0,
rightHeight = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    loading: true,
    photoData: {},
    pictrueList: [],
    leftList: [], // 定义左侧空数组
    rightList: [] // 定义右侧空数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let { id } = options
    this.getPhoto(id)
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

  getPhoto(id) {
    //调用云函数
    wx.cloud.callFunction({
      name: 'getPhotoDetail',
      data: {
        _id: id
      },
      success: res => {
        console.log(res, 'res')
        this.setData({
          photoData: res.result.data[0]
        })
        this.downloadImages()
      },
      fail: err => {
        wx.hideLoading()
        console.error('err', err)
      }
    })
  },

  /**
   * 从数据库获取图片的fileId，然后去云存储下载，最后加载出来
   */

  downloadImages() {
    wx.cloud.getTempFileURL({
      fileList: this.data.photoData.pictrueList,
      success: res => {
        // console.log('getTempFileURL', res)
        this.setData({
          pictrueList: res.fileList
        })
        this.isLeft()
      },
      fail: err => {
        console.error('err', err)
      }
    })
  },
  previewPhoto(e) {
    console.log(e)
    let { current } = e.currentTarget.dataset
    let urls = this.data.pictrueList.map( i=> i.tempFileURL)
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },

  async isLeft() {
    const { pictrueList, leftList, rightList } = this.data;
    query = wx.createSelectorQuery();
    for (const item of pictrueList) {
      leftHeight <= rightHeight ? leftList.push(item) : rightList.push(item); //判断两边高度，来觉得添加到那边
      await this.getBoxHeight(leftList, rightList);
    }
  },
  getBoxHeight(leftList, rightList) { //获取左右两边高度
    return new Promise((resolve, reject) => {
      this.setData({ leftList, rightList }, () => {
        query.select('#left').boundingClientRect();
        query.select('#right').boundingClientRect();
        query.exec((res) => {
          leftHeight = res[0].height; //获取左边列表的高度
          rightHeight = res[1].height; //获取右边列表的高度
          resolve();
        });
      });
      this.setData({
        loading: false
      })
    })
  }

})