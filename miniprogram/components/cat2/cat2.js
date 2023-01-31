// components/cat2/cat2.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isActive: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toggle () {
      if (this.data.isActive) return
      this.setData({
        isActive: true
      })
      setTimeout(() => {
        this.setData({
          isActive: false
        })
      }, 7000);
    }
  }
})