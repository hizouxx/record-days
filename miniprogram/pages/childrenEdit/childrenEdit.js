// pages/childrenEdit/childrenEdit.js
import utils from '../../utils/util.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    theme: 0,
    id: null,
    childrenName: '',
    date: utils.formatDate(new Date()), // 日期
    endTotoday: utils.formatDate4(new Date()), // 今日
    avatarDIY: "",
    amount: 0,
    isEdit: false,
    btnDisabled: false, // 提交按钮可点状态
    btnLoading: false, // 提交按钮上loading状态
    filePaths: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log('options', options.paramsStr)
    if (options && options.paramsStr) {
      const { _id, name, birthday, avatar, piggyBank } = JSON.parse(options.paramsStr)
      this.setData({
        id: _id,
        childrenName: name,
        date: utils.formatDate(new Date(birthday)),
        avatarDIY: avatar,
        amount: piggyBank,
        isEdit: true
      })
    }
    const theme = wx.getStorageSync('theme') || 0
    this.setData({
      theme
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


  /**
   * 选择日期
   * @param {*} e 
   */
  dateChange(e) {
    this.setData({
      date: e.detail.value,
    })
  },
  /**
   * 金额输入框
   * @param {*} e 
   */
  amountInput(e) {
    // console.log(e)
    let value = e.detail.value;

    // 只保留数字部分
    value = value.replace(/[^0-9]/g, '');

    // 去掉开头多余的 "0"，但保留单个 "0"
    if (value.length > 1 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    this.setData({
      amount: value,
    });
  },
  /**
   * 姓名输入框
   * @param {*} e 
   */
  childrenNameInput(e) {
    // console.log(e)
    this.setData({
      childrenName: e.detail.value
    })
  },

  /**
   * 调用云函数进行审核文字合法性
   */
  checkMsg() {
    if(this.data.btnDisabled) {
      return
    }
    let { childrenName } = this.data
    if(childrenName.trim() === '') {
      wx.showToast({
        title: '请输入孩子姓名',
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
        'content': this.data.childrenName
      },
      success: res => {
        // console.log(res)
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
      fail: err => {
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
    let { isEdit, id, date, childrenName, avatarDIY, amount } = this.data
    if (isEdit) {
      wx.cloud.callFunction({
        name: 'editChildren',
        data: {
          id,
          name: childrenName,
          avatar: avatarDIY,
          piggyBank: amount,
          birthday: new Date(new Date(date).setHours(0,0,0,0)).getTime(),
        },
        success: res => {
          // console.log(res)
          this.setData({
            btnDisabled: false,
            btnLoading: false,
          })
          wx.showToast({
            title: '编辑成功'
          })
          wx.navigateBack()
        },
        fail: err => {
          console.error('err', err)
          this.setData({
            btnDisabled: false,
            btnLoading: false,
          })
        }
      })

    } else {
      // console.log('app.globalData.openid', app.globalData)
      wx.cloud.callFunction({
        name: 'addChildren',
        data: {
          openid: app.globalData.openid,
          name: childrenName,
          avatar: avatarDIY,
          piggyBank: amount,
          paymentList: [],
          birthday: new Date(new Date(date).setHours(0,0,0,0)).getTime(),
        },
        success: res => {
          // console.log(res)
          this.setData({
            btnDisabled: false,
            btnLoading: false,
          })
          wx.showToast({
            title: '添加成功'
          })
          wx.navigateBack()
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
  },


  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    const timestamp = new Date().getTime();
    // 上传图片
    wx.showLoading({
      title: '上传中',
    })
    wx.cloud.uploadFile({
      cloudPath: 'avatar/' + timestamp + avatarUrl.match(/\.[^.]+?$/)[0],
      filePath: avatarUrl,
      success: res => {
        // console.log('res', res)
        wx.hideLoading()
        this.setData({
          avatarDIY: res.fileID
        })
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          title: '上传图片到云存储失败，请稍后再试',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 选择图片
   */
  // chooseImage () {
  //   wx.chooseMedia({
  //     count: 1,
  //     mediaType: ['image'],
  //     sizeType: ['compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: res => {
  //       console.log(res)
  //       this.setData({
  //         filePaths: res.tempFiles
  //       })
  //       wx.showLoading({
  //         title: '上传中',
  //       })
  //       this.doUpload()
  //     },
  //     fail: () => {
  //       wx.showToast({
  //         title: '取消上传',
  //         icon: 'none'
  //       })
  //     }
  //   })
  // },


  /**
   * 上传图片到存储，并获取到ids
   */
  // doUpload() {
  //   const timestamp = new Date().getTime();
  //   // 上传图片
  //   wx.cloud.uploadFile({
  //     cloudPath: 'avatar/' + timestamp + this.data.filePaths[0].tempFilePath.match(/\.[^.]+?$/)[0],
  //     filePath: this.data.filePaths[0].tempFilePath,
  //     success: res => {
  //       // console.log('res', res)
  //       wx.hideLoading()
  //       this.setData({
  //         avatarDIY: res.fileID
  //       })
  //     },
  //     fail: () => {
  //       wx.hideLoading()
  //       wx.showToast({
  //         title: '上传图片到云存储失败，请稍后再试',
  //         icon: 'none'
  //       })
  //     }
  //   })
  // },
})