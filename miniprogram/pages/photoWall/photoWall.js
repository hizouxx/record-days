// miniprogram/pages/photoWall/photoWall.js
const app = getApp()
import utils from '../../utils/util.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    theme: 0,
    loading: true,
    addBtnDisabled: false, // 新增按钮loading
    filePaths: [], // 照片临时路径列表
    filePathIds: [], // 照片上传到云存储-获得的id列表
    dataList: [] // 照片列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const theme = wx.getStorageSync('theme') || 0
    this.setData({
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
    this.getPhotoList()
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
   * 跳转详情页
   * @param {*} e 
   */
  pageToDetail(e) {
    const { id, type } = e.currentTarget.dataset
    const mediaType = type === 'video' ? 'video' : 'image'
    wx.navigateTo({
      url: '/pages/photoWallDetail/photoWallDetail?id=' + id + '&mediaType=' + mediaType,
    })
  },

  chooseMediaType () {
    if(this.data.addBtnDisabled){
      return
    }
    wx.showActionSheet({
      itemList: ['照片', '视频'],
      success: res => {
        // console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          wx.chooseMedia({
            mediaType: ['image'],
            sizeType: ['compressed'],
            sourceType: ['album'],
            success: res => {
              this.setData({
                filePaths: res.tempFiles,
                addBtnDisabled: true
              })
              wx.showLoading({
                title: '上传中',
              })
              this.doUpload('image')
            },
            fail: err => {
              wx.showToast({
                title: '取消上传',
                icon: 'none'
              })
            }
          })
        } else if (res.tapIndex == 1) {
          wx.chooseMedia({
            count: 1,
            mediaType: ['video'],
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
              this.setData({
                filePaths: res.tempFiles,
                addBtnDisabled: true
              })
              wx.showLoading({
                title: '上传中',
              })
              this.doUpload('video')
            },
            fail: err => {
              wx.showToast({
                title: '取消上传',
                icon: 'none'
              })
            }
          })
        }
      },
      fail: res=> {
        console.log(res.errMsg)
      }
    })
  },

  /**
   * 上传图片到存储，并获取到ids
   */
  doUpload(mediaType) {
    const timestamp = new Date().getTime();
    const YYMMDD = utils.formatDate(new Date())
    let arr = []
    this.data.filePaths.forEach((item, index) => {
      // console.log('tempFilePath', item.tempFilePath)
      // console.log('item.tempFilePath.match', item.tempFilePath.match(/\.[^.]+?$/)[0])
      // 上传
      wx.cloud.uploadFile({
        cloudPath: YYMMDD + '/' + mediaType + '_' +timestamp + '_' + index + item.tempFilePath.match(/\.[^.]+?$/)[0],
        filePath: item.tempFilePath,
        success: res => {
          arr.push(res.fileID)
          if (arr?.length === this.data.filePaths?.length) {
            // console.log('filePathIds', arr)
            this.setData({
              filePathIds: arr
            })
            this.cloudFunction(mediaType)
          }
        },
        fail: () => {
          wx.hideLoading()
          this.setData({
            addBtnDisabled: false
          })
          wx.showToast({
            title: '上传图片到云存储失败，请稍后再试',
            icon: 'none'
          })
        }
      })
    })
  },
  /**
   * 上传图片ids到数据库
   */
  cloudFunction(mediaType) {
    //调用云函数
    wx.cloud.callFunction({
      name: 'addPhoto',
      data: {
        openid: app.globalData.openid,
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        createTime: new Date().getTime(),
        pictrueList: this.data.filePathIds,
        total: this.data.filePathIds.length,
        name: mediaType === 'video' ? '未命名视频' : '未命名相册',
        mediaType,
      },
      success: res => {
        // console.log('res', res)
        wx.hideLoading()
        this.setData({
          addBtnDisabled: false
        })

        wx.showToast({
          title: '上传成功',
          icon: 'success'
        })
        this.getPhotoList()
      },
      fail: () => {
        wx.hideLoading()
        this.setData({
          addBtnDisabled: false
        })
        wx.showToast({
          title: '创建失败，请稍后再试',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 从数据库获取图片的fileId，然后去云存储下载，最后加载出来
   */
  getPhotoList: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getPhotoList',
      data: {
        couple: [app.globalData.openid, app.globalData.bindOpenid],
      },
      success: res => {
        // console.log('res', res)
        let dataList = res.result && res.result.map(i => {
          i.date = utils.formatDate(new Date(i.createTime))
          return i
        }) || []
        this.setData({
          dataList,
          loading: false
        })
      },
      fail: () => {
        this.setData({
          loading: false
        })
      }
    })
  },

  /**
   * 操作相册->编辑or删除
   */
  actionPhoto(e) {
    wx.vibrateShort()
    const { id, name } = e.currentTarget.dataset
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success: res => {
        // console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '/pages/photoWallEdit/photoWallEdit?id=' + id + '&name=' + name,
          })
        } else if(res.tapIndex == 1) {
          wx.showLoading({
            title: '操作中',
          })
          wx.cloud.callFunction({
            name: 'deletePhotoWall',
            data: { id },
            success: res => {
              // console.log('res', res)
              wx.hideLoading()
              wx.showToast({
                title: '删除成功',
              })
              this.getPhotoList()
            },
            fail: () => {
              wx.hideLoading()
            }
          })
        }
      },
      fail: res => {
        // console.log(res.errMsg)
      }
    })
  },
})
