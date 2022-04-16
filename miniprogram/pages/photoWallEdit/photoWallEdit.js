// pages/photoEdit/photoEdit.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    theme: 0,
    curId: '', // 当前选中（操作的相册id）
    photosName: '', // 相册名称
    editBtnDisabled: false, // 编辑（更改相册名称）按钮loading
    btnLoading: false, // loading
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    const { id, name } = options
    const theme = wx.getStorageSync('theme') || 0
    this.setData({
      curId: id,
      photosName: name,
      theme
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
   * 相册名称输入框
   * @param {*} e 
   */
  onInput(e) {
    // console.log(e)
    this.setData({
      photosName: e.detail.value
    })
  },

  /**
   * 调用云函数进行审核
   */
  checkMsg(){
    const { photosName } = this.data
    if(photosName.trim() === '') {
      wx.showToast({
        title: '相册名不能为空',
        icon: 'none'
      })
      return
    }
    this.setData({
      editBtnDisabled: true,
      btnLoading: true
    })
    wx.cloud.callFunction({
      name: 'checkMsg' ,
      data:{
        'content': this.data.photosName
      },
      success: res => {
        // console.log(res)
        //获取状态码  0-正常   87014-违规
        if(res.result.errCode != 0) {
          this.setData({
            editBtnDisabled: false,
            btnLoading: false
          })
          wx.showToast({
            title: '输入的内容违规',
            icon: 'none'
          })
        } else {
          this.confirmEdit()
        }
      },
      fail: err => {
        console.error('err', err)
        this.setData({
          editBtnDisabled: false,
          btnLoading: false
        })
      }
    }) 
  },
  /**
   * 编辑相册名称
   */
  confirmEdit() {
    const { photosName, curId} = this.data
    wx.cloud.callFunction({
      name: 'editPhotoWall',
      data: {
        id: curId,
        name: photosName,
      },
      success: res => {
        // console.log('res', res)
        wx.showToast({
          title: '修改成功',
        })
        this.setData({
          editBtnDisabled: false,
          btnLoading: false,
          photosName: '',
          curId: ''
        })
        wx.navigateBack()
      },
      fail: err => {
        this.setData({
          editBtnDisabled: false,
          btnLoading: false
        })
      }
    })
  }
})
