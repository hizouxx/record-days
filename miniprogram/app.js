//app.js
App({
  onLaunch: function () {
    // 更新
    this.autoUpdate()
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'memo-test-yjsx0',
        traceUser: true,
      })
    }
    this.globalData = {
      userInfo: {}, // 用户数据
      openid: '', //openid
      bindOpenid: '', // 绑定对象的openid
      // 主题色
      ColorList: [
        {
          title: '默认',
          name: 'black',
        },
        {
          title: '嫣红',
          name: 'red',
        },
        {
          title: '桔橙',
          name: 'orange',
        },
        {
          title: '明黄',
          name: 'yellow',
        },
        {
          title: '森绿',
          name: 'green',
        },
        {
          title: '天青',
          name: 'cyan',
        },
        {
          title: '海蓝',
          name: 'blue',
        },
        {
          title: '姹紫',
          name: 'purple',
        }
      ],
      // 收入来源
      IncomeList: [
        {
          name: '工资',
          icon: 'sponsor'
        },
        {
          name: '理财',
          icon: 'refund'
        },
        {
          name: '版权',
          icon: 'brand'
        },
        {
          name: '红包',
          icon: 'redpacket'
        },
        {
          name: '借款',
          icon: 'recharge'
        },
        {
          name: '退款',
          icon: 'repeal'
        },
        {
          name: '报销',
          icon: 'text'
        },
        {
          name: '现金',
          icon: 'coin'
        },
        {
          name: '其他',
          icon: 'moreandroid'
        }
      ],
      // 支出去向
      PayList: [
        {
          name: '吃饭',
          icon: 'shop'
        },
        {
          name: '房租',
          icon: 'home'
        },
        {
          name: '送礼',
          icon: 'goods'
        },
        {
          name: '交通',
          icon: 'taxi'
        },
        {
          name: '娱乐',
          icon: 'ticket'
        },
        {
          name: '日用',
          icon: 'cart'
        },
        {
          name: '教育',
          icon: 'upstage'
        },
        {
          name: '医疗',
          icon: 'like'
        },
        {
          name: '保险',
          icon: 'safe'
        },
        {
          name: '红包',
          icon: 'redpacket'
        },
        {
          name: '其他',
          icon: 'moreandroid'
        }
      ],
      // 纪念日类型
      SpecialDayList: [
        {
          name: '生日',
          icon: 'crown'
        },
        {
          name: '相遇',
          icon: 'evaluate'
        },
        {
          name: '恋爱',
          icon: 'hot'
        },
        {
          name: '结婚',
          icon: 'read'
        },
        {
          name: '生子',
          icon: 'my'
        },
        {
          name: '其他',
          icon: 'moreandroid'
        }
      ],
    }

    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;  
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },

  /**
   * 自动更新新版本
   */
  autoUpdate() {
    let that = this
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
        //1. 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //检测到新版本，需要更新，给出提示
          wx.showModal({
            title: '更新提示',
            content: '检测到新版本，是否下载新版本并重启小程序？',
            success: function(res) {
              if (res.confirm) {
                //2. 用户确定下载更新小程序，小程序下载及更新静默进行
                that.downLoadAndUpdate(updateManager)
              }
            }
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本或系统版本过低，无法自动更新小程序。可手动删除当前小程序，重新搜索打开'
      })
    }
  },

  /**
   * 下载小程序新版本并重启应用
   */
  downLoadAndUpdate(updateManager) {
    wx.showLoading({
      title: '下载中···',
    });
    //静默下载更新小程序新版本
    updateManager.onUpdateReady(function() {
      wx.hideLoading()
      //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate()
    })
    updateManager.onUpdateFailed(function() {
      // 新的版本下载失败
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '下载失败。可手动删除当前小程序，并重新搜索打开本小程序体验新版本',
      })
    })
  }
})
