// miniprogram/pages/photoWall/photoWall.js
const app = getApp()
const utils = require('../../utils/util.js')
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
    editBtnDisabled: false, // 编辑（更改相册名称）按钮loading
    showModal: false, // 是否展示编辑弹框
    curId: '', // 当前选中（操作的相册id）
    photosName: '', // 相册名称
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
    this.getPhotoList()
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
   * 显示/关闭编辑弹框
   */
  toggleModal() {
    this.setData({
      showModal: !this.data.showModal
    })
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
   * 跳转详情页
   * @param {*} e 
   */
  pageToDetail(e) {
    let {id} = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/photoWallDetail/photoWallDetail?id=' + id,
    })
  },

  /**
   * 选择图片
   */
  chooseImage () {
    if(this.data.addBtnDisabled){
      return
    }
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        console.log(res)
        this.setData({
          filePaths: res.tempFilePaths
        })
        this.setData({
          addBtnDisabled: true
        })
        wx.showLoading()
        this.checkImg()
      },
      fail: err => {
        wx.showToast({
          title: '取消上传',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 调用云函数进行审核（图片）
   */
  checkImg() {
    //获取图片的临时路径
    const tempFilePaths = this.data.filePaths[0]
    //使用getFileSystemManager获取图片的Buffer流
    wx.getFileSystemManager().readFile({
      filePath: tempFilePaths,                   
      success: (res)=>{            
        const buffer = res.data
        wx.cloud.callFunction({
          name: 'checkImg',              
          data:{
            'buffer': buffer
          },
          success: res => {
            // console.log(res)
            //获取状态码  0-正常   87014-违规
            if(res.result.errCode != 0) {
              wx.hideLoading()
              this.setData({
                addBtnDisabled: false
              })
              wx.showToast({
                title: '输入的内容违规',
                icon: 'none'
              })
            } else {
              this.doUpload()
            }
          },
          fail: err => {
            console.error('err', err)
            wx.hideLoading()
            this.setData({
              addBtnDisabled: false
            })
            wx.showToast({
              title: '上传图片过大，请压缩图片后上传',
              icon: 'none'
            })
          }
        })
      }
    })
  },

  /**
   * 上传图片到存储，并获取到ids
   */
  doUpload() {
    let timestamp = new Date().getTime();
    let arr = []
    this.data.filePaths.forEach((item, index) => {
      // 上传图片
      wx.cloud.uploadFile({
        cloudPath: timestamp +'-'+ index + item.match(/\.[^.]+?$/)[0],
        filePath: item,
        success: res => {
          arr.push(res.fileID)
          if (arr.length === this.data.filePaths.length) {
            console.log('filePathIds', arr)
            this.setData({
              filePathIds: arr
            })
            this.cloudFunction()
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
  cloudFunction() {
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
        name: '未命名相册'
      },
      success: res => {
        console.log('res', res)
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
          title: '创建相册失败，请稍后再试',
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
        console.log('res', res)
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
    let { id } = e.currentTarget.dataset
    this.setData({
      curId: id
    })
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success: res => {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          this.toggleModal()
        } else if(res.tapIndex == 1) {
          wx.showLoading()
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
        console.log(res.errMsg)
      }
    })
  },

  /**
   * 调用云函数进行审核
   */
  checkMsg(){
    let { photosName } = this.data
    if(photosName.trim() === '') {
      wx.showToast({
        title: '相册名不能为空',
        icon: 'none'
      })
      return
    }
    this.setData({
      editBtnDisabled: true
    })
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'checkMsg' ,
      data:{
        'content': this.data.photosName
      },
      success: res => {
        // console.log(res)
        //获取状态码  0-正常   87014-违规
        if(res.result.errCode != 0) {
          wx.hideLoading()
          this.setData({
            editBtnDisabled: false
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
        wx.hideLoading()
        this.setData({
          editBtnDisabled: false
        })
      }
    }) 
  },
  /**
   * 编辑相册名称
   */
  confirmEdit() {
    let { photosName, curId} = this.data
    wx.cloud.callFunction({
      name: 'editPhotoWall',
      data: {
        id: curId,
        name: photosName,
      },
      success: res => {
        console.log('res', res)
        wx.hideLoading()
        wx.showToast({
          title: '修改成功',
        })
        this.setData({
          editBtnDisabled: false,
          photosName: '',
          curId: ''
        })
        this.toggleModal()
        this.getPhotoList()
      },
      fail: err => {
        wx.hideLoading()
        this.setData({
          editBtnDisabled: false
        })
      }
    })
  }
})
