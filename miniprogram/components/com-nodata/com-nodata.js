// components/com-nodata/com-nodata.js
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    content: {
      type: String,
      default: ''
    }, 
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close () {
      this.setData({
        show: false
      })
    }
  }
})
